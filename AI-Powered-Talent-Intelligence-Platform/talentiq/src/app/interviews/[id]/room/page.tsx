'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Settings, MonitorUp } from 'lucide-react';

export default function InterviewRoomPage({ params }: { params: { id: string } }) {
  // State for media tracks
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  
  // State for layout
  const [isSwapped, setIsSwapped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Initialize local webcam
  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Failed to get local media stream", err);
      }
    }
    setupCamera();

    return () => {
      // Cleanup stream tracks when component unmounts
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Sync state to actual tracks
  useEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoEnabled;
      });
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isAudioEnabled;
      });
    }
  }, [isVideoEnabled, isAudioEnabled, localStream]);

  // Use a stock video URL for the mock "candidate/remote" feed
  // Alternatively, we could just loop a dummy blob, but an open MP4 URL is best for visual testing.
  const MOCK_REMOTE_VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

  const toggleVideo = () => setIsVideoEnabled(prev => !prev);
  const toggleAudio = () => setIsAudioEnabled(prev => !prev);
  const swapVideos = () => setIsSwapped(prev => !prev);

  // Render video elements
  const localVideoEl = (
    <div className="relative w-full h-full bg-neutral-800 flex items-center justify-center overflow-hidden">
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted // Always mute local video so we don't hear ourselves
        className={`w-full h-full object-cover ${!isVideoEnabled ? 'hidden' : ''} -scale-x-100`}
      />
      {!isVideoEnabled && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500">
          <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mb-4">
            <VideoOff size={24} className="text-neutral-400" />
          </div>
          <p className="font-body text-sm">Camera is off</p>
        </div>
      )}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-semibold flex items-center gap-2">
        You {!isAudioEnabled && <MicOff size={12} className="text-red-400" />}
      </div>
    </div>
  );

  const remoteVideoEl = (
    <div className="relative w-full h-full bg-neutral-900 flex items-center justify-center overflow-hidden">
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        loop
        muted // Muted for testing so the stock video doesn't blare audio
        src={MOCK_REMOTE_VIDEO_URL}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-semibold flex items-center gap-2">
        Candidate
      </div>
    </div>
  );

  // Determine what goes where based on `isSwapped`
  const backgroundVideo = isSwapped ? localVideoEl : remoteVideoEl;
  const pipVideo = isSwapped ? remoteVideoEl : localVideoEl;

  return (
    <div className="flex h-screen w-full flex-col bg-black overflow-hidden font-body relative">
      
      {/* Top Bar Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-neutral-900/80 backdrop-blur-md rounded-xl border border-white/10 pointer-events-auto">
            <h2 className="text-white font-display font-semibold">Interview Room: {params.id}</h2>
            <p className="text-neutral-400 text-xs flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live
            </p>
          </div>
        </div>
        <div className="pointer-events-auto">
          <button className="w-10 h-10 rounded-full bg-neutral-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-neutral-800 transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div 
        ref={containerRef} 
        className="flex-1 w-full h-full relative"
      >
        {/* Background Fullscreen Video */}
        <div className="absolute inset-0">
          {backgroundVideo}
        </div>

        {/* Draggable PiP Video Container */}
        <motion.div
          drag
          dragConstraints={containerRef}
          dragElastic={0.1}
          dragMomentum={false}
          className="absolute z-30 bottom-24 right-6 w-[200px] sm:w-[240px] md:w-[280px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-neutral-700/50 bg-neutral-900 cursor-grab active:cursor-grabbing hover:border-neutral-500/50 transition-colors"
          style={{ touchAction: 'none' }}
        >
          {/* PiP Overlay to handle swap click without interfering with drag */}
          <div 
            className="absolute inset-0 z-40 hover:bg-white/10 transition-colors"
            onDoubleClick={swapVideos}
            onClick={swapVideos}
            title="Click to swap views, drag to move"
          />
          {pipVideo}
        </motion.div>
      </div>

      {/* Bottom Control Bar */}
      <div className="h-24 w-full flex items-center justify-center gap-4 md:gap-6 bg-neutral-950/90 backdrop-blur-xl border-t border-white/5 z-40 px-6 relative shrink-0">
        <button 
          onClick={toggleAudio}
          className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full transition-all ${
            isAudioEnabled 
              ? 'bg-neutral-800 text-white hover:bg-neutral-700' 
              : 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
          }`}
          title={isAudioEnabled ? "Mute Microphone" : "Unmute Microphone"}
        >
          {isAudioEnabled ? <Mic className="w-5 h-5 md:w-6 md:h-6" /> : <MicOff className="w-5 h-5 md:w-6 md:h-6" />}
        </button>
        
        <button 
          onClick={toggleVideo}
          className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full transition-all ${
            isVideoEnabled 
              ? 'bg-neutral-800 text-white hover:bg-neutral-700' 
              : 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
          }`}
          title={isVideoEnabled ? "Turn Off Camera" : "Turn On Camera"}
        >
          {isVideoEnabled ? <Video className="w-5 h-5 md:w-6 md:h-6" /> : <VideoOff className="w-5 h-5 md:w-6 md:h-6" />}
        </button>
        
        <button 
          className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
          title="Share Screen"
        >
          <MonitorUp className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div className="w-px h-8 bg-neutral-800 mx-2" />

        <button 
          className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all hover:scale-105"
          title="End Call"
          onClick={() => {
            if (localStream) {
              localStream.getTracks().forEach(track => track.stop());
            }
            window.location.href = '/candidate/dashboard';
          }}
        >
          <PhoneOff className="w-6 h-6 md:w-7 md:h-7" />
        </button>
      </div>
    </div>
  );
}
