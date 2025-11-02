

<template>
    <div class="flex justify-left m-auto">
        <fwb-button @click = "copyClipboard"  gradient="purple-blue" outline>
        Copy code
      </fwb-button>
    </div>

    <div class="flex justify-end">
    <fwb-toast 
    v-if="showToast" 
    :type="toastType"
    closable @close="showToast = false" >
    <p class="text-white text-center">{{ toastMessage }}</p>
    </fwb-toast>
  </div>
  <div class=" flex justify-evenly drawing-board m-auto">
    <div class="toolbar">
      <input type="color" v-model="color" />
      <fwb-range gradient ="purple" type="range" :min="1" :max="20" v-model="lineWidth" />
      <fwb-button gradient="red" shadow @click="clearCanvas">Clear</fwb-button>
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
import { FwbToast } from 'flowbite-vue';
import { FwbButton } from 'flowbite-vue'

import {connectToRoom, sendDrawEvent} from './../services/drawingSocket';
import type { DrawingEvent } from './../services/drawingSocket';
import { useRoute } from 'vue-router';
import { computed } from 'vue';




const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const drawing = ref(false);
const color = ref('#000000');
const lineWidth = ref(5);
const roomId = computed(() => route.params.roomId as string);
const sessionId = crypto.randomUUID();
const route = useRoute();



const showToast = ref(false);
const toastType = ref('success'); // or 'danger', 'warning', etc.
const toastMessage = ref('');





function startDrawing(e: MouseEvent) {
  drawing.value = true;
  draw(e);
  sendDrawEvent(roomId.value, createEvent(e, 'start'));
}

function stopDrawing(e: MouseEvent) {
  drawing.value = false;
  ctx.value?.beginPath();
  sendDrawEvent(roomId.value, createEvent(e, 'end'));
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
  sendDrawEvent(roomId.value, createEvent(e, 'draw'));
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
  sendDrawEvent(roomId.value, {
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
  connectToRoom(roomId.value, handleRemoteDraw);
});

function copyClipboard() {
    toastMessage.value = "Code copied";
    toastType.value = "success"; 
   // Copy the text inside the text field
   showToast.value = true;
  navigator.clipboard.writeText(roomId.value);



}
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

  transition:
    opacity 3s,
    display 3s;

  transition-behavior: allow-discrete;
  @starting-style {
    opacity: 0;
  }
  
  /* background: #333; */
  background-image: linear-gradient(#FFF .1em, transparent .1em), linear-gradient(90deg, #FFF .1em, transparent .1em);

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

