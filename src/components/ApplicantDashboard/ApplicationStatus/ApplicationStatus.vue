<template>
  <q-card class="application-status-card q-pa-md">
    <div class="header-section">
      <h2 class="page-title">Application Status</h2>
      <div class="stats-row">
        <div class="stat-chip">
          <span class="stat-number">{{ jobs.length }}</span>
          <span class="stat-label">Total Applications</span>
        </div>
        <div class="stat-chip">
          <span class="stat-number">{{ filteredJobs.length }}</span>
          <span class="stat-label">{{ selectedFilter || 'Showing' }}</span>
        </div>
      </div>
    </div>

    <!-- Filter -->
    <div class="filter-section">
      <q-select
        v-model="selectedFilter"
        :options="filterOptions"
        label="Filter by Job Status"
        dense
        outlined
        class="filter-select"
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="filter_list" class="filter-icon" />
        </template>
      </q-select>
    </div>

    <!-- Jobs List -->
    <div class="jobs-grid q-mt-md">
      <transition-group name="job-list" tag="div" class="jobs-container">
        <JobCard v-for="job in filteredJobs" :key="job.jobid" :job="job" class="job-item" />
      </transition-group>

      <!-- Empty State -->
      <div v-if="filteredJobs.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <h3 class="empty-title">No applications found</h3>
        <p class="empty-text">
          {{
            selectedFilter
              ? `No applications with "${selectedFilter}" status`
              : 'No job applications to display'
          }}
        </p>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import JobCard from './AppliedJobsCard.vue'

const selectedFilter = ref(null)
const jobs = ref([]) // This will store the fetched job applications

// Fetch job applications from the API when the component is mounted
onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/application/49')
    const data = await response.json()

    if (data.success) {
      jobs.value = data.data // Set the jobs data from the API
    } else {
      console.error('Failed to fetch job applications:', data)
    }
  } catch (error) {
    console.error('Error fetching job applications:', error)
  }
})

const filterOptions = computed(() => {
  const uniqueStatuses = [...new Set(jobs.value.map((job) => job.status))]
  return uniqueStatuses.filter((status) => status !== 'Interview Scheduled')
})

const filteredJobs = computed(() => {
  if (!selectedFilter.value) return jobs.value
  return jobs.value.filter((job) => job.status === selectedFilter.value)
})
</script>

<style scoped>
.application-status-card {
  width: 100%;
  border-radius: 24px;
  padding: 32px;
  background: #ffffff;
  border: 1px solid #e9ecef;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.04),
    0 2px 8px rgba(0, 0, 0, 0.02);
  position: relative;
  overflow: hidden;
}

.application-status-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #000000 0%, #333333 50%, #000000 100%);
}

.header-section {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.stats-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 20px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  min-width: 100px;
  transition: all 0.2s ease;
}

.stat-chip:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;
  text-align: center;
}

.filter-section {
  margin-bottom: 24px;
}

.filter-select {
  max-width: 300px;
  border-radius: 16px;
}

.filter-select :deep(.q-field__control) {
  border-radius: 16px;
  border: 2px solid #e9ecef;
  background: #ffffff;
  transition: all 0.2s ease;
}

.filter-select :deep(.q-field__control):hover {
  border-color: #dee2e6;
}

.filter-select :deep(.q-field--focused .q-field__control) {
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.filter-select :deep(.q-field__label) {
  color: #6c757d;
  font-weight: 500;
}

.filter-icon {
  color: #6c757d;
}

.jobs-grid {
  position: relative;
}

.jobs-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.job-item {
  width: 100%;
}

/* Animations */
.job-list-enter-active,
.job-list-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.job-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.job-list-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.job-list-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: #6c757d;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 8px 0;
}

.empty-text {
  font-size: 16px;
  color: #6c757d;
  margin: 0;
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 768px) {
  .application-status-card {
    padding: 24px 20px;
    border-radius: 20px;
  }

  .page-title {
    font-size: 24px;
  }

  .stats-row {
    justify-content: center;
  }

  .stat-chip {
    min-width: 80px;
    padding: 10px 16px;
  }

  .stat-number {
    font-size: 20px;
  }

  .filter-select {
    max-width: 100%;
  }

  .empty-state {
    padding: 32px 16px;
  }

  .empty-icon {
    font-size: 48px;
  }

  .empty-title {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .stats-row {
    flex-direction: column;
    align-items: stretch;
  }

  .stat-chip {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }

  .stat-label {
    margin-top: 0;
    text-align: right;
  }
}
</style>
