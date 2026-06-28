'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

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
  const socketRef = useRef<Socket | null>(null);
  const pendingIceCandidates = useRef<RTCIceCandidateInit[]>([]);
  
  // To handle local stream cleanly
  const localStreamRef = useRef<MediaStream | null>(null);
  localStreamRef.current = localStream;

  useEffect(() => {
    if (!hasJoined) return;

    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-room', { roomId, userId });
    });

    const createPeerConnection = (targetSocketId?: string) => {
      if (peerConnectionRef.current) peerConnectionRef.current.close();
      
      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionRef.current = pc;

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', { candidate: event.candidate });
        }
      };

      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      return pc;
    };

    socket.on('user-connected', async ({ userId: peerId, socketId }) => {
      const pc = createPeerConnection(socketId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('offer', { target: socketId, sdp: offer });
    });

    socket.on('offer', async (payload) => {
      const pc = createPeerConnection(payload.caller);
      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { target: payload.caller, sdp: answer });

      for (const c of pendingIceCandidates.current) {
        try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch(e) {}
      }
      pendingIceCandidates.current = [];
    });

    socket.on('answer', async (payload) => {
      if (peerConnectionRef.current && peerConnectionRef.current.signalingState !== 'stable') {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload.sdp));

        for (const c of pendingIceCandidates.current) {
          try { await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(c)); } catch(e) {}
        }
        pendingIceCandidates.current = [];
      }
    });

    socket.on('ice-candidate', async (payload) => {
      if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
        } catch (e) {
          console.error('Error adding ICE candidate', e);
        }
      } else {
        pendingIceCandidates.current.push(payload.candidate);
      }
    });

    socket.on('user-disconnected', () => {
      setRemoteStream(null);
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      pendingIceCandidates.current = [];
    });

    return () => {
      socket.disconnect();
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [roomId, userId, hasJoined]);

  const startLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error('Error accessing media devices.', err);
    }
  }, []);

  const toggleMic = async () => {
    if (!isMuted) {
      if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = false;
        }
      }
      setIsMuted(true);
      if (socketRef.current) socketRef.current.emit('toggle-media', { type: 'audio', isMuted: true });
    } else {
      if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = true;
        }
      }
      setIsMuted(false);
      if (socketRef.current) socketRef.current.emit('toggle-media', { type: 'audio', isMuted: false });
    }
  };

  const toggleVideo = async () => {
    if (!isVideoOff) {
      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = false;
        }
      }
      setIsVideoOff(true);
      if (socketRef.current) socketRef.current.emit('toggle-media', { type: 'video', isVideoOff: true });
    } else {
      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = true;
        }
      }
      setIsVideoOff(false);
      if (socketRef.current) socketRef.current.emit('toggle-media', { type: 'video', isVideoOff: false });
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
    if (socketRef.current) socketRef.current.disconnect();
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
    socket: socketRef.current,
  };
}
