<template>
  <header class="bg-white border-b border-[#E5E7EB]">
    <div class="h-[56px] md:h-[60px] px-4 md:px-6 flex items-center justify-between max-w-[1920px] mx-auto">
      <!-- Left -->
      <div class="flex items-center gap-3 md:gap-7">
        <HeaderLogo />
        <HeaderProjectsDropdown />
        <div class="hidden md:flex items-center gap-5">
          <button> Your work </button>
          <button> Dashboard </button>
        </div>
      </div>

      <!-- Right -->
      <div class="flex items-center gap-1.5 md:gap-2.5">
        <HeaderSearch />
        <HeaderSettings />
        <HeaderProfile />
      </div>
    </div>
  </header>
</template>

<script setup>
// import HeaderLogo from './HeaderLogo.vue'
// import HeaderProjectsDropdown from './HeaderProjectsDropdown.vue'
// import HeaderSearch from './HeaderSearch.vue'
// import HeaderSettings from './HeaderSettings.vue'
// import HeaderProfile from './HeaderProfile.vue'
</script>
