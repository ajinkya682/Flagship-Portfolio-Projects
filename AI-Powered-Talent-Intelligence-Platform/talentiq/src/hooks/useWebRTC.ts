'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

interface WebRTCProps {
  roomId: string;
  userId: string;
  hasJoined: boolean;
}

export function useWebRTC({ roomId, userId, hasJoined }: WebRTCProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const lastPollRef = useRef<number>(Date.now() - 60000); // Look back 1 minute for initial connect
  const listenersRef = useRef<Record<string, Function[]>>({});
  
  // Mock socket interface for page.tsx compatibility
  const mockSocket = useRef({
    emit: async (event: string, payload: any) => {
      // POST to our signal API
      await fetch(`/api/interviews/room/${roomId}/signal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: userId, type: event, payload })
      }).catch(console.error);
    },
    on: (event: string, callback: Function) => {
      if (!listenersRef.current[event]) listenersRef.current[event] = [];
      listenersRef.current[event].push(callback);
    },
    off: (event: string, callback: Function) => {
      if (!listenersRef.current[event]) return;
      listenersRef.current[event] = listenersRef.current[event].filter(cb => cb !== callback);
    },
    disconnect: () => {}
  });

  // Signaling polling loop
  useEffect(() => {
    if (!hasJoined) return;

    // We consider ourselves connected to the signaling mechanism once we start polling
    setIsConnected(true);
    
    // Announce presence
    mockSocket.current.emit('user-connected', { userId });

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/interviews/room/${roomId}/signal?since=${lastPollRef.current}`);
        if (!res.ok) return;
        const signals = await res.json();
        
        if (signals && signals.length > 0) {
          lastPollRef.current = new Date(signals[signals.length - 1].createdAt).getTime();

          for (const signal of signals) {
            if (signal.senderId === userId) continue; // Skip our own signals
            
            // Dispatch to registered mockSocket listeners
            const callbacks = listenersRef.current[signal.type] || [];
            callbacks.forEach(cb => cb(signal.payload));

            // Internal WebRTC handling
            if (signal.type === 'user-connected') {
              const peerConnection = createPeerConnection(signal.senderId);
              const offer = await peerConnection.createOffer();
              await peerConnection.setLocalDescription(offer);
              mockSocket.current.emit('offer', { target: signal.senderId, caller: userId, sdp: offer });
            } 
            else if (signal.type === 'offer' && signal.payload.target === userId) {
              const peerConnection = createPeerConnection(signal.payload.caller);
              await peerConnection.setRemoteDescription(new RTCSessionDescription(signal.payload.sdp));
              const answer = await peerConnection.createAnswer();
              await peerConnection.setLocalDescription(answer);
              mockSocket.current.emit('answer', { target: signal.payload.caller, caller: userId, sdp: answer });
            }
            else if (signal.type === 'answer' && signal.payload.target === userId) {
              if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal.payload.sdp));
              }
            }
            else if (signal.type === 'ice-candidate' && signal.payload.target === userId) {
              if (peerConnectionRef.current) {
                try {
                  await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(signal.payload.candidate));
                } catch (e) {
                  console.error('Error adding ICE candidate', e);
                }
              }
            }
            else if (signal.type === 'user-disconnected') {
              setRemoteStream(null);
              if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
              }
            }
          }
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 2000); // Poll every 2 seconds

    return () => {
      clearInterval(pollInterval);
      mockSocket.current.emit('user-disconnected', { userId });
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [roomId, userId, hasJoined]);

  // Start Local Media
  const startLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  }, []);

  const createPeerConnection = (targetUserId: string) => {
    if (peerConnectionRef.current) peerConnectionRef.current.close();
    
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        mockSocket.current.emit('ice-candidate', {
          target: targetUserId,
          caller: userId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    return pc;
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        mockSocket.current.emit('toggle-media', { type: 'audio', isMuted: !audioTrack.enabled });
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
        mockSocket.current.emit('toggle-media', { type: 'video', isVideoOff: !videoTrack.enabled });
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        
        if (peerConnectionRef.current) {
          const sender = peerConnectionRef.current.getSenders().find(s => s.track?.kind === 'video');
          if (sender) sender.replaceTrack(screenTrack);
        }
        
        setLocalStream((prev) => {
          if (!prev) return screenStream;
          const newStream = new MediaStream([screenTrack, ...prev.getAudioTracks()]);
          return newStream;
        });
        
        setIsScreenSharing(true);
        screenTrack.onended = () => stopScreenShare();
      } catch (err) {
        console.error('Error sharing screen', err);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = async () => {
    try {
      const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const camTrack = camStream.getVideoTracks()[0];
      
      if (peerConnectionRef.current) {
        const sender = peerConnectionRef.current.getSenders().find(s => s.track?.kind === 'video');
        if (sender) sender.replaceTrack(camTrack);
      }
      
      setLocalStream((prev) => {
        if (!prev) return camStream;
        const newStream = new MediaStream([camTrack, ...prev.getAudioTracks()]);
        return newStream;
      });
      
      setIsScreenSharing(false);
    } catch (err) {
      console.error('Error reverting to camera', err);
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    mockSocket.current.emit('user-disconnected', { userId });
  };

  return {
    localStream,
    remoteStream,
    isMuted,
    isVideoOff,
    isScreenSharing,
    isConnected,
    startLocalStream,
    toggleMic,
    toggleVideo,
    toggleScreenShare,
    endCall,
    socket: mockSocket.current,
  };
}
