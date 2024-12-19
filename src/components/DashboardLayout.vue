<script setup>
import { ref, onMounted, watch } from 'vue';
import SideNavigation from './SideNavigation.vue';
import FileList from './FileList.vue';
import FileTypeChart from './FileTypeChart.vue';
import AINotification from './AINotification.vue';
import IconFilters from './Icon/Filter.vue';
import axios from 'axios';

const currentTab = ref('');
const tabs = ref([]);
const files = ref([]);
const sidebarOpen = ref(false);
const isDrawerOpen = ref(false);

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const fetchCategories = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/categories`)
    tabs.value = response.data
    // Set the first tab as default if available
    if (tabs.value.length > 0) {
      currentTab.value = tabs.value[0].name
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

// Pass files data to FileList component
const isLoading = ref(false)

const fetchFiles = async (categoryId = null, filters = {}) => {
  try {
    isLoading.value = true
    const url = new URL(`${apiBaseUrl}/files`)
    
    // Add category filter
    if (categoryId) {
      url.searchParams.append('categoryId', categoryId)
    }
    
    // Add other filters
    if (filters.fileType) {
      url.searchParams.append('fileType', filters.fileType)
    }
    if (filters.startDate) {
      url.searchParams.append('startDate', filters.startDate)
    }
   
    if (filters.flag) {
      url.searchParams.append('flag', filters.flag)
    }

    const response = await axios.get(url.toString())
    files.value = response.data
  } catch (error) {
    console.error('Error fetching files:', error)
  } finally {
    isLoading.value = false
  }
}

// Watch for tab changes to fetch relevant files
watch(currentTab, async (newTab) => {
  const selectedCategory = tabs.value.find(tab => tab.name === newTab)
  if (selectedCategory) {
    await fetchFiles(selectedCategory.id)
  }
})

// Handle filter changes
const handleFilterChange = (filters) => {
  const selectedCategory = tabs.value.find(tab => tab.name === currentTab.value)
  fetchFiles(selectedCategory?.id, filters)
}

onMounted(async () => {
  await fetchCategories()
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value;
};
</script>

<template>
  <div>
    <!-- Mobile sidebar -->
    <Transition
      enter-active-class="transition ease-in-out duration-300 transform"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in-out duration-300 transform"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div v-if="sidebarOpen" class="relative z-50 lg:hidden" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <Transition
          enter-active-class="transition-opacity ease-linear duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity ease-linear duration-300"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80" @click="toggleSidebar"></div>
        </Transition>
        
        <div class="fixed inset-0 flex">
          <div class="relative mr-16 flex w-full max-w-xs flex-1">
            <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button type="button" class="-m-2.5 p-2.5" @click="toggleSidebar">
                <span class="sr-only">Close sidebar</span>
                <svg class="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <SideNavigation />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Desktop sidebar -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-in-out"
      enter-from-class="-translate-x-72"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in-out"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-72"
    >
      <div v-if="!isDrawerOpen" class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <SideNavigation />
      </div>
    </Transition>

    <!-- Main content area -->
    <div :class="[isDrawerOpen ? 'lg:pl-0' : 'lg:pl-72', 'transition-padding duration-300']">
      <!-- Header -->
      <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="toggleSidebar">
          <span class="sr-only">Open sidebar</span>
          <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <!-- Desktop drawer toggle -->
        <button type="button" class="hidden lg:block -m-2.5 text-gray-700" @click="toggleDrawer">
          <span class="sr-only">Toggle drawer</span>
          <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <!-- Search bar -->
        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-4 items-center">
            <h1 class="text-gray-800 font-light flex-1">Dashboard</h1>
            <button class="text-gray-900 font-medium flex items-center gap-x-1 border border-gray-300 rounded-lg px-3 py-2">
              <IconFilters class="size-4" />
              <span class="text-xs">
                Configuration
              </span>
            </button>
            <div class="flex items-center gap-x-2">
              <img class="size-8 rounded-full object-cover" src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="">
              <span class="text-sm">
                John Doe
              </span>
            </div>
        </div>
      </div>

      <!-- Main content -->
      <main class="p-6 mr-0 lg:mr-64 2xl:mr-80 bg-gray-50 ">
        <!-- Your existing content -->
        <div class="mb-6">
          <h2 class="text-xl font-medium text-gray-700">Home/Dashboard</h2>
        </div>
        <div class="grid lg:hidden sm:grid-cols-1 sm:items-start w-full mb-3 h-full bg-white">
            <label for="cover-photo" class="sr-only">Cover photo</label>
            <div class="mt-2 sm:col-span-1 sm:mt-0 h-full">
              <div class="flex justify-center items-center rounded-lg border-2 border-dashed border-gray-400/25 px-6 py-4 h-full">
                <div class="text-center vertical-center">
                  <PhotoIcon class="mx-auto size-12 text-gray-300" aria-hidden="true" />
                  <div class="mt-4 flex text-xs/6 text-gray-600">
                    <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                      <input id="file-upload" name="file-upload" type="file" class="sr-only" />
                    </label>
                    <p class="">Drag and drop files here or click to browse</p>
                  </div>
                  <p class="text-xs/5 text-gray-600 italic">Supports: PDF, DOC, DOCX, PNG, JPEG, GIF, CSV, Excel</p>
                </div>
              </div>
            </div>
          </div>
        <!-- Tabs -->
        <div class="">
          <div class="mb-6 bg-white p-3 shadow rounded-lg">
          <div class="overflow-scroll">
            <nav class="flex space-x-4 border-b min-w-full">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="currentTab = tab.name"
              :class="[
                'px-4 py-2 -mb-px text-sm whitespace-nowrap',
                currentTab === tab.name
                  ? 'text-primary border-b-[3px] border-primary font-semibold'
                  : 'text-gray-700'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
          </div>
          <div class="col-span-full">
            <FileList 
              :files="files"
              :isLoading="isLoading"
              :currentCategory="currentTab"
              @filter-change="handleFilterChange"
            />
           </div>
        </div>
        </div>

        <div class="grid grid-cols-1 2xl:grid-cols-3 gap-6">
          <div class="2xl:col-span-2">
            <FileTypeChart />
          </div>
          <div>
            <AINotification />
          </div>
         
        </div>
        <div class="hidden lg:block bg-white border-l border-gray-200 fixed bottom-0 right-0 top-0 w-64 2xl:w-80 h-full flex flex-col items-center justify-center">
          <div class="sm:grid sm:grid-cols-1 sm:items-start w-full p-3 h-full mt-16">
            <label for="cover-photo" class="sr-only">Cover photo</label>
            <div class="mt-2 sm:col-span-1 sm:mt-0 h-full">
              <div class="flex max-w-2xl justify-center items-center rounded-lg border-2 border-dashed border-gray-400/25 px-6 py-10 bg-gray-50 h-full">
                <div class="text-center vertical-center">
                  <PhotoIcon class="mx-auto size-12 text-gray-300" aria-hidden="true" />
                  <div class="mt-4 flex text-xs/6 text-gray-600">
                    <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                      <input id="file-upload" name="file-upload" type="file" class="sr-only" />
                    </label>
                    <p class="">Drag and drop files here or click to browse</p>
                  </div>
                  <p class="text-xs/5 text-gray-600 italic">Supports: PDF, DOC, DOCX, PNG, JPEG, GIF, CSV, Excel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.transition-padding {
  transition-property: padding;
}
.overflow-y-auto::-webkit-scrollbar  {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.overflow-y-auto {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style> 