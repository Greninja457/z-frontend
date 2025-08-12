<template>
  <div class="form-wrapper">
    <q-card class="post-job-card">
      <div class="form-header">
        {{ isPreviewing ? 'Preview Job Post' : 'Post a Job' }}
      </div>

      <q-form v-if="!isPreviewing" ref="formRef" @submit.prevent="handlePreview">
        <div class="section-title">Basic Details</div>
        <div class="form-entry">
          <q-input
            class="styled-input"
            v-model="form.title"
            label="Job Title"
            filled
            :rules="[isRequired, maxLength(100)]"
          />
          <q-input v-model="form.companyName" label="Company Name" filled readonly />
          <q-select
            v-model="form.job_type"
            :options="jobTypes"
            label="Job Type"
            filled
            :rules="[isRequired]"
          />
        </div>

        <div class="section-title">Job Logistics</div>
        <div class="form-entry">
          <q-select
            v-model="form.mode_of_work"
            :options="modeOptions"
            label="Mode of Work"
            filled
            :rules="[isRequired]"
          />
          <q-input
            v-model.number="form.exp_required"
            label="Experience Required (Years)"
            type="number"
            filled
            :rules="[isRequired, isPositiveNumber]"
            min="0"
            max="50"
          />

          <q-input
            v-model="form.salary"
            label="Salary"
            type="number"
            filled
            :rules="[isRequired, isSalaryValid]"
            class="q-mb-md"
          />

          <!-- ✅ Equity (Optional) -->
          <q-input
            v-model.number="form.equity"
            label="Equity % (Optional)"
            type="number"
            filled
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div class="section-title">Location & Skills</div>
        <div class="form-entry">
          <q-select
            v-model="form.lid"
            :options="locationOptions"
            label="Branch Location"
            filled
            :rules="[isRequired]"
            emit-value
            map-options
            :loading="locationsLoading"
            :disable="locationsLoading"
          />
          <q-select
            v-model="form.skillids"
            :options="skillOptions"
            label="Required Skills"
            filled
            use-chips
            multiple
            :rules="[isRequired]"
            emit-value
            map-options
            :loading="skillsLoading"
            :disable="skillsLoading"
          />
        </div>

        <div class="section-title">Description</div>
        <div class="form-entry">
          <q-input
            v-model="form.smallDescription"
            label="Short Description"
            type="textarea"
            filled
            :rules="[minLength(10), maxLength(100), isRequired]"
            placeholder="e.g. A brief summary of the job role"
          />
        </div>

        <div class="form-entry q-mt-md">
          <q-input
            v-model="form.bigDescription"
            label="Detailed Job Description"
            type="textarea"
            filled
            :rules="[minLength(20), isRequired]"
            placeholder="e.g. Full responsibilities, requirements, etc."
            rows="6"
          />
        </div>

        <!-- Links Section (Optional) -->

        <div class="section-title">Additional Links (Optional)</div>

        <div class="form-entry">
          <div v-for="(link, index) in form.links" :key="index" class="link-row">
            <q-input
              v-model="link.label"
              label="Link Label"
              filled
              class="link-label"
              placeholder="e.g. Company Website"
            />

            <q-input
              v-model="link.url"
              label="URL"
              filled
              class="link-url"
              placeholder="https://example.com"
              :rules="[isValidUrl]"
            />

            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="removeLink(index)"
              class="link-remove"
            />
          </div>

          <q-btn
            flat
            color="primary"
            icon="add"
            label="Add Link"
            @click="addLink"
            class="q-mt-sm"
          />
        </div>

        <q-card-actions align="right">
          <q-btn type="submit" label="Preview Job" color="primary" />
        </q-card-actions>
      </q-form>

      <div v-else class="form-wrapper">
        <q-separator />
        <q-card-section>
          <JobCard :job="previewJob" />
        </q-card-section>
        <q-card-actions align="between" class="q-pa-md">
          <q-btn flat label="Back to Edit" color="grey-6" @click="isPreviewing = false" />
          <q-btn label="Submit Job" color="primary" @click="submitJob" :loading="isSubmitting" />
        </q-card-actions>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useJobsStore } from 'src/stores/jobStore'
