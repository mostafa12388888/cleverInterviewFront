<template>
  <header class="bg-white border-b border-[#E5E7EB]">
    <div
      class="h-[56px] md:h-[60px] px-4 md:px-6 flex items-center justify-between max-w-[1920px] mx-auto"
    >
      <!-- ===== LEFT SECTION: Logo + Navigation ===== -->
      <div class="flex items-center gap-3 md:gap-7">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center select-none">
          <span
            class="text-[18px] md:text-[23px] font-bold text-[#1F2937] leading-none tracking-tight"
            >Clever</span
          >
          <span
            class="text-[18px] md:text-[23px] font-bold text-[#22C55E] leading-none tracking-tight"
            >Docs</span
          >
        </NuxtLink>

        <!-- Projects Dropdown Button -->
        <div class="relative" ref="projectsRef">
          <button
            @click="$emit('toggle-projects')"
            class="h-[32px] md:h-[36px] px-2.5 md:px-3.5 flex items-center gap-1.5 md:gap-2 bg-white border border-[#D1D5DB] rounded-[6px] hover:bg-[#F9FAFB] transition-colors text-[13px] md:text-[13.5px] font-medium text-[#374151]"
          >
            <span class="lg:px-6">{{ t('nav.projects') }}</span>
            <ChevronDown
              :class="[
                'w-3 md:w-3.5 h-3 md:h-3.5 text-[#6B7280] transition-transform duration-200',
                showProjects && 'rotate-180',
              ]"
            />
          </button>

          <!-- Projects Dropdown Panel -->
          <transition name="dropdown">
            <div
              v-if="showProjects"
              class="fixed md:absolute top-[56px] md:top-[calc(100%+6px)] left-0 right-0 md:left-auto md:right-auto md:start-0 w-full md:w-[360px] bg-white md:rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] md:border border-[#E5E7EB] overflow-hidden z-50"
            >
              <!-- Search Input -->
              <div class="p-3 border-b border-[#F3F4F6]">
                <div class="relative">
                  <Search
                    class="absolute start-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#9CA3AF]"
                  />
                  <input
                    ref="projectSearchRef"
                    :value="searchProject"
                    @input="handleSearchInput"
                    type="text"
                    :placeholder="t('common.search')"
                    class="w-full h-[40px] ps-10 pe-3 text-[14px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent focus:bg-white transition-all placeholder:text-[#9CA3AF]"
                  />
                </div>
              </div>

              <!-- Projects List -->
              <div
                class="max-h-[calc(100vh-140px)] md:max-h-[380px] overflow-y-auto custom-scrollbar"
              >
                <!-- Empty State -->
                <div
                  v-if="filteredProjects.length === 0"
                  class="flex flex-col items-center justify-center py-8 px-4"
                >
                  <Frown
                    class="w-12 h-12 text-[#D1D5DB] mb-3"
                  />
                  <p class="text-[13px] text-[#6B7280] text-center">
                    {{ t('projects.noResults') }}
                  </p>
                </div>

                <!-- Project Items -->
                <button
                  v-for="project in filteredProjects"
                  :key="project.id"
                  @click="$emit('select-project', project)"
                  class="w-full flex items-center gap-3 px-3 py-3 hover:bg-[#F9FAFB] transition-colors group"
                >
                  <div
                    class="w-[44px] h-[44px] rounded-[8px] flex items-center justify-center text-[#22C55E] text-[16px] font-bold flex-shrink-0 bg-[#22C55E]/10 group-hover:bg-[#22C55E]/15 transition-colors"
                  >
                    <span>{{ $getInitial(project.name[locale]) }}</span>
                  </div>
                  <div class="flex-1 text-start min-w-0">
                    <div
                      class="text-[14px] font-semibold text-[#1F2937] leading-tight truncate"
                    >
                      {{ project.name[locale] }}
                    </div>
                    <div
                      class="text-[12.5px] text-[#6B7280] leading-tight mt-1 truncate"
                    >
                      {{ project?.wbs?.title?.[locale] }}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- Your Work & Dashboard -->
        <div class="md:flex items-center gap-5">
          <!-- Your Work Link with Star -->
          <button
            @click="$emit('select-your-work')"
            :class="[
              'flex items-center gap-1.5 text-[13.5px] font-medium transition-colors',
              activeTab === 'yourwork'
                ? 'text-[#1F2937]'
                : 'text-[#6B7280] hover:text-[#1F2937]',
            ]"
          >
            <span>{{ t('nav.yourWork') }}</span>
            <Star
              :class="[
                'w-[15px] h-[15px] transition-all',
                activeTab === 'yourwork'
                  ? 'text-[#22C55E] fill-[#22C55E]'
                  : 'text-[#9CA3AF]',
              ]"
              :fill="activeTab === 'yourwork' ? 'currentColor' : 'none'"
            />
          </button>

          <!-- Dashboard Link with Star -->
          <button
            @click="$emit('select-dashboard')"
            :class="[
              'flex items-center gap-1.5 text-[13.5px] font-medium transition-colors',
              activeTab === 'dashboard'
                ? 'text-[#1F2937]'
                : 'text-[#6B7280] hover:text-[#1F2937]',
            ]"
          >
            <span>{{ t('nav.dashboard') }}</span>
            <Star
              :class="[
                'w-[15px] h-[15px] transition-all',
                activeTab === 'dashboard'
                  ? 'text-[#22C55E] fill-[#22C55E]'
                  : 'text-[#9CA3AF]',
              ]"
              :fill="activeTab === 'dashboard' ? 'currentColor' : 'none'"
            />
          </button>
        </div>
      </div>

      <!-- ===== RIGHT SECTION: Icons + Profile ===== -->
      <div class="flex items-center gap-1.5 md:gap-2.5">
        <!-- Search Button/Input -->
        <div class="relative flex flex-1" ref="searchRef">
          <button v-if="!showSearch2" @click.stop="$emit('open-search')" class="w-[32px] md:w-[36px] h-[32px] md:h-[36px] flex items-center justify-center hover:bg-[#F3F4F6] rounded-[6px] transition-colors" aria-label="Open search">
            <Search class="w-[16px] md:w-[18px] h-[16px] md:h-[18px] text-[#6B7280]" />
          </button>
          <transition name="search-expand">
            <div v-if="showSearch2" class="absolute end-0 top-1/2 -translate-y-1/2 w-[280px] md:w-[340px]">
              <div class="relative">
                <Search class="absolute start-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#9CA3AF]" />
                <input ref="searchInputRef" :value="searchQuery" @input="$emit('update:search-query', $event.target.value)" type="text" placeholder="Search" class="w-full h-[36px] md:h-[38px] ps-10 pe-3 text-[13.5px] md:text-[14px] bg-white border border-[#D1D5DB] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all placeholder:text-[#9CA3AF] shadow-lg" @keydown.esc="$emit('close-search')" />
              </div>
            </div>
          </transition>
        </div>

        <button class="w-[32px] md:w-[36px] h-[32px] md:h-[36px] flex items-center justify-center hover:bg-[#F3F4F6] rounded-[6px] transition-colors" aria-label="Notifications">
          <Bell class="w-[16px] md:w-[18px] h-[16px] md:h-[18px] text-[#6B7280]" />
        </button>

        <div class="relative" ref="settingsRef">
          <button @click="$emit('toggle-settings')" class="w-[32px] md:w-[36px] h-[32px] md:h-[36px] flex items-center justify-center hover:bg-[#F3F4F6] rounded-[6px] transition-colors">
            <Settings class="w-[16px] md:w-[18px] h-[16px] md:h-[18px] text-[#6B7280]" />
          </button>
          <transition name="dropdown">
            <div v-if="showSettings" class="fixed md:absolute top-[56px] md:top-[calc(100%+6px)] left-0 md:left-auto right-0 md:right-auto md:end-0 w-full md:w-[540px] bg-white md:rounded-[10px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] md:border border-[#E5E7EB] p-3 md:p-4 z-50 max-h-[calc(100vh-56px)] overflow-y-auto">
              <div class="flex items-center mb-3 md:mb-4 px-1">
                <h3 class="text-[16px] md:text-[17px] font-bold text-[#1F2937]">{{ t('settings.title') }}</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <NuxtLink v-for="(item, idx) in settingsItems" :key="idx" :to="localePath(item.to || '/dashboard')" @click="emit('close-all-dropdowns')" class="flex items-start gap-2.5 md:gap-3 p-2.5 md:p-3 hover:bg-[#F9FAFB] rounded-[8px] transition-colors text-start">
                  <div :class="['w-[38px] md:w-[42px] h-[38px] md:h-[42px] rounded-[8px] flex items-center justify-center flex-shrink-0', item.bgColor]">
                    <span class="text-[18px] md:text-[20px]">{{ item.icon }}</span>
                  </div>
                  <div class="flex-1 min-w-0 pt-0.5">
                    <div class="text-[13px] md:text-[13.5px] font-semibold text-[#1F2937] leading-tight">{{ item.title }}</div>
                    <div class="text-[11.5px] md:text-[12px] text-[#6B7280] leading-tight mt-1">{{ item.desc }}</div>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </transition>
        </div>

        <div class="flex items-center gap-2 md:gap-2.5 md:ml-1">
          <div class="text-right hidden lg:block">
            <div class="text-[10.5px] text-[#6B7280] leading-tight font-medium">Partner</div>
            <div class="text-[10.5px] font-bold text-[#374151] leading-tight">Lege Here</div>
          </div>
          <div class="relative" ref="profileRef">
            <button @click="$emit('toggle-profile')" class="w-[34px] md:w-[38px] h-[34px] md:h-[38px] rounded-full overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-[#22C55E] hover:ring-offset-2 transition-all shadow-sm border-2 border-white">
              <img src="https://i.pravatar.cc/150?img=12" alt="Profile" class="w-full h-full object-cover" />
            </button>
            <transition name="dropdown">
              <div v-if="showProfile" class="fixed md:absolute top-[56px] md:top-[calc(100%+6px)] left-0 md:left-auto right-0 md:right-auto md:end-0 w-full md:w-[340px] bg-white md:rounded-[10px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] md:border border-[#E5E7EB] overflow-hidden z-50">
                <div class="p-3 md:p-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <div class="flex items-start gap-2.5 md:gap-3">
                    <div class="w-[48px] md:w-[52px] h-[48px] md:h-[52px] rounded-full overflow-hidden flex-shrink-0 shadow-md border-2 border-white">
                      <img src="https://i.pravatar.cc/150?img=12" alt="Profile" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1 min-w-0 pt-0.5">
                      <div class="text-[14px] md:text-[15px] font-bold text-[#1F2937] leading-tight">مدير undefined</div>
                      <div class="text-[12px] md:text-[12.5px] text-[#6B7280] leading-tight mt-0.5">مدير</div>
                      <div class="text-[11px] md:text-[11.5px] text-[#9CA3AF] leading-tight mt-0.5">admin@gmail.com</div>
                    </div>
                    <ChevronRight class="w-[16px] md:w-[18px] h-[16px] md:h-[18px] text-[#9CA3AF] flex-shrink-0 mt-0.5 rtl:rotate-180" />
                  </div>
                </div>
                <div class="py-1">
                  <button class="w-full flex items-center gap-2.5 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 hover:bg-[#F9FAFB] transition-colors text-start">
                    <User class="w-[17px] md:w-[18px] h-[17px] md:h-[18px] text-[#6B7280] flex-shrink-0" />
                    <span class="text-[13px] md:text-[13.5px] font-medium text-[#374151]">{{ t('profile.yourProfile') }}</span>
                  </button>
                  <div class="flex items-center justify-between px-3 md:px-4 py-2 md:py-2.5 hover:bg-[#F9FAFB] transition-colors">
                    <div class="flex items-center gap-2.5 md:gap-3">
                      <Moon class="w-[17px] md:w-[18px] h-[17px] md:h-[18px] text-[#6B7280] flex-shrink-0" />
                      <span class="text-[13px] md:text-[13.5px] font-medium text-[#374151]">{{ t('theme.darkMode') }}</span>
                    </div>
                    <button @click="$emit('toggle-dark-mode')" :class="['relative w-[40px] md:w-[42px] h-[22px] md:h-[24px] rounded-full transition-all duration-300 shadow-inner', darkMode ? 'bg-[#22C55E]' : 'bg-[#D1D5DB]']">
                      <span :class="['absolute top-[2px] w-[18px] md:w-[20px] h-[18px] md:h-[20px] bg-white rounded-full shadow-md transition-all duration-300', darkMode ? 'start-[20px]' : 'start-[2px]']"></span>
                    </button>
                  </div>
                  <button @click="toggleLanguage" class="w-full flex items-center justify-between px-3 md:px-4 py-2 md:py-2.5 hover:bg-[#F9FAFB] transition-colors text-start">
                    <div class="flex items-center gap-2.5 md:gap-3">
                      <Languages class="w-[17px] md:w-[18px] h-[17px] md:h-[18px] text-[#6B7280] flex-shrink-0" />
                      <span class="text-[13px] md:text-[13.5px] font-medium text-[#374151]">{{ t('change_language') }}</span>
                    </div>
                    <span class="text-[18px] md:text-[20px]">{{ currentFlag }}</span>
                  </button>
                </div>
                <div class="p-3 md:p-4 border-t border-[#E5E7EB] bg-[#F9FAFB]">
                  <button class="w-full h-[40px] md:h-[42px] border-2 border-[#22C55E] text-[#22C55E] rounded-[8px] font-bold text-[13px] md:text-[13.5px] hover:bg-[#22C55E] hover:text-white transition-all shadow-sm">{{ t('actions.logout') }}</button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { 
  ChevronDown, Search, Frown, Star, Bell, Settings, 
  ChevronRight, User, Moon, Languages 
} from "lucide-vue-next";
const { locale, t, setLocale } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const localePath = useLocalePath();
const { $getInitial } = useNuxtApp();
const currentFlag = computed(() => (locale.value === "ar" ? "🇸🇦" : "🇺🇸"));

