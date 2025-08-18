<template>
  <q-card class="job-card q-pa-md">
    <q-card-section>
      <div class="row justify-between items-center">
        <div class="text-subtitle1">{{ job.title }}</div>
        <q-badge
          :color="statusColor(job.status)"
          :class="statusClass(job.status)"
          class="q-ml-sm status-badge"
        >
          {{ job.status }}
        </q-badge>
      </div>

      <div class="text-caption text-grey q-mt-xs">
        <span class="label">Applied on:</span> {{ formatDate(job.applied) }}
      </div>

      <div v-if="job.interview_score !== null" class="text-caption text-grey q-mt-xs">
        <span class="label">Interview Score:</span>
        <span class="score">{{ job.interview_score }}%</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  job: {
    type: Object,
    required: true,
  },
})

const statusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'yellow'
    case 'accepted':
      return 'green'
    case 'rejected':
      return 'red'
    default:
      return 'grey'
  }
}

const statusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'status-pending'
    case 'accepted':
      return 'status-accepted'
    case 'rejected':
      return 'status-rejected'
    default:
      return 'status-default'
  }
}

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(date).toLocaleDateString('en-US', options)
}
</script>

<style scoped>
.job-card {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  padding: 24px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.04),
    0 2px 8px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
}

.job-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #000000 0%, #333333 50%, #000000 100%);
}

.job-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.08),
    0 4px 16px rgba(0, 0, 0, 0.04);
  border-color: #dee2e6;
}

.text-subtitle1 {
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  letter-spacing: -0.5px;
  line-height: 1.3;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.status-badge {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 6px 12px;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
  border-color: #ffc107;
}

.status-accepted {
  background-color: #d1edff;
  color: #0c5460;
  border-color: #17a2b8;
}

.status-rejected {
  background-color: #f8d7da;
  color: #721c24;
  border-color: #dc3545;
}

.status-default {
  background-color: #f8f9fa;
  color: #6c757d;
  border-color: #dee2e6;
}

.text-caption {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
  line-height: 1.5;
}

.label {
  color: #000000;
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.score {
  color: #000000;
  font-weight: 700;
  font-size: 15px;
}

.q-mt-xs {
  margin-top: 12px;
}

.q-ml-sm {
  margin-left: 12px;
}

.row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

/* Responsive design */
@media (max-width: 600px) {
  .job-card {
    padding: 20px 16px;
    border-radius: 16px;
  }

  .text-subtitle1 {
    font-size: 18px;
  }

  .row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .q-ml-sm {
    margin-left: 0;
  }
}
</style>
