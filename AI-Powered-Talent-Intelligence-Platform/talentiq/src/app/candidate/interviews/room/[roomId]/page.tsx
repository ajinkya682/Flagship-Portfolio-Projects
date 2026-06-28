'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWebRTC } from '@/hooks/useWebRTC';
import { 
  Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, 
  Clock, User, FileText, CheckCircle2, AlertCircle, RefreshCw,
  Minimize2, Maximize2
} from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
//
export default function InterviewRoomPage({ params }: { params: { roomId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { roomId } = params;
  
  // Create a temporary pseudo userId for socket connection (in a real app, from auth context)
  const [userId] = useState(() => Math.random().toString(36).substr(2, 9));
  
  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false); // Controls waiting room vs live room
  
  const isCandidate = searchParams?.get('role') === 'candidate';

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isSwapped, setIsSwapped] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const {
    localStream, remoteStream, isMuted, isVideoOff, isScreenSharing, isConnected,
    startLocalStream, toggleMic, toggleVideo, toggleScreenShare, endCall, socket
  } = useWebRTC({ roomId, userId, hasJoined });

  // 1. Fetch Room Data
  useEffect(() => {
    fetch(`/api/interviews/room/${roomId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load room');
        return res.json();
      })
      .then(data => {
        setRoomData(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [roomId]);

  // 2. Attach Media Streams to Video Elements
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, hasJoined, isSwapped]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, hasJoined, isSwapped]);

  // Listen for real-time chat messages
  useEffect(() => {
    if (!socket) return;
    
    const handleIncomingMessage = (newMessage: any) => {
      setRoomData((prev: any) => {
        if (!prev) return prev;
        // Check if message already exists to prevent duplicates
        const exists = prev.notes?.some((n: any) => n.timestamp === newMessage.timestamp && n.text === newMessage.text);
        if (exists) return prev;
        return {
          ...prev,
          notes: [...(prev.notes || []), newMessage]
        };
      });
    };

    socket.on('chat-message', handleIncomingMessage);
    
    return () => {
      socket.off('chat-message', handleIncomingMessage);
    };
  }, [socket]);

  // Handle Joining
  const handleJoin = async () => {
    await startLocalStream();
    setHasJoined(true);
  };

  // Handle Leave
  const handleLeave = () => {
    endCall();
    if (isCandidate) {
      router.push('/portal/dashboard');
    } else {
      router.push('/interviews');
    }
  };

  // Handle Saving Notes
  const saveNote = async () => {
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      const timestamp = new Date().toISOString();
      const newMessage = {
        text: noteText,
        authorId: isCandidate ? { name: roomData.candidate?.name || 'Candidate' } : { name: 'Recruiter' },
        timestamp
      };

      // Emit immediately for fast real-time UI
      if (socket) {
        socket.emit('chat-message', newMessage);
      }
      
      // Update local state immediately
      setRoomData((prev: any) => ({
        ...prev,
        notes: [...(prev?.notes || []), newMessage]
      }));
      setNoteText('');

      // Persist to DB in background
      await fetch(`/api/interviews/room/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: noteText })
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0F172A]">
        <div className="w-[40px] h-[40px] rounded-full border-2 border-indigo-200 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-[#0F172A] text-white">
        <AlertCircle size={48} className="text-red-500 mb-[16px]" />
        <h1 className="text-[24px] font-display font-bold">Room Not Found</h1>
        <p className="text-white/60 mt-[8px]">The interview link is invalid or expired.</p>
        <button onClick={() => router.push(isCandidate ? '/portal/dashboard' : '/interviews')} className="mt-[24px] px-[20px] py-[10px] bg-indigo-600 rounded-[8px] font-bold">
          Back to Dashboard
        </button>
      </div>
    );
  }

  // --- WAITING ROOM ---
  if (!hasJoined) {
    const isEarly = new Date() < new Date(roomData.scheduledAt);
    return (
      <div className="flex h-screen bg-[#0F172A] p-[24px] md:p-[48px] overflow-hidden items-center justify-center relative">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none transform -translate-x-1/2 translate-y-1/2" />
        
        <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-[40px] relative z-10">
          {/* Left: Info */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-[6px] px-[12px] py-[4px] rounded-full bg-white/5 border border-white/10 text-[12px] font-bold text-indigo-300 uppercase tracking-wider mb-[24px] self-start backdrop-blur-md">
              <Video size={14} /> TalentIQ Interview Room
            </div>
            <h1 className="text-[32px] md:text-[48px] font-display font-bold text-white leading-tight mb-[16px]">
              Ready to join?
            </h1>
            <div className="flex items-start gap-[16px] mb-[32px] p-[20px] bg-white/5 border border-white/10 rounded-[16px] backdrop-blur-md">
              <div className="w-[48px] h-[48px] rounded-[12px] bg-indigo-500/20 flex items-center justify-center shrink-0">
                <User size={24} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-white">{roomData.job?.title} Interview</h3>
                <p className="text-[14px] text-white/60 flex items-center gap-[6px] mt-[4px]">
                  <Clock size={14} /> Scheduled for {new Date(roomData.scheduledAt).toLocaleString()}
                </p>
                <div className="flex items-center gap-[8px] mt-[12px]">
                  <span className="text-[12px] font-bold text-white/40 uppercase tracking-wider">Candidate:</span>
                  <span className="px-[10px] py-[2px] rounded-full bg-white/10 text-[12px] text-white">{roomData.candidate?.name}</span>
                </div>
              </div>
            </div>

            {isEarly && (
              <div className="p-[16px] bg-amber-500/10 border border-amber-500/20 rounded-[12px] mb-[24px] flex items-start gap-[12px]">
                <Clock size={20} className="text-amber-400 shrink-0 mt-[2px]" />
                <p className="text-[13px] text-amber-200/80 leading-relaxed">
                  You are early. You can wait here until the candidate arrives, or join the room now.
                </p>
              </div>
            )}

            <button 
              onClick={handleJoin}
              className="h-[52px] w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[15px] rounded-[12px] shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-[8px]"
            >
              Join Room Now
            </button>
          </div>

          {/* Right: Preview (Dummy video box before getUserMedia is called, or you can start getUserMedia early) */}
          <div className="bg-[#1E293B] border border-white/10 rounded-[24px] aspect-video flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
             <div className="w-[80px] h-[80px] rounded-full bg-white/5 flex items-center justify-center mb-[16px]">
               <Video size={32} className="text-white/20" />
             </div>
             <p className="text-white/40 font-medium text-[14px]">Camera preview will start when you join.</p>
          </div>
        </div>
      </div>
    );
  }

  // --- LIVE ROOM ---
  return (
    <div className="flex flex-col h-screen bg-[#0F172A] overflow-hidden font-body">
      {/* Top Header */}
      <div className="h-[60px] px-[24px] bg-[#1E293B] border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-[16px]">
          <div className="flex items-center justify-center w-[32px] h-[32px] bg-indigo-500 rounded-[8px]">
            <Video size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-[14px] font-bold text-white">{roomData.job?.title} - {roomData.candidate?.name}</h2>
            <div className="flex items-center gap-[6px] text-[11px] font-medium text-white/50">
               <span className="w-[6px] h-[6px] rounded-full bg-emerald-500 animate-pulse" />
               {isConnected ? 'Connected to signaling server' : 'Connecting...'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-[12px]">
           <div className="px-[12px] py-[4px] bg-white/5 rounded-full border border-white/10 text-[12px] text-white/80 font-medium font-mono">
             {roomId}
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Video Area */}
        <div className="flex-1 relative flex flex-col p-[16px]">
          <div ref={videoContainerRef} className="flex-1 bg-black rounded-[24px] overflow-hidden relative shadow-2xl border border-white/5">
            
            {/* Background Video (Big) */}
            <div className="absolute inset-0">
              <video 
                ref={isSwapped ? localVideoRef : remoteVideoRef}
                autoPlay 
                playsInline
                muted={isSwapped ? true : false} 
                className="w-full h-full object-cover"
              />
              {(!isSwapped && !remoteStream) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1E293B]">
                  <div className="w-[100px] h-[100px] rounded-full bg-white/5 flex items-center justify-center mb-[24px]">
                     <span className="text-[32px] font-bold text-white/20">{roomData.candidate?.name?.charAt(0) || '?'}</span>
                  </div>
                  <p className="text-white/40 font-medium">Waiting for other participant to join...</p>
                </div>
              )}
            </div>

            {/* PiP Video (Small / Draggable) */}
            {!isMinimized ? (
              <motion.div 
                drag 
                dragConstraints={videoContainerRef}
                dragElastic={0.1}
                dragMomentum={false}
                initial={{ bottom: 24, right: 24 }}
                className="absolute w-[240px] aspect-video bg-neutral-800 rounded-[16px] overflow-hidden shadow-2xl border-2 border-white/10 transition-shadow hover:scale-105 group cursor-move z-10"
                onClick={() => setIsSwapped(!isSwapped)}
              >
                <video 
                  ref={isSwapped ? remoteVideoRef : localVideoRef} 
                  autoPlay 
                  playsInline 
                  muted={isSwapped ? false : true} 
                  className={`w-full h-full object-cover ${(isVideoOff && !isSwapped) ? 'opacity-0' : 'opacity-100'}`}
                />
                
                {/* Fallback if local video is off */}
                {(!isSwapped && isVideoOff) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                    <VideoOff size={24} className="text-white/40" />
                  </div>
                )}
                
                {/* Fallback if remote video is not connected (and we are swapped) */}
                {(isSwapped && !remoteStream) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                     <span className="text-[24px] font-bold text-white/20">{roomData.candidate?.name?.charAt(0) || '?'}</span>
                  </div>
                )}

                <div className="absolute bottom-[8px] left-[8px] px-[8px] py-[2px] bg-black/60 backdrop-blur-sm rounded-[4px] text-[10px] text-white font-medium">
                  {isSwapped ? 'Remote' : 'You'}
                </div>

                {/* Minimize Button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
                  className="absolute top-[8px] right-[8px] w-[24px] h-[24px] bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                >
                  <Minimize2 size={12} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute bottom-[24px] right-[24px] z-10"
              >
                <button 
                  onClick={() => setIsMinimized(false)}
                  className="h-[48px] px-[16px] bg-neutral-800 border-2 border-white/10 rounded-[12px] flex items-center gap-[8px] text-white font-medium shadow-2xl hover:bg-neutral-700 transition-colors"
                >
                  <Maximize2 size={16} /> Show {isSwapped ? 'Remote' : 'You'}
                </button>
              </motion.div>
            )}

          </div>

          {/* Bottom Controls */}
          <div className="h-[80px] mt-[16px] bg-[#1E293B] rounded-[24px] border border-white/5 flex items-center justify-center gap-[16px]">
            <button 
              onClick={toggleMic}
              className={`w-[48px] h-[48px] rounded-full flex items-center justify-center transition-all \${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button 
              onClick={toggleVideo}
              className={`w-[48px] h-[48px] rounded-full flex items-center justify-center transition-all \${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
            <button 
              onClick={toggleScreenShare}
              className={`w-[48px] h-[48px] rounded-full flex items-center justify-center transition-all \${isScreenSharing ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <MonitorUp size={20} />
            </button>
            <div className="w-[1px] h-[24px] bg-white/10 mx-[8px]" />
            <button 
              onClick={handleLeave}
              className="w-[64px] h-[48px] rounded-[16px] bg-red-600 text-white flex items-center justify-center hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>

        {/* Right Sidebar (Notes & Profile) */}
        <div className="w-[360px] bg-[#1E293B] border-l border-white/5 flex flex-col shrink-0">
          {/* Candidate Snapshot */}
          <div className="p-[24px] border-b border-white/5">
            <h3 className="text-[12px] font-bold text-white/40 uppercase tracking-wider mb-[16px] flex items-center gap-[6px]">
              <User size={12} /> Candidate Info
            </h3>
            <div className="flex items-center gap-[12px] mb-[16px]">
              <div className="w-[48px] h-[48px] rounded-full bg-indigo-500/20 flex items-center justify-center overflow-hidden border border-indigo-500/30">
                {roomData.candidate?.avatar ? (
                  <img src={roomData.candidate.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[18px] font-bold text-indigo-400">{roomData.candidate?.name?.charAt(0)}</span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-white text-[15px]">{roomData.candidate?.name}</h4>
                <p className="text-[12px] text-white/50">{roomData.candidate?.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-[6px]">
              {roomData.candidate?.extractedSkills?.slice(0, 5).map((skill: string) => (
                <span key={skill} className="px-[8px] py-[2px] bg-white/5 border border-white/10 rounded-[6px] text-[10px] text-white/70">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Live Chat */}
          <div className="flex-1 flex flex-col p-[24px] overflow-hidden">
             <h3 className="text-[12px] font-bold text-white/40 uppercase tracking-wider mb-[16px] flex items-center gap-[6px]">
              <FileText size={12} /> Room Chat
            </h3>
            
            <div className="flex-1 overflow-y-auto flex flex-col gap-[12px] mb-[16px] pr-[8px]">
              {(!roomData.notes || roomData.notes.length === 0) ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                   <FileText size={24} className="text-white/10 mb-[8px]" />
                   <p className="text-[12px] text-white/30">No messages yet. Say hello!</p>
                </div>
              ) : (
                roomData.notes?.map((note: any, i: number) => (
                  <div key={i} className="p-[12px] bg-white/5 border border-white/5 rounded-[12px]">
                    <div className="flex justify-between items-center mb-[8px]">
                      <span className="text-[11px] font-bold text-indigo-300">{note.authorId?.name || 'Recruiter'}</span>
                      <span className="text-[10px] text-white/30">{new Date(note.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[13px] text-white/80 leading-relaxed whitespace-pre-wrap">{note.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Note Input */}
            <div className="shrink-0 relative">
              <textarea 
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Type a note..."
                className="w-full bg-[#0F172A] border border-white/10 rounded-[12px] p-[12px] text-[13px] text-white placeholder:text-white/30 resize-none h-[100px] focus:outline-none focus:border-indigo-500/50 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    saveNote();
                  }
                }}
              />
              <div className="absolute bottom-[12px] right-[12px] flex items-center">
                {savingNote ? (
                  <RefreshCw size={14} className="text-white/30 animate-spin" />
                ) : (
                  <button 
                    onClick={saveNote}
                    disabled={!noteText.trim()}
                    className="p-[6px] bg-indigo-600 rounded-[6px] text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
