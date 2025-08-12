import { defineStore } from 'pinia'
import { useUserStore } from 'src/stores/user-store'
export const useJobsStore = defineStore('jobs', {
  state: () => ({
    jobs: [],
    loading: false,
    message: '',
  }),

  actions: {
    async fetchRecommendedJobs() {
      this.loading = true
      this.message = ''
      this.jobs = []

      try {
        const token = useUserStore().token

        const response = await fetch('http://localhost:3000/jobs/recommended', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          this.message = 'Add some skills to your profile'
        }

        const data = await response.json()
        this.jobs = data.jobs || []

        if (this.jobs.length == 0) {
          this.message = 'No recommended jobs found.'
        }
      } catch (err) {
        this.message = err.message
        console.error('Job fetch error:', err)
      } finally {
        this.loading = false
      }
    },
  },
})
