import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MOCK_CANDIDATES } from '@/mock-data/candidates'
import type { Candidate } from '@/store/domain.store'

interface CandidatesState {
  candidates: Candidate[]
  addCandidate: (candidate: Candidate) => void
  updateCandidate: (id: string, updates: Partial<Candidate>) => void
  moveCandidateStage: (candidateId: string, newStage: string) => void
  addCandidateNote: (candidateId: string, note: any) => void
  loadDemoData: () => void
  clearData: () => void
}

const INITIAL_CANDIDATES: Candidate[] = []

export const useCandidatesStore = create<CandidatesState>()(
  persist(
    (set) => ({
      candidates: INITIAL_CANDIDATES,

      addCandidate: (candidate) =>
        set((state) => ({ candidates: [candidate, ...state.candidates] })),
      updateCandidate: (id, updates) =>
        set((state) => ({
          candidates: state.candidates.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        })),
      moveCandidateStage: (candidateId, newStage) =>
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
        })),
      addCandidateNote: (candidateId, note) =>
        set((state) => ({
          candidates: state.candidates.map((c) =>
            c.id === candidateId ? { ...c, notes: [...c.notes, note] } : c,
          ),
        })),
      loadDemoData: () => set({ candidates: MOCK_CANDIDATES as Candidate[] }),
      clearData: () => set({ candidates: [] }),
    }),
    {
      name: 'talentiq-candidates-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ candidates: state.candidates }),
    }
  )
)
