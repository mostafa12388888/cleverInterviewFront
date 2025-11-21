<template>
  <div class="relative flex">
    <!-- Sidebar -->
    <aside
      class="relative flex"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      :class="[
        'bg-white border-r border-gray-200 h-screen transition-all duration-300 ease-in-out flex flex-col justify-between shadow-sm',
        isHovered ? 'w-64' : 'w-20',
      ]"
    >
      <!-- Top Section (Project Info) -->
      <div class="flex items-center gap-3 p-4">
        <div
          class="flex items-center justify-center w-10 h-10 rounded-md bg-green-100 text-green-700 font-bold text-lg"
        >
          Fp
        </div>
        <div v-if="isHovered" class="flex flex-col leading-tight">
          <span class="font-semibold text-gray-800 text-sm">First Project</span>
          <span class="text-xs text-gray-500">111111</span>
        </div>
      </div>

      <!-- Pin Button (في المنتصف) -->
      <div
        v-if="isHovered"
        class="absolute left-full top-1/2 -translate-y-1/2 -translate-x-1/2"
      >
        <button
          class="bg-green-500 text-white rounded-full p-2 shadow-md hover:bg-green-600 transition"
          title="Pin Sidebar"
        >
          📌
        </button>
      </div>

      <!-- Menu -->
      <nav class="flex-1 overflow-y-auto">
        <ul>
          <li
            v-for="(item, i) in menuItems"
            :key="i"
            class="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer transition"
          >
            <span class="text-xl">📁</span>
            <span
              v-if="isHovered"
              class="text-gray-700 text-sm transition-opacity duration-300"
            >
              {{ item }}
            </span>
          </li>
        </ul>

        <!-- Divider -->
        <hr class="my-3 border-gray-200" />

        <!-- Project Settings -->
        <div
          class="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
        >
          <span class="text-xl">⚙️</span>
          <span v-if="isHovered" class="text-gray-700 text-sm"
            >Project Settings</span
          >
        </div>
      </nav>

      <!-- Footer (User Info) -->
      <div class="p-4 border-t border-gray-200 flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/40"
          alt="user"
          class="w-10 h-10 rounded-full"
        />
        <div v-if="isHovered" class="leading-tight">
          <p class="text-gray-800 font-medium text-sm">Admin undefined</p>
          <p class="text-xs text-gray-500">Admin</p>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isHovered = ref(false);

const menuItems = ["First module", "12", "Test 3", "Test Module 12 7", "12"];
</script>
