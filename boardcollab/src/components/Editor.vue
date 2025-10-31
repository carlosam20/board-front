<script setup lang="ts">


</script>

<template>
  <div class="flex flex-col items-center justify-center p-4 space-y-4">
    <!-- Canvas -->
    <div class="border rounded-lg shadow-sm overflow-hidden">
      <canvas
        ref="canvas"
        class="bg-white border border-gray-200 rounded-md cursor-crosshair"
        :width="canvasWidth"
        :height="canvasHeight"
      />
    </div>

    <!-- Controls -->
    <div class="flex items-center space-x-4">
      <button
        @click="clearCanvas"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Clear Canvas
      </button>
      <button
        @click="changeColor"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Change Color
      </button>
      <div class="flex items-center space-x-2">
        <label for="lineWidth" class="text-sm font-medium text-gray-700">Line Width:</label>
        <input
          id="lineWidth"
          v-model="lineWidth"
          type="range"
          min="1"
          max="20"
          class="w-32"
        />
        <span class="text-sm text-gray-600">{{ lineWidth }}px</span>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">


import { ref, onMounted } from 'vue';
import { Button } from '@/components/ui/button'; // shadcn/ui Button component

const canvas = ref(null);
const canvasWidth = ref(600);
const canvasHeight = ref(400);
const lineWidth = ref(5);
const isDrawing = ref(false);
const currentColor = ref('#000000');
let ctx = null;


onMounted(() => {
  ctx = canvas.value.getContext('2d');
  ctx.strokeStyle = currentColor.value;
  ctx.lineWidth = lineWidth.value;
  ctx.lineCap = 'round';
});

const startDrawing = (e) => {
  isDrawing.value = true;
  draw(e);
};

const draw = (e) => {
  if (!isDrawing.value) return;

  const rect = canvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
};

const stopDrawing = () => {
  isDrawing.value = false;
  ctx.beginPath();
};


// const clearCanvas = () => {
// const canvas = ref(canvas)
// canvas.clearRect(0, 0, canvas.width, canvas.height);

// };

// const clearCanvas = () => {
//   ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
//   ctx.beginPath();
// };

const changeColor = () => {
  currentColor.value = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  ctx.strokeStyle = currentColor.value;
};
</script>
