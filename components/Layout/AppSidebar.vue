<template>
  <aside
    v-if="selectedProject"
    class="relative flex"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    :class="[
      'bg-white border-gray-200 h-screen transition-all duration-300 ease-in-out flex flex-col shadow-sm',
      isRTL ? 'border-l' : 'border-r',
      isHovered || isPinned ? 'w-64' : 'w-20',
    ]"
  >
    <!-- Top Section (Project Info) -->
    <div class="flex items-center gap-3 p-4 border-b border-gray-200">
      <div
        class="flex items-center justify-center w-10 h-10 rounded-md font-bold text-lg text-[#22C55E] bg-[#22C55E]/10 transition-colors"
      >
        {{ $getInitial(selectedProject?.name?.[locale]) }}
      </div>
      <div v-if="isHovered || isPinned" class="flex flex-col leading-tight">
        <span class="font-semibold text-gray-800 text-sm">
          {{ selectedProject?.name?.[locale] }}
        </span>
        <span class="text-xs text-gray-500">
          {{ selectedProject?.wbs?.title?.[locale] }}
        </span>
      </div>
    </div>

    <!-- Pin Button -->
    <div
      v-if="isHovered || isPinned"
      :class="[
        'absolute top-1/2 -translate-y-1/2',
        isRTL ? 'right-full translate-x-1/2' : 'left-full -translate-x-1/2',
      ]"
    >
      <button
        @click="$emit('toggle-pin')"
        :class="[
          'rounded-full p-2 shadow-md transition hover:bg-[#22C55E]',
          isPinned
            ? 'bg-gray-300 text-gray-700'
            : 'bg-gray-200 text-gray-600 ',
        ]"
        :title="isPinned ? 'Unpin Sidebar' : 'Pin Sidebar'"
      >
        <component :is="isPinned ? PinOff : Pin" class="w-5 h-5" />
      </button>
    </div>

    <!-- Menu -->
    <nav class="flex-1 overflow-y-auto custom-scrollbar">
      <ul class="p-2">
        <li v-for="(item, i) in menuItems" :key="i" class="mb-1">
          <!-- Module Item -->
          <div
            @click="toggleModule(i)"
            :class="[
              'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all',
              expandedModules[i]
                ? 'bg-[#22C55E] text-white'
                : 'hover:bg-gray-100 text-gray-700 hover:text-[#22C55E]',
            ]"
          >
            <div class="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <Home class="w-5 h-5" />
            </div>
            <span
              v-if="isHovered || isPinned"
              class="text-sm font-medium flex-1 transition-opacity duration-300"
            >
              {{ item.name }}
            </span>
            <ChevronDown
              v-if="(isHovered || isPinned) && item.forms?.length > 0"
              :class="[
                'w-4 h-4 transition-transform duration-200',
                expandedModules[i] ? 'rotate-180' : '',
              ]"
            />
          </div>

          <!-- Forms Submenu -->
          <div
            v-if="
              (isHovered || isPinned) &&
              expandedModules[i] &&
              item.forms?.length > 0
            "
            :class="[isRTL ? 'mr-8' : 'ml-8', 'mt-1 space-y-1']"
          >
            <div
              v-for="(form, formIndex) in item.forms"
              :key="formIndex"
              @click="selectForm(i, formIndex)"
              class="px-3 py-2 rounded-md text-sm cursor-pointer transition-colors hover:text-[#22C55E] font-medium text-gray-600"
            >
              {{ form?.name[locale] }}
            </div>
          </div>
        </li>
      </ul>

      <!-- Divider -->
      <hr class="my-3 border-gray-200" />

      <!-- Project Settings -->
      <div class="px-2">
        <div
          class="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
        >
          <div class="w-5 h-5 flex items-center justify-center">
            <Settings class="w-5 h-5" />
          </div>
          <span
            v-if="isHovered || isPinned"
            class="text-gray-700 text-sm font-medium"
          >
            {{ isRTL ? 'إعدادات المشروع' : 'Project Settings' }}
          </span>
          <component
            v-if="isHovered || isPinned"
            :is="isRTL ? ChevronLeft : ChevronRight"
            :class="['w-4 h-4 text-gray-400', isRTL ? 'mr-auto' : 'ml-auto']"
          />
        </div>
      </div>
    </nav>

    <!-- Footer (User Info) -->
    <div class="p-4 border-t border-gray-200 flex items-center gap-3">
      <img
        src="https://i.pravatar.cc/40"
        alt="user"
        class="w-10 h-10 rounded-full"
      />
      <div v-if="isHovered || isPinned" class="flex-1 leading-tight">
        <p class="text-gray-800 font-medium text-sm">Admin undefined</p>
        <p class="text-xs text-gray-500">Admin</p>
      </div>
      <button
        v-if="isHovered || isPinned"
        class="text-[#22C55E] hover:text-[#16A34A] transition-colors"
      >
        <LogOut class="w-5 h-5" />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import { Home, Pin, PinOff, ChevronDown, Settings, ChevronRight, ChevronLeft, LogOut } from "lucide-vue-next";
import { projectModuleFormApi } from "@/composables/projectModuleFormApi";

const { locale } = useI18n();
const isRTL = computed(() => locale.value === 'ar');
const { $getInitial } = useNuxtApp();
const { moduleFormByProjectId } = projectModuleFormApi();

const props = defineProps({
  selectedProject: {
    type: Object,
    default: null,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["toggle-pin"]);

const isHovered = ref(false);
const menuItems = ref<any[]>([]);
const expandedModules = reactive<{ [key: number]: boolean }>({});
const selectedForm = ref<{ moduleIndex: number; formIndex: number } | null>(
  null
);

const toggleModule = (index: number) => {
  expandedModules[index] = !expandedModules[index];
};

const selectForm = (moduleIndex: number, formIndex: number) => {
  selectedForm.value = { moduleIndex, formIndex };
  // Emit event or navigate to form
};

// Fetch modules and forms when project changes
watch(
  () => props.selectedProject?.id,
  async (newId) => {
    if (!newId) return;
    try {
      console.log("🔄 Fetching modules for project ID:", newId);
      const res = await moduleFormByProjectId(newId);
      console.log("✅ API Response:", res);

      // Transform the data to include forms
      menuItems.value = res.data.map((module: any) => ({
        id: module.id,
        name: module.name[locale.value],
        forms: module.forms || [], // Assuming API returns forms array
      }));
    } catch (error) {
      console.error("❌ Error fetching modules:", error);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
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
</style>
