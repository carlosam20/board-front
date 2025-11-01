

<template>
  <div class="drawing-board">
    <div class="toolbar">
      <input type="color" v-model="color" />
      <fwb-range type="range" :min="1" :max="20" v-model="lineWidth" />
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

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FwbRange } from 'flowbite-vue';
import {connectToRoom, sendDrawEvent} from './../services/drawingSocket';
import type { DrawingEvent } from './../services/drawingSocket';



const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const drawing = ref(false);
const color = ref('#000000');
const lineWidth = ref(5);
const roomId = 'default-room'; // You can make this dynamic
const sessionId = crypto.randomUUID();

function startDrawing(e: MouseEvent) {
  drawing.value = true;
  draw(e);
  sendDrawEvent(roomId, createEvent(e, 'start'));
}

function stopDrawing(e: MouseEvent) {
  drawing.value = false;
  ctx.value?.beginPath();
  sendDrawEvent(roomId, createEvent(e, 'end'));
}

function draw(e: MouseEvent) {
  if (!drawing.value || !ctx.value || !canvas.value) return;

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
  sendDrawEvent(roomId, createEvent(e, 'draw'));
}

function createEvent(e: MouseEvent, type: DrawingEvent['type']): DrawingEvent {
  const rect = canvas.value!.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
    type,
    color: color.value,
    lineWidth: lineWidth.value,
    sessionId
  };
}

function clearCanvas() {
  ctx.value?.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
  sendDrawEvent(roomId, {
    x: 0, y: 0, type: 'clear', color: '#000000', lineWidth: 1, sessionId
  });
}

function handleRemoteDraw(event: DrawingEvent) {
  if (!ctx.value) return;

  ctx.value.lineWidth = event.lineWidth;
  ctx.value.lineCap = 'round';
  ctx.value.strokeStyle = event.color;

  if (event.type === 'start') {
    ctx.value.beginPath();
    ctx.value.moveTo(event.x, event.y);
  } else if (event.type === 'draw') {
    ctx.value.lineTo(event.x, event.y);
    ctx.value.stroke();
  } else if (event.type === 'end') {
    ctx.value.beginPath();
  } else if (event.type === 'clear') {
    ctx.value.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
  }
}

onMounted(() => {
  ctx.value = canvas.value?.getContext('2d') ?? null;
  connectToRoom(roomId, handleRemoteDraw);
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

