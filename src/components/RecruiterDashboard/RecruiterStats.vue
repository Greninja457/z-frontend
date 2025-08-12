<template>
  <div class="top-section">
    <div class="recruiter-panel">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div v-for="(card, index) in statCards" :key="index" class="stat-card">
          <div class="stat-label">{{ card.label }}</div>
          <div class="stat-value">{{ card.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Props
defineProps({
  tab: {
    type: String,
    required: true,
  },
})

// Emits
defineEmits(['update:tab'])

// Data
const statCards = ref([
  { label: 'Total Jobs', value: 12 },
  { label: 'Active', value: 4 },
  { label: 'Closed', value: 6 },
  { label: 'Drafts', value: 2 },
])
</script>

<style scoped>
.top-section {
  flex: 0 0 auto;
  width: 100%;
}

.recruiter-panel {
  background: transparent;
  padding: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  width: 100%;
}

.stat-card {
  background: white;
  border: 1px solid #373737;
  border-radius: 0.8rem; /* rounded-md */
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: #ffffff;
  border-color: #000000;
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
}

.stat-label {
  font-size: 0.875rem; /* text-sm */
  color: #666666;
  font-weight: 500;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.stat-value {
  font-size: 2rem; /* text-3xl */
  font-weight: 700;
  color: #000000;
  line-height: 1;
}

/* Responsive Design */
@media (max-width: 768px) {
  .recruiter-panel {
    padding: 1rem;
    margin: 0 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-value {
    font-size: 1.5rem; /* text-2xl */
  }
}

@media (max-width: 480px) {
  .recruiter-panel {
    margin: 0 0.5rem;
    padding: 0.75rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .stat-card {
    padding: 0.75rem;
  }

  .stat-label {
    font-size: 0.75rem; /* text-xs */
  }

  .stat-value {
    font-size: 1.25rem; /* text-xl */
  }
}
</style>
