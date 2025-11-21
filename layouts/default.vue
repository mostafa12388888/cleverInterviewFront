<template>
  <div :dir="isRTL ? 'rtl' : 'ltr'" :class="['min-h-screen transition-colors duration-300', darkMode ? 'bg-gray-900' : 'bg-[#F5F6FA]']">
    
    <!-- ==================== HEADER COMPONENT ==================== -->
    <LayoutAppHeader 
      :dark-mode="darkMode"
      :show-projects="showProjects"
      :show-settings="showSettings"
      :show-profile="showProfile"
      :show-search2="showSearch2"
      :search-project="searchProject"
      :search-query="searchQuery"
      :active-tab="activeTab"
      :is-mobile="isMobile"
      :projects="projects"
      :settings-items="settingsItems"
      @toggle-projects="toggleProjects"
      @toggle-settings="toggleSettings"
      @toggle-profile="toggleProfile"
      @open-search="openSearch"
      @close-search="closeSearch"
      @close-all-dropdowns="closeAllDropdowns"
      @toggle-dark-mode="toggleDarkMode"
      @select-your-work="selectYourWork"
      @select-dashboard="selectDashboard"
      @select-project="selectProject"
      @update:search-project="searchProject = $event"
      @update:search-query="searchQuery = $event"
    />

    <!-- ==================== CONTENT WITH SIDEBAR ==================== -->
    <div class="flex">
      <LayoutAppSidebar 
        :selected-project="selectedProject"
        :is-pinned="isSidebarPinned"
        @toggle-pin="toggleSidebarPin"
      />

      <!-- Main Content -->
      <main class="flex-1 px-3 md:px-6 py-5 md:py-8">
        <slot />

      </main>
    </div>

    <!-- Backdrop for mobile dropdowns -->
    <transition name="fade">
      <div
        v-if="(showProjects || showSettings || showProfile) && isMobile"
        @click="closeAllDropdowns"
        class="fixed inset-0 bg-black/20 z-40 md:hidden"
      ></div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useProjectsStore } from '~/stores/projects'
import { useI18n } from 'vue-i18n'

// ==================== STATE ====================
const showProjects = ref(false)
const showSettings = ref(false)
const showProfile = ref(false)
const showSearch2 = ref(false)
const darkMode = ref(false)
const searchProject = ref('')
const searchQuery = ref('')
const activeTab = ref('dashboard')
const isMobile = ref(false)
const selectedProject = ref(null)
const isSidebarPinned = ref(false)
// ==================== PINIA STORE ====================
const projectsStore = useProjectsStore()

// استخدم computed علشان المشاريع تظل reactive
const projects = computed(() => projectsStore.items)

onMounted(async () => {
  // اجلب المشاريع مرة واحدة فقط
  if (!projectsStore.items.length) {
    await projectsStore.fetchProjects(1, projectsStore.pagination.perPage)
  }
})
// ==================== I18N / RTL ====================
const { locale } = useI18n()
const isRTL = computed(() => locale.value === 'ar')

// ==================== SETTINGS ITEMS ====================
const settingsItems = computed(() => {
  if (isRTL.value) {
    return [
      { icon: '📋', title: 'هيكل تقسيم العمل والمشاريع', desc: 'إدارة الهياكل والمشاريع', bgColor: 'bg-[#D1FAE5]', to: '/wbs' },
      { icon: '📄', title: 'نماذج', desc: 'تصميم نماذج المؤسسة', bgColor: 'bg-[#D1FAE5]', to: '/dashboard' },
      { icon: '🏢', title: 'الدليل المؤسسي', desc: 'إدارة الشركات وجهات الاتصال', bgColor: 'bg-[#D1FAE5]', to: '/enterprise-directory' },
      { icon: '📦', title: 'وحدات', desc: 'إدارة وحدات المشروع', bgColor: 'bg-[#D1FAE5]', to: '/modules' },
      { icon: '⚙️', title: 'إعدادات المؤسسة', desc: 'تخصيص إعدادات المؤسسة', bgColor: 'bg-[#FEF3C7]', to: '/dashboard' },
      { icon: '📊', title: 'قوائم مخصصة', desc: 'تخصيص محتوى القوائم المنسدلة', bgColor: 'bg-[#DBEAFE]', to: '/custom-lists' },
      { icon: '👥', title: 'المستخدمين', desc: 'إدارة مستخدمي المؤسسة', bgColor: 'bg-[#D1FAE5]', to: '/users' },
    ]
  }
  return [
    { icon: '📋', title: 'WBS & Projects', desc: 'Manage WBSs and Projects', bgColor: 'bg-[#D1FAE5]', to: '/wbs' },
    { icon: '📄', title: 'Forms', desc: 'Design your organization forms', bgColor: 'bg-[#D1FAE5]', to: '/dashboard' },
    { icon: '🏢', title: 'Enterprise directory', desc: 'Manage Companies and Contacts', bgColor: 'bg-[#D1FAE5]', to: '/enterprise-directory' },
    { icon: '📦', title: 'Modules', desc: "Manage the project's modules", bgColor: 'bg-[#D1FAE5]', to: '/modules' },
    { icon: '⚙️', title: 'Enterprise settings', desc: 'Customize Enterprise Settings', bgColor: 'bg-[#FEF3C7]', to: '/dashboard' },
    { icon: '📊', title: 'Custom lists', desc: 'Customize dropdowns contents', bgColor: 'bg-[#DBEAFE]', to: '/custom-lists' },
    { icon: '👥', title: 'Users', desc: 'Manage Enterprise Users', bgColor: 'bg-[#D1FAE5]', to: '/users' },
  ]
})

// ==================== METHODS ====================
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

const toggleProjects = () => {
  showProjects.value = !showProjects.value
  showSettings.value = false
  showProfile.value = false
  showSearch2.value = false
}

const toggleSettings = () => {
  showSettings.value = !showSettings.value
  showProjects.value = false
  showProfile.value = false
  showSearch2.value = false
}

const toggleProfile = () => {
  showProfile.value = !showProfile.value
  showProjects.value = false
  showSettings.value = false
  showSearch2.value = false
}

const openSearch = () => {
  showSearch2.value = true
  showProjects.value = false
  showSettings.value = false
  showProfile.value = false
}

const closeSearch = () => {
  showSearch2.value = false
  searchQuery.value = ''
}

const closeAllDropdowns = () => {
  showProjects.value = false
  showSettings.value = false
  showProfile.value = false
  showSearch2.value = false
}

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
}

const selectYourWork = () => {
  activeTab.value = 'yourwork'
}

const selectDashboard = () => {
  activeTab.value = 'dashboard'
}

const selectProject = (project: any) => {
  selectedProject.value = project
  showProjects.value = false
}

const toggleSidebarPin = () => {
  isSidebarPinned.value = !isSidebarPinned.value
}

// ==================== LIFECYCLE ====================
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

::selection {
  background-color: #22C55E;
  color: white;
}
</style>