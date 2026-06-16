import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';

interface InterviewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: any;
  onConfirm: () => void;
}

export default function InterviewBookingModal({ isOpen, onClose, candidate, onConfirm }: InterviewBookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !selectedDate) return;

    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);
      setSelectedTime(null);
      try {
        const res = await fetch(`/api/interviews?date=${selectedDate}`);
        if (res.ok) {
          const data = await res.json();
          setBookedSlots(data.map((i: any) => new Date(i.scheduledAt)));
        } else {
          setError('Failed to load available slots.');
        }
      } catch (err) {
        setError('Error loading slots.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [isOpen, selectedDate]);

  if (!isOpen) return null;

  // Generate 45 min slots between 9 AM and 5 PM
  const generateSlots = () => {
    const slots = [];
    const [year, month, day] = selectedDate.split('-').map(Number);
    let current = new Date(year, month - 1, day, 9, 0, 0);
    const end = new Date(year, month - 1, day, 17, 0, 0); // 5 PM

    while (current.getTime() + 45 * 60000 <= end.getTime()) {
      slots.push(new Date(current));
      current = new Date(current.getTime() + 60 * 60000); // 45 mins + 15 mins break
    }
    return slots;
  };

  const slots = generateSlots();

  const handleBook = async () => {
    if (!selectedTime) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: candidate.id,
          applicationId: candidate.applicationId,
          jobId: candidate.jobId,
          scheduledAt: selectedTime,
          locationType: 'video'
        })
      });

      if (res.ok) {
        onConfirm();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to book slot.');
      }
    } catch (err) {
      setError('An error occurred while booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-[16px]">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-[24px] py-[20px] border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div>
            <h2 className="font-display text-[20px] font-bold text-neutral-900">Schedule Interview</h2>
            <p className="font-body text-[13px] text-neutral-500 mt-[2px]">Book a 45-minute slot with {candidate?.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-[32px] h-[32px] flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-[24px] overflow-y-auto flex-1">
          {error && (
            <div className="mb-[16px] flex items-start gap-[10px] p-[12px] bg-red-50 border border-red-100 rounded-[12px] text-red-600">
              <AlertCircle size={16} className="mt-[2px]" />
              <p className="font-body text-[13px] font-medium">{error}</p>
            </div>
          )}

          <div className="mb-[20px]">
            <label className="font-display text-[14px] font-bold text-neutral-800 mb-[8px] flex items-center gap-[6px]">
              <Calendar size={14} className="text-blue-500" /> Select Date
            </label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full h-[44px] px-[16px] bg-neutral-50 border border-neutral-200 rounded-[12px] font-body text-[14px] font-semibold text-neutral-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label className="font-display text-[14px] font-bold text-neutral-800 mb-[12px] flex items-center gap-[6px]">
              <Clock size={14} className="text-indigo-500" /> Available Slots
            </label>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-[120px]">
                <div className="w-[24px] h-[24px] border-2 border-neutral-200 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-[10px]">
                {slots.map((slot, i) => {
                  const timeString = slot.toISOString();
                  // Check overlap
                  const slotEnd = new Date(slot.getTime() + 45 * 60000);
                  const isBooked = bookedSlots.some(booked => {
                    const bookedEnd = new Date(booked.getTime() + 45 * 60000);
                    return slot < bookedEnd && slotEnd > booked;
                  });

                  // If it's today and slot has passed
                  const isPast = slot < new Date();
                  const disabled = isBooked || isPast;

                  return (
                    <button
                      key={i}
                      disabled={disabled}
                      onClick={() => setSelectedTime(timeString)}
                      className={`h-[44px] flex items-center justify-center font-body text-[13px] font-semibold rounded-[10px] border transition-all ${
                        disabled 
                          ? 'bg-neutral-50 border-neutral-100 text-neutral-300 cursor-not-allowed line-through decoration-neutral-300' 
                          : selectedTime === timeString
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-[1.02]'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {format(slot, 'h:mm a')}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-[24px] py-[16px] border-t border-neutral-100 flex items-center justify-end gap-[12px] bg-white">
          <button 
            onClick={onClose}
            className="h-[40px] px-[20px] font-body text-[14px] font-semibold text-neutral-600 hover:bg-neutral-50 rounded-[10px] transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleBook}
            disabled={!selectedTime || isSubmitting}
            className="h-[40px] px-[24px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-body text-[14px] font-semibold rounded-[10px] flex items-center gap-[6px] shadow-sm transition-all"
          >
            {isSubmitting ? (
              <div className="w-[16px] h-[16px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCircle2 size={16} />
            )}
            Confirm Booking
          </button>
        </div>

      </div>
    </div>
  );
}
