<template>
  <q-layout view="lhh Lpr lFf" class="main-layout">
    <!-- Header/Navbar -->
    <q-header elevated class="header">
      <q-toolbar class="q-px-none">
        <!-- Logo on left -->
        <div class="logo-container">
          <img src="../assets/logo.png" alt="Company Logo" class="logo" />
          <span class="company-name">TalentConnect</span>
        </div>

        <q-space />

        <!-- Navigation Tabs -->
        <q-tabs v-model="tab" shrink stretch class="gt-sm">
          <q-route-tab
            v-for="nav in navigation"
            :key="nav.name"
            :name="nav.name"
            :label="nav.label"
            :to="nav.route"
            exact
          />
        </q-tabs>

        <!-- Mobile menu button -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          class="lt-md"
          @click="toggleRightDrawer"
        />
      </q-toolbar>
    </q-header>

    <!-- Mobile Drawer -->
    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
      <q-list>
        <q-item-label header>Navigation</q-item-label>
        <q-item v-for="nav in navigation" :key="nav.name" clickable :to="nav.route" exact>
          <q-item-section>
            <q-item-label>{{ nav.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Simple Footer -->
    <q-footer elevated class="footer">
      <q-toolbar class="footer-toolbar">
        <div class="copyright">© 2023 TalentConnect</div>
        <q-space />
        <div class="footer-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/contact">Contact</a>
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const rightDrawerOpen = ref(false)
const tab = ref('home')

const navigation = [
  { name: 'home', label: 'Home', route: '/' },
  { name: 'jobs', label: 'Jobs', route: '/applicant/jobs' },
  { name: 'candidates', label: 'Candidates', route: '/candidates' },
  { name: 'messages', label: 'Messages', route: '/messages' },
  { name: 'profile', label: 'Profile', route: '/profile' },
]

const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
</script>

<style scoped>
.main-layout {
  background-color: #f8f9fa;
}

/* Header Styles */
.header {
  background-color: white;
  height: 64px;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.logo-container {
  display: flex;
  align-items: center;
  padding-left: 24px;
}

.logo {
  height: 32px;
  width: auto;
  margin-right: 12px;
}

.company-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #212121;
}

.q-tabs {
  height: 100%;
}

.q-tab {
  text-transform: capitalize;
  font-weight: 500;
  color: #616161;
  padding: 0 16px;
}

.q-tab--active {
  color: #212121;
  font-weight: 600;
}

.q-tab-indicator {
  background: #212121;
  height: 3px;
}

/* Simplified Footer Styles */
.footer {
  background-color: #212121;
  color: white;
  height: 60px;
}

.footer-toolbar {
  height: 100%;
  padding: 0 24px;
}

.copyright {
  font-size: 0.875rem;
  color: #bdbdbd;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: #bdbdbd;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: white;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .footer-toolbar {
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    padding: 12px;
  }

  .footer-links {
    gap: 12px;
  }
}
</style>