const toggleLanguage = () => {
  const next = locale.value === 'ar' ? 'en' : 'ar';
  setLocale(next);
  const path = switchLocalePath(next);
  if (path) navigateTo(path);
};
const props = defineProps({
  darkMode: Boolean,
  showProjects: Boolean,
  showSettings: Boolean,
  showProfile: Boolean,
  showSearch2: Boolean,
  searchProject: String,
  searchQuery: String,
  activeTab: String,
  isMobile: Boolean,
  projects: Array,
  settingsItems: Array,
});

const emit = defineEmits([
  "toggle-projects",
  "toggle-settings",
  "toggle-profile",
  "open-search",
  "close-search",
  "close-all-dropdowns",
  "toggle-dark-mode",
  "select-your-work",
  "select-dashboard",
  "select-project",
  "update:search-project",
  "update:search-query",
]);

// ==================== REFS ====================
const projectsRef = ref(null);
const settingsRef = ref(null);
const profileRef = ref(null);
const searchRef = ref(null);
const searchInputRef = ref(null);

// ==================== COMPUTED ====================
const filteredProjects = computed(() => {
  if (!props.searchProject) return props.projects;
  const search = props.searchProject.toLowerCase();
  return props.projects.filter(
    (p) => p.name.toLowerCase().includes(search) || p.code.includes(search)
  );
});

