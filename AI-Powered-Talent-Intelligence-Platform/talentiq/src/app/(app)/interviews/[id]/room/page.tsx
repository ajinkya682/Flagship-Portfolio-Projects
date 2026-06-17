import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Mic, MonitorUp, PhoneOff } from 'lucide-react';

// This is a placeholder for a real WebRTC integration like Daily.co or LiveKit.
// In a production environment, you would use @daily-co/daily-react here.

export default function InterviewRoomPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-screen w-full flex-col bg-neutral-900">
      <div className="flex flex-1 items-center justify-center p-6">
        {/* Main Video Area */}
        <div className="relative flex h-full w-full max-w-6xl overflow-hidden rounded-2xl bg-black">
          <div className="absolute inset-0 flex items-center justify-center text-white/50">
            <p className="text-lg">Waiting for candidate to join...</p>
          </div>
          
          {/* Self View (Picture in Picture) */}
          <div className="absolute bottom-6 right-6 h-48 w-64 overflow-hidden rounded-xl border-2 border-neutral-800 bg-neutral-800">
            <div className="flex h-full w-full items-center justify-center text-neutral-500">
              Your Camera
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex h-24 w-full items-center justify-center gap-4 border-t border-neutral-800 bg-black">
        <Button variant="secondary" size="compact" className="h-12 w-12 flex items-center justify-center rounded-full border-neutral-700 bg-neutral-800 text-white hover:bg-neutral-700">
          <Mic className="h-5 w-5" />
        </Button>
        <Button variant="secondary" size="compact" className="h-12 w-12 flex items-center justify-center rounded-full border-neutral-700 bg-neutral-800 text-white hover:bg-neutral-700">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="secondary" size="compact" className="h-12 w-12 flex items-center justify-center rounded-full border-neutral-700 bg-neutral-800 text-white hover:bg-neutral-700">
          <MonitorUp className="h-5 w-5" />
        </Button>
        <Button variant="destructive" size="compact" className="h-12 w-12 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700">
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
