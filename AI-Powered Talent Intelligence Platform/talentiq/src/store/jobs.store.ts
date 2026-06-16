import { create } from 'zustand'
import type { Job } from '@/store/domain.store'
import api from '@/lib/api'

interface JobsState {
  jobs: Job[]
  isLoading: boolean
  addJob: (job: Partial<Job>) => Promise<void>
  updateJob: (id: string, updates: Partial<Job>) => void
  fetchJobs: () => Promise<void>
  clearData: () => void
}

export const useJobsStore = create<JobsState>()(
  (set) => ({
    jobs: [],
    isLoading: false,

    fetchJobs: async () => {
      set({ isLoading: true })
      try {
        const response = await api.get('/jobs')
        set({ jobs: response.data })
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
      } finally {
        set({ isLoading: false })
      }
    },

    addJob: async (jobData) => {
      try {
        const response = await api.post('/jobs', jobData)
        set((state) => ({ jobs: [response.data, ...state.jobs] }))
      } catch (error) {
        console.error('Failed to create job:', error)
        throw error
      }
    },

    updateJob: (id, updates) =>
      set((state) => ({
        jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
      })),
      
    clearData: () => set({ jobs: [] }),
  })
)
