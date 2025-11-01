<template>
  <div class="drawing-board">
    <div class="toolbar">
      <input type="color" v-model="color" />
      <fwb-range type="range" min="1" max="20" v-model="lineWidth" />
      <button @click="clearCanvas">Clear</button>
    </div>
    <canvas
      ref="canvas"
      width="1200"
      height="650"
      @mousedown="startDrawing"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      @mousemove="draw"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { FwbRange } from 'flowbite-vue'

const canvas = ref(null);
const ctx = ref(null);
const drawing = ref(false);
const color = ref('#000000');
const lineWidth = ref(5);

const startDrawing = (e) => {
  drawing.value = true;
  draw(e);
};

const stopDrawing = () => {
  drawing.value = false;
  ctx.value.beginPath();
};

const draw = (e) => {
  if (!drawing.value) return;

  const rect = canvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.value.lineWidth = lineWidth.value;
  ctx.value.lineCap = 'round';
  ctx.value.strokeStyle = color.value;

  ctx.value.lineTo(x, y);
  ctx.value.stroke();
  ctx.value.beginPath();
  ctx.value.moveTo(x, y);
};

const clearCanvas = () => {
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
};

onMounted(() => {
  ctx.value = canvas.value.getContext('2d');
});
</script>

<style scoped>
.drawing-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  
}

canvas {
  border: 1px solid #ccc;
  cursor: crosshair;
  border-radius: 1%;
}


@media (width >= 600px) {
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center; 
  gap: 5px; 
  padding: 2em; 
  margin: 2em;
}
}

@media (width <= 600px) {
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center; 
  gap: 5px; 
  padding: 1em; 
  margin: 1em;
}
}
</style>

