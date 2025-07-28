<template>
  <q-layout view="lhh Lpr lFf" class="main-layout">
    <Navbar />
    <q-page-container>
      <q-page class="q-pa-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <div class="full-height left-card-wrapper">
              <LeftCard />
            </div>
          </div>

          <div class="col-12 col-md-9">
            <div class="full-height right-card-wrapper">
              <RightCard />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import Navbar from 'src/components/navbar/Navbar.vue'
import RightCard from 'src/components/user/RightCard.vue'
import LeftCard from 'src/components/user/LeftCard.vue'
</script>

<style scoped>
.main-layout {
  background-color: #f9fafb;
}

.full-height {
  height: 100%;
}

.right-card-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
}

.left-card-wrapper {
  display: flex;
  justify-content: center;
  align-items: start;
  padding: 15px;
}
</style>
