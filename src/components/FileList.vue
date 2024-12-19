<script setup>
import { ref, onMounted } from 'vue';
import { defineProps, watch } from 'vue';
import yellowFlag from '/yellow-flag.svg';
import greenFlag from '/green-flag.svg';
import redFlag from '/red-flag.svg';
import defaultFlag from '/flag.svg';

const props = defineProps({
  files: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  currentCategory: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['filter-change']);

// Filter states
const selectedFileType = ref('');
const startDate = ref('');
const selectedFlag = ref('');

const fileTypes = ['pdf', 'png', 'jpg', 'docx'];
const flagTypes = [
  { value: 'in_progress', icon: yellowFlag, text: 'In Progress' },
  { value: 'done', icon: greenFlag, text: 'Done' },
  { value: 'failed', icon: redFlag, text: 'Failed' }
];

// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'TBD';
  return new Date(dateString).toLocaleDateString();
};

// Function to get flag image based on status
const getFlagImage = (flag) => {
  const flagImages = {
    in_progress: yellowFlag,
    done: greenFlag,
    failed: redFlag,
  };
  return flagImages[flag] || defaultFlag;
};

// Watch for filter changes
watch([selectedFileType, startDate, selectedFlag], () => {
  emit('filter-change', {
    fileType: selectedFileType.value,
    startDate: startDate.value,
    flag: selectedFlag.value
  });
});

// Add new ref for dropdown state
const showFlagDropdown = ref(false);

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.flag-dropdown');
    if (dropdown && !dropdown.contains(e.target)) {
      showFlagDropdown.value = false;
    }
  });
});
</script>

<template>
  <div class="">
    <div class="flex flex-col lg:flex-row justify-between lg:items-center p-4">
      <h3 class="text-gray-600 whitespace-nowrap">{{ currentCategory }}</h3>
      <div class="flex flex-wrap space-x-2 w-full justify-end gap-2">
        <!-- Document Type Filter -->
        <select 
          v-model="selectedFileType"
          class="border border-gray-200 rounded-md px-2 py-2 text-xs w-full md:max-w-[150px] flex-1"
        >
          <option value="">Document types</option>
          <option v-for="type in fileTypes" :key="type" :value="type">
            {{ type.toUpperCase() }}
          </option>
        </select>

        <!-- Date Filter -->
        <div class="flex space-x-2">
          <input
            type="date"
            v-model="startDate"
            class="border border-gray-200 rounded-md px-2 py-2 text-xs"
            placeholder="Start date"
          />
         
        </div>

        <!-- Flag Filter -->
        <div class="relative">
          <button 
            @click="showFlagDropdown = !showFlagDropdown"
            class="border rounded-md px-2 py-2 text-xs w-16 flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <img 
                v-if="selectedFlag" 
                :src="flagTypes.find(f => f.value === selectedFlag)?.icon" 
                class="w-4 h-4" 
              />
              <span v-if="!selectedFlag">Flag</span>
            </div>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown menu -->
          <div 
            v-if="showFlagDropdown" 
            class="absolute z-10 mt-1 w-16 bg-white border rounded-md shadow-lg"
          >
            <div 
              class="py-1 px-2 hover:bg-gray-100 cursor-pointer"
              @click="selectedFlag = ''; showFlagDropdown = false"
            >
              Flag
            </div>
            <div 
              v-for="flag in flagTypes" 
              :key="flag.value"
              class="py-1 px-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              @click="selectedFlag = flag.value; showFlagDropdown = false"
            >
              <img :src="flag.icon" class="w-4 h-4" />
              <!-- <span>{{ flag.text }}</span> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-2 text-gray-500">Loading files...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="files.length === 0" class="p-8 text-center">
      <p class="text-gray-500">No files found in this category</p>
    </div>

    <!-- Files Table -->
    <div v-else class="overflow-x-auto border border-gray-100 rounded-lg">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-sm font-normal text-gray-600">
              <input id="comments" aria-describedby="comments-description" name="comments" type="checkbox" checked="" class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-primary checked:bg-primary indeterminate:border-primary indeterminate:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto" />  
            </th>
            <th class="px-4 py-2 text-left text-sm font-normal text-gray-600">File name</th>
            <th class="px-4 py-2 text-left text-sm font-normal text-gray-600">Date</th>
            <th class="px-4 py-2 text-left text-sm font-normal text-gray-600">Document index</th>
            <th class="px-4 py-2 text-left text-sm font-normal text-gray-600">Flag</th>
            <th class="px-4 py-2 text-left text-sm font-normal text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in files" :key="file.id" class="border-t text-sm text-gray-600">
            <td class="px-4 py-2.5">
              <input id="comments" aria-describedby="comments-description" name="comments" type="checkbox" checked="" class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-primary checked:bg-primary indeterminate:border-primary indeterminate:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto" />
              </td>
            <td class="px-4 py-2.5">{{ file.file_name }}</td>
            <td class="px-4 py-2.5">{{ formatDate(file.created_at) }}</td>
            <td class="px-4 py-2.5">{{ file.document_index }}</td>
            <td class="px-4 py-2.5">
              <img :src="getFlagImage(file.flag)" alt="flag status" class="w-4 h-4" />
            </td>
            <td class="px-4 py-2">
              <div class="flex space-x-2">
                <button class="text-gray-600 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                </button>
                <button class="text-gray-600 hover:text-gray-600">
                  <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button class="text-gray-600 hover:text-gray-600">
                  <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button class="text-gray-600 hover:text-gray-600">
                  <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button class="text-gray-600 hover:text-gray-600">
                  <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Hide default select arrow */
/* select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
} */
</style> 