// ==================== METHODS ====================
const handleClickOutside = (event) => {
  if (props.isMobile) return;

  if (projectsRef.value && !projectsRef.value.contains(event.target)) {
    if (props.showProjects) emit("close-all-dropdowns");
  }
  if (settingsRef.value && !settingsRef.value.contains(event.target)) {
    if (props.showSettings) emit("close-all-dropdowns");
  }
  if (profileRef.value && !profileRef.value.contains(event.target)) {
    if (props.showProfile) emit("close-all-dropdowns");
  }
  if (searchRef.value && !searchRef.value.contains(event.target)) {
    if (props.showSearch2) emit("close-search");
  }
};

// ==================== WATCHERS ====================
watch(
  () => props.showSearch2,
  async (newVal) => {
    if (newVal) {
      await nextTick();
      searchInputRef.value?.focus();
    }
  }
);

// ==================== LIFECYCLE ====================
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* ==================== SEARCH EXPAND ANIMATION ==================== */
.search-expand-enter-active {
  animation: expandIn 0.25s ease-out;
}

.search-expand-leave-active {
  animation: expandOut 0.2s ease-in;
}

@keyframes expandIn {
  from {
    opacity: 0;
    width: 40px;
  }
  to {
    opacity: 1;
    width: 280px;
  }
}

@keyframes expandOut {
  from {
    opacity: 1;
    width: 280px;
  }
  to {
    opacity: 0;
    width: 40px;
  }
}

@media (min-width: 768px) {
  @keyframes expandIn {
    from {
      opacity: 0;
      width: 40px;
    }
    to {
      opacity: 1;
      width: 340px;
    }
  }

  @keyframes expandOut {
    from {
      opacity: 1;
      width: 340px;
    }
    to {
      opacity: 0;
      width: 40px;
    }
  }
}

/* ==================== DROPDOWN ANIMATION ==================== */
.dropdown-enter-active {
  animation: dropdownIn 0.2s ease-out;
}

.dropdown-leave-active {
  animation: dropdownOut 0.15s ease-in;
}

@keyframes dropdownIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes dropdownOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-8px);
  }
}

/* ==================== CUSTOM SCROLLBAR ==================== */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* ==================== MOBILE ADJUSTMENTS ==================== */
@media (max-width: 767px) {
  .dropdown-enter-active,
  .dropdown-leave-active {
    animation: none;
  }

  .dropdown-enter-active {
    animation: slideDown 0.25s ease-out;
  }

  .dropdown-leave-active {
    animation: slideUp 0.2s ease-in;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>
