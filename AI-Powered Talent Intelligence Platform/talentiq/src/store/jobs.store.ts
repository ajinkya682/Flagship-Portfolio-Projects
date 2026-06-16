import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MOCK_JOBS } from '@/mock-data/jobs'
import type { Job } from '@/store/domain.store'

interface JobsState {
  jobs: Job[]
  addJob: (job: Job) => void
  updateJob: (id: string, updates: Partial<Job>) => void
  loadDemoData: () => void
  clearData: () => void
}

const INITIAL_JOBS: Job[] = []

export const useJobsStore = create<JobsState>()(
  persist(
    (set) => ({
      jobs: INITIAL_JOBS,

      addJob: (job) => set((state) => ({ jobs: [job, ...state.jobs] })),
      updateJob: (id, updates) =>
        set((state) => ({
          jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
        })),
      loadDemoData: () => set({ jobs: MOCK_JOBS as Job[] }),
      clearData: () => set({ jobs: [] }),
    }),
    {
      name: 'talentiq-jobs-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ jobs: state.jobs }),
    }
  )
)
