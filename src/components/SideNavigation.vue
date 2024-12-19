<template>
  <div class="flex h-full flex-col border-r border-gray-200 bg-white">
    <!-- Fixed Header -->
    <div class="flex h-16 shrink-0 items-center px-6 border-b border-gray-200">
      <img class="h-8 w-auto" :src="Logo" alt="Your Company">
    </div>
    
    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto">
      <nav class="flex flex-col gap-y-5 px-6 py-4">
        <ul role="list" class="flex flex-1 flex-col gap-y-7">
          <!-- Navigation Items -->
          <li>
            <ul role="list" class="-mx-2 space-y-1">
              <li v-for="item in navigationItems" :key="item.name">
                <a :href="item.href" 
                   :class="[
                     item.current ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                     'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                   ]">
                  <svg v-if="!item.icon" class="size-6 shrink-0" 
                       :class="[
                         item.current ? 'text-primary' : 'text-gray-400 group-hover:text-primary'
                       ]"
                       fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                  <IconDashboard v-if="item.icon === 'Dashboard'" />
                  {{ item.name }}
                </a>
              </li>
            </ul>
          </li>

          <!-- Recent Files Section -->
          <li>
            <button @click="toggleRecentFiles" class="flex items-center gap-x-2 font-semibold justify-between w-full">
              <div class="flex items-center gap-x-2">
                <IconCopy />
                <span class="text-sm font-light text-gray-900">
                  Recent Files
                </span>
              </div>
              <div :class="{ 'rotate-90': isRecentFilesOpen }">
                <IconChevronRight />
              </div>
            </button>
            <Transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <ul v-if="isRecentFilesOpen" role="list" class="-mx-2 mt-2 space-y-1">
                <li v-for="file in recentFiles" :key="file.name">
                  <a href="#" class="group flex gap-x-3 rounded-md p-2 text-sm/6 text-gray-700 hover:bg-gray-50 hover:text-primary">
                    <div class="flex flex-col">
                      <span class="truncate">{{ file.name }}</span>
                      <i class="text-xs text-gray-500">Last Viewed: <span>{{ file.lastViewed }}</span></i>
                    </div>
                  </a>
                </li>
              </ul>
            </Transition>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import IconCopy from './Icon/Copy.vue';
import Logo from '../assets/Logo.png';
import IconChevronRight from './Icon/IconChevronRight.vue';
import IconDashboard from './Icon/Dashboard.vue';

const isRecentFilesOpen = ref(true);

const toggleRecentFiles = () => {
  isRecentFilesOpen.value = !isRecentFilesOpen.value;
};

const recentFiles = ref([
  { name: 'financial_report_q2_2024', lastViewed: 'just now' },
  { name: 'marketing_strategy_analysis', lastViewed: '30mins' },
  { name: 'travel_budget_breakdown', lastViewed: '1hour' },
  { name: 'user_experience_design_guide', lastViewed: '5hours' },
  { name: 'project_proposal_automation', lastViewed: '5hours' },
]);

const navigationItems = [
  { name: 'Dashboard', href: '#', icon: 'Dashboard', current: true },
];
</script>

<style scoped>
.rotate-90 {
  transform: rotate(180deg);
  transition: transform 0.2s ease-in-out;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.overflow-y-auto {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style> 