import JobCard from 'src/components/Jobs/JobCard.vue'
import { useUserStore } from 'src/stores/user-store'

const $q = useQuasar()
const jobsStore = useJobsStore()

// Base URL for API calls
const baseUrl = 'http://localhost:3000'

const formRef = ref(null)
const isPreviewing = ref(false)
const isSubmitting = ref(false)

// Loading states for dropdowns
const skillsLoading = ref(false)
const locationsLoading = ref(false)

// Data arrays
const skills = ref([])
const locations = ref([])

// Convert skills and locations to select options
const skillOptions = computed(() =>
  skills.value.map((skill) => ({
    label: skill.name,
    value: skill.id,
  })),
)

const locationOptions = computed(() =>
  locations.value.map((location) => ({
    label: location.name,
    value: location.id,
  })),
)

const form = ref({
  title: '',
  companyName: '',
  job_type: '',
  mode_of_work: '',
  exp_required: 0,
  salary: 0,
  equity: 0,
  lid: null,
  cid: null,
  skillids: [],
  bigDescription: '',
  smallDescription: '',
  links: [],
})

const previewJob = computed(() => ({
  ...form.value,
  posted: new Date().toISOString().split('T')[0],
}))

const jobTypes = ['Full-time', 'Co-founder', 'Contract', 'internship']
const modeOptions = ['Online', 'Offline', 'Hybrid']

// API Functions
async function getAllSkills() {
  try {
    skillsLoading.value = true
    const res = await fetch(`${baseUrl}/skills/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch skills`)
    }

    const data = await res.json()
    console.log('Skills response:', data)

    // Handle your current skills API format: {success: true, skills: [[id, name], [id, name]]}
    if (data.success && data.skills && Array.isArray(data.skills)) {
      skills.value = data.skills.map((skill) => ({
        id: skill[0], // skillid
        name: skill[1], // skillName
      }))
    } else {
      throw new Error('Invalid skills data format')
    }
  } catch (error) {
    console.error('Error fetching skills:', error)
    $q.notify({
      type: 'negative',
      message: `Failed to load skills: ${error.message}`,
    })
    skills.value = [] // Set empty array as fallback
  } finally {
    skillsLoading.value = false
  }
}

