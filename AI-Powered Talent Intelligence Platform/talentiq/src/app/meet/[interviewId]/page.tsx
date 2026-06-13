'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDomainStore } from '@/store/domain.store'
import { Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp, MessageSquare, Settings, Users } from 'lucide-react'

export default function VideoMeetingRoom({ params }: { params: { interviewId: string } }) {
  const router = useRouter()
  const { interviews, candidates } = useDomainStore()
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  // Find interview details
  const interview = interviews.find(i => i.id === params.interviewId)
  const candidate = candidates.find(c => c.id === interview?.candidateId)

  useEffect(() => {
    if (!interview) {
      router.push('/dashboard') // Fallback if invalid
      return
    }

    // Request camera and microphone access
    const startMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (error) {
        console.error("Error accessing media devices.", error)
        // Handle error (e.g., permissions denied)
      }
    }

    startMedia()

    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [interview, router])

  // Toggle handlers
  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = screenStream
        }
        setIsScreenSharing(true)
        
        // Listen for user stopping screen share via browser UI
        screenStream.getVideoTracks()[0].onended = () => {
          if (videoRef.current && stream) {
            videoRef.current.srcObject = stream
          }
          setIsScreenSharing(false)
        }
      } catch (err) {
        console.error("Error sharing screen", err)
      }
    } else {
      // Revert to camera stream
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream
      }
      setIsScreenSharing(false)
    }
  }

  const handleLeave = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    // Try to go back, or fallback to portal/dashboard depending on user role
    router.back()
  }

  if (!interview || !candidate) {
    return <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">Loading meeting...</div>
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col font-body">
      
      {/* Top Header */}
      <div className="h-[60px] px-[24px] flex items-center justify-between text-white border-b border-white/10 shrink-0">
        <div>
          <h2 className="font-display font-bold text-[16px]">{interview.type} Interview</h2>
          <p className="text-[12px] text-neutral-400">with {candidate.name}</p>
        </div>
        <div className="flex items-center gap-[16px]">
          <span className="flex items-center gap-[6px] text-[13px] bg-red-500/20 text-red-400 px-[10px] py-[4px] rounded-full font-semibold">
            <div className="w-[8px] h-[8px] bg-red-500 rounded-full animate-pulse" />
            00:14:32
          </span>
          <button className="p-[8px] hover:bg-white/10 rounded-full transition-colors text-neutral-300 hover:text-white">
            <Users size={20} />
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 p-[24px] flex items-center justify-center gap-[24px]">
        
        {/* Mock Remote Participant (Since it's a prototype) */}
        <div className="relative w-full max-w-[800px] aspect-video bg-neutral-800 rounded-[24px] overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center group">
          {/* Simulated remote video feed placeholder */}
          <div className="flex flex-col items-center justify-center text-neutral-500">
            <div className="w-[80px] h-[80px] rounded-full bg-neutral-700 flex items-center justify-center mb-[16px] overflow-hidden">
               {candidate.avatar ? <img src={candidate.avatar} alt="" className="w-full h-full object-cover" /> : <Users size={32} />}
            </div>
            <p className="text-[16px] font-semibold text-white">{candidate.name}</p>
            <p className="text-[13px] text-neutral-400">Waiting for candidate to turn on video...</p>
          </div>
          
          <div className="absolute bottom-[20px] left-[20px] bg-black/50 backdrop-blur-md px-[12px] py-[6px] rounded-full text-white text-[13px] font-semibold flex items-center gap-[8px]">
             {candidate.name}
             <MicOff size={14} className="text-red-400" />
          </div>
        </div>

        {/* Local Participant (Real Webcam) */}
        <div className="absolute bottom-[100px] right-[40px] w-[300px] aspect-video bg-neutral-800 rounded-[16px] overflow-hidden border-2 border-neutral-700 shadow-xl z-10">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'} ${!isScreenSharing && 'scale-x-[-1]'}`} // Mirror camera, but not screen share
          />
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
              <div className="w-[50px] h-[50px] rounded-full bg-neutral-700 flex items-center justify-center">
                <Users size={24} className="text-neutral-400" />
              </div>
            </div>
          )}
          <div className="absolute bottom-[10px] left-[10px] bg-black/50 backdrop-blur-md px-[10px] py-[4px] rounded-full text-white text-[11px] font-semibold flex items-center gap-[6px]">
            You {isScreenSharing && '(Presenting)'}
            {isMuted && <MicOff size={12} className="text-red-400" />}
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="h-[80px] flex items-center justify-center gap-[16px] bg-neutral-950 px-[24px] pb-[10px]">
        <button 
          onClick={toggleMute}
          className={`w-[50px] h-[50px] rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}
        >
          {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
        </button>
        
        <button 
          onClick={toggleVideo}
          className={`w-[50px] h-[50px] rounded-full flex items-center justify-center transition-colors ${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}
        >
          {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
        </button>

        <button 
          onClick={toggleScreenShare}
          className={`w-[50px] h-[50px] rounded-full flex items-center justify-center transition-colors ${isScreenSharing ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}
        >
          <MonitorUp size={22} />
        </button>

        <div className="w-[1px] h-[24px] bg-white/10 mx-[8px]" />

        <button className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-neutral-800 text-white hover:bg-neutral-700 transition-colors">
          <MessageSquare size={22} />
        </button>

        <button className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-neutral-800 text-white hover:bg-neutral-700 transition-colors">
          <Settings size={22} />
        </button>

        <button 
          onClick={handleLeave}
          className="h-[50px] px-[24px] ml-[16px] rounded-full flex items-center justify-center gap-[8px] bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
        >
          <PhoneOff size={20} />
          Leave
        </button>
      </div>

    </div>
  )
}
