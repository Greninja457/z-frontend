<template>
  <q-card class="modern-right-card" flat bordered> </q-card>
</template>

<script setup></script>

<style scoped>
.modern-right-card {
  height: 80vh;
  width: 100%;
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #ffffff 0%, #f9fafb 100%);
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  position: relative;
}

.modern-right-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.8) 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.02) 100%
  );
  pointer-events: none;
  z-index: 1;
}

.modern-right-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
  transform: translateY(-2px);
  border-color: rgba(0, 0, 0, 0.08) !important;
}

/* Responsive height adjustments */
@media (max-width: 599px) {
  .modern-right-card {
    height: 70vh;
  }
}

@media (min-width: 600px) and (max-width: 1023px) {
  .modern-right-card {
    height: 75vh;
  }
}

@media (min-width: 1024px) {
  .modern-right-card {
    height: 80vh;
  }
}
</style>