async function getAllLocations() {
  try {
    locationsLoading.value = true
    const res = await fetch(`${baseUrl}/location/location`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch locations`)
    }

    const data = await res.json()
    console.log('Locations response:', data)

    // Handle locations API format: {success: true, locations: [[id, name], [id, name]]}
    if (data.success && data.locations && Array.isArray(data.locations)) {
      locations.value = data.locations.map((location) => ({
        id: location[0], // lid
        name: location[1], // lname
      }))
    } else {
      throw new Error('Invalid locations data format')
    }
  } catch (error) {
    console.error('Error fetching locations:', error)
    $q.notify({
      type: 'negative',
      message: `Failed to load locations: ${error.message}`,
    })
    locations.value = [] // Set empty array as fallback
  } finally {
    locationsLoading.value = false
  }
}

// Validation Rules
const isRequired = (val) => !!val || 'This field is required'
const minLength = (n) => (val) => !val || val.length >= n || `Minimum ${n} characters`
const maxLength = (n) => (val) => !val || val.length <= n || `Maximum ${n} characters`

const isPositiveNumber = (val) => {
  return (val >= 0 && val <= 50) || 'Experience should be between 0-50 years'
}

const isSalaryValid = (val) => {
  if (!val || val < 1000) return 'Salary must be at least ₹1,000'
  if (val > 99990000) return 'Salary seems too high'
  return true
}

const isValidUrl = (val) => {
  if (!val) return true // Optional field
  try {
    new URL(val)
    return true
  } catch {
    return 'Please enter a valid URL'
  }
}

// Link management
const addLink = () => {
  form.value.links.push({ label: '', url: '' })
}

const removeLink = (index) => {
  form.value.links.splice(index, 1)
}

onMounted(async () => {
  // Load skills and locations from backend
  await Promise.all([getAllSkills(), getAllLocations()])

  // Set company data if available
  if (useUserStore().company) {
    form.value.companyName = useUserStore().company.name
    form.value.cid = useUserStore().company.cid
  }
})

async function handlePreview() {
  const success = await formRef.value.validate()
  if (!success) {
    $q.notify({
      type: 'negative',
      message: 'Please fix the form errors before previewing.',
    })
    return
  }
  console.log(previewJob)

  isPreviewing.value = true
}

async function submitJob() {
  console.log('🔥 SUBMIT JOB FUNCTION CALLED!')

  isSubmitting.value = true

  try {
    // Backend derives uid and cid from authenticated user, so we don't send them
    const jobData = {
      title: form.value.title,
      bigDescription: form.value.bigDescription,
      smallDescription: form.value.smallDescription,
      job_type: form.value.job_type,
      mode_of_work: form.value.mode_of_work,
      exp_required: form.value.exp_required,
      salary: form.value.salary,
      skillids: form.value.skillids,
      equity: form.value.equity || 0,
      lid: form.value.lid,
      links: form.value.links.filter((link) => link.label && link.url),
    }

    const result = await jobsStore.postJob(jobData)

    console.log('Job submission result:', result)
    console.log('Job data being submitted:', jobData)

    if (result.success) {
      $q.notify({
        type: 'positive',
        message: 'Job posted successfully!',
      })

      resetForm()
      isPreviewing.value = false
    } else {
      $q.notify({
        type: 'negative',
        message: result.message,
      })
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'An error occurred while posting the job',
      error: error,
    })
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  form.value = {
    title: '',
    companyName: useUserStore().company?.name || '',
    job_type: '',
    mode_of_work: '',
    exp_required: 0,
    salary: 0,
    equity: 0,
    lid: null,
    cid: useUserStore().company?.cid || null,
    skillids: [],
    bigDescription: '',
    smallDescription: '',
    links: [],
  }

  formRef.value?.resetValidation()
}
</script>

<style scoped>
.post-job-card {
  width: 100%;
  margin: 0 auto;
  padding: 32px;
  background-color: white;
}

.form-header {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 24px 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.form-entry {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Unified Input & Select Styling */
.q-input,
.q-select {
  background: white;
}

.q-input :deep(.q-field__control),
.q-select :deep(.q-field__control) {
  background: white !important;
  border: 1px solid #d1d5db !important;
  border-radius: 8px !important;
  min-height: 56px;
}

.q-input :deep(.q-field__control):before,
.q-select :deep(.q-field__control):before {
  border: none !important;
}

.q-input :deep(.q-field__control):after,
.q-select :deep(.q-field__control):after {
  border: 2px solid #000000 !important;
  border-radius: 8px !important;
}

.q-input :deep(.q-field__label),
.q-select :deep(.q-field__label) {
  color: #374151 !important;
  font-weight: 500 !important;
}

.q-input :deep(.q-field__native),
.q-select :deep(.q-field__native) {
  color: #000000 !important;
}

/* Focus States */
.q-field--focused :deep(.q-field__control) {
  border-color: #000000 !important;
  box-shadow: 0 0 0 1px #000000 !important;
}

/* Disabled States */
.q-input :deep(.q-field--disabled),
.q-select :deep(.q-field--disabled) {
  opacity: 0.7 !important;
}

.q-input :deep(.q-field--disabled .q-field__control),
.q-select :deep(.q-field--disabled .q-field__control) {
  background: #f9fafb !important;
  color: #6b7280 !important;
}

/* Buttons */
.q-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: normal;
  border-radius: 8px;
}

.q-btn.bg-primary {
  background-color: #1a1a1a !important;
  color: white !important;
}

.q-btn.bg-primary:hover {
  background-color: #333 !important;
}

.q-btn--flat {
  color: #1a1a1a;
}

.q-btn--flat:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

/* Link Management */
.link-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.link-label {
  flex: 0 0 30%;
  min-width: 120px;
}

.link-url {
  flex: 1;
}

.link-remove {
  color: #f44336 !important;
}

.link-remove:hover {
  background-color: rgba(244, 67, 54, 0.08) !important;
}

/* Responsive */
@media (max-width: 600px) {
  .post-job-card {
    padding: 24px 16px;
  }

  .link-row {
    flex-direction: column;
    gap: 8px;
  }

  .link-label,
  .link-url {
    width: 100%;
  }
}
</style>
