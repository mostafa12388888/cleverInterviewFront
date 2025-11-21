<template>
  <div class="relative flex" ref="searchRef">
    <button v-if="!showSearch" @click.stop="openSearch" class="icon-btn">
      <Search class="icon" />
    </button>

    <transition name="search-expand">
      <div v-if="showSearch" class="absolute right-0 top-1/2 -translate-y-1/2 w-[280px] md:w-[340px]">
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          placeholder="Search"
          class="search-input"
          @keydown.esc="closeSearch"
        />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from 'lucide-vue-next'

const showSearch = ref(false)
const searchQuery = ref('')
const searchInputRef = ref(null)

const openSearch = () => {
  showSearch.value = true
  setTimeout(() => searchInputRef.value?.focus(), 50)
}

const closeSearch = () => {
  showSearch.value = false
  searchQuery.value = ''
}
</script>
