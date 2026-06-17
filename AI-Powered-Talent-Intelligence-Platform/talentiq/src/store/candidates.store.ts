import { create } from 'zustand'
import type { Candidate } from '@/store/domain.store'
import api from '@/lib/api'

interface CandidatesState {
  candidates: Candidate[]
  isLoading: boolean
  addCandidate: (candidate: Partial<Candidate>) => Promise<void>
  updateCandidate: (id: string, updates: Partial<Candidate>) => void
  moveCandidateStage: (candidateId: string, newStage: string) => Promise<void>
  addCandidateNote: (candidateId: string, note: any) => void
  fetchCandidates: () => Promise<void>
  clearData: () => void
}

export const useCandidatesStore = create<CandidatesState>()(
  (set) => ({
    candidates: [],
    isLoading: false,

    fetchCandidates: async () => {
      set({ isLoading: true })
      try {
        const response = await api.get('/candidates')
        set({ candidates: response.data })
      } catch (error) {
        console.error('Failed to fetch candidates:', error)
      } finally {
        set({ isLoading: false })
      }
    },

    addCandidate: async (candidateData) => {
      try {
        // We use fetch since addCandidate can be called from public portal without auth headers
        // And api from @/lib/api has interceptors. But fetch to /api/candidates is fine.
        const res = await fetch('/api/candidates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(candidateData)
        });
        if (!res.ok) throw new Error('Failed to create candidate');
        const data = await res.json();
        set((state) => ({ candidates: [data, ...state.candidates] }))
      } catch (error) {
        console.error('Failed to create candidate:', error)
        throw error
      }
    },

    updateCandidate: (id, updates) =>
      set((state) => ({
        candidates: state.candidates.map((c) =>
          c.id === id ? { ...c, ...updates } : c,
        ),
      })),
      
    moveCandidateStage: async (candidateId, newStage) => {
      // Optimitistic update
      set((state) => ({
        candidates: state.candidates.map((c) =>
          c.id === candidateId
            ? {
                ...c,
                stage: newStage,
                daysInStage: 0,
                timeline: [
                  ...c.timeline,
                  { event: `Moved to ${newStage}`, date: 'Just now', type: 'stage' as const },
                ],
              }
            : c,
        ),
      }))

      // Persist to backend
      try {
        const state = useCandidatesStore.getState();
        const candidate = state.candidates.find(c => c.id === candidateId);
        if (candidate && candidate.applicationId) {
          await api.put(`/applications/${candidate.applicationId}`, { stage: newStage });
        }
      } catch (error) {
        console.error('Failed to save stage change to MongoDB:', error);
      }
    },
      
    addCandidateNote: async (candidateId, note) => {
      set((state) => ({
        candidates: state.candidates.map((c) =>
          c.id === candidateId ? { ...c, notes: [...c.notes, note] } : c,
        ),
      }))

      try {
        const state = useCandidatesStore.getState();
        const candidate = state.candidates.find(c => c.id === candidateId);
        if (candidate && candidate.applicationId) {
          await api.post(`/applications/${candidate.applicationId}/notes`, note);
        }
      } catch (error) {
        console.error('Failed to save note to MongoDB:', error);
      }
    },
      
    clearData: () => set({ candidates: [] }),
  })
)
