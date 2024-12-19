<script setup>
import { onMounted } from 'vue';
import Chart from 'chart.js/auto';

onMounted(() => {
  const ctx = document.getElementById('fileTypeChart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['PDF', 'DOC', 'Word', 'PNG', 'JPEG', 'CSV', 'Excel', 'Scan', 'GIF'],
      datasets: [{
        data: [12, 8, 8, 15, 10, 11, 13, 9, 7],
        backgroundColor: [
          '#818CF8',
          '#93C5FD',
          '#86EFAC',
          '#1F2937',
          '#93C5FD',
          '#6EE7B7',
          '#60A5FA',
          '#93C5FD',
          '#9CA3AF'
        ],
        borderWidth: 0
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: ''
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <div class="flex items-center gap-2">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M13 8.5C13.5523 8.5 14 8.94772 14 9.5V17.5C14 18.0523 13.5523 18.5 13 18.5C12.4477 18.5 12 18.0523 12 17.5V9.5C12 8.94772 12.4477 8.5 13 8.5Z" fill="#0C8FE9"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M18 13.5C18.5523 13.5 19 13.9477 19 14.5V17.5C19 18.0523 18.5523 18.5 18 18.5C17.4477 18.5 17 18.0523 17 17.5V14.5C17 13.9477 17.4477 13.5 18 13.5Z" fill="#0C8FE9"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3 2.5C3.55228 2.5 4 2.94772 4 3.5V19.5C4 19.7652 4.10536 20.0196 4.29289 20.2071C4.48043 20.3946 4.73478 20.5 5 20.5H21C21.5523 20.5 22 20.9477 22 21.5C22 22.0523 21.5523 22.5 21 22.5H5C4.20435 22.5 3.44129 22.1839 2.87868 21.6213C2.31607 21.0587 2 20.2956 2 19.5V3.5C2 2.94772 2.44772 2.5 3 2.5Z" fill="#0C8FE9"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8 4.5C8.55228 4.5 9 4.94772 9 5.5V17.5C9 18.0523 8.55228 18.5 8 18.5C7.44772 18.5 7 18.0523 7 17.5V5.5C7 4.94772 7.44772 4.5 8 4.5Z" fill="#0C8FE9"/>
        </svg>
      </span>
      <span class="text-gray-600 whitespace-nowrap">
        Visual chart by file types
      </span>
    </div>
    <canvas id="fileTypeChart"></canvas>
  </div>
</template> 