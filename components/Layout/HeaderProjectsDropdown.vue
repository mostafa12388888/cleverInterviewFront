<template>
  <div class="relative" ref="projectsRef">
    <button @click="toggleProjects" class="project-btn">
      <span>Projects</span>
      <ChevronDown :class="['icon', showProjects && 'rotate-180']" />
    </button>

    <transition name="dropdown">
      <div v-if="showProjects" class="dropdown-panel">
        <div class="px-3 pb-2">
          <input v-model="searchProject" type="text" placeholder="Search" class="project-input" />
        </div>

        <div class="max-h-[320px] overflow-y-auto custom-scrollbar">
          <button
            v-for="project in filteredProjects"
            :key="project.id"
            @click="selectProject(project)"
            class="project-item"
          >
            <div :class="['avatar', project.color]">{{ project.initial }}</div>
            <div>
              <div class="project-name">{{ project.name }}</div>
              <div class="project-code">{{ project.code }}</div>
            </div>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const showProjects = ref(false)
const searchProject = ref('')
const projects = ref([
  { id: 1, name: 'Main App', code: 'APP01', color: 'bg-green-500', initial: 'A' },
  { id: 2, name: 'Admin Portal', code: 'ADM02', color: 'bg-blue-500', initial: 'P' },
])

const filteredProjects = computed(() =>
  projects.value.filter(p => p.name.toLowerCase().includes(searchProject.value.toLowerCase()))
)

const toggleProjects = () => (showProjects.value = !showProjects.value)
const selectProject = project => {
  console.log('Selected:', project)
  showProjects.value = false
}
</script>
