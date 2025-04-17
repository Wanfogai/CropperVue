// Point.vue


<script setup lang="ts">
import { computed } from 'vue';

// --- Входные параметры ---
const props = defineProps({
  // Уникальный идентификатор точки (например, 'tl', 'tm', 'br' и т.д.)
  handleId: {
    type: String,
    required: true,
    validator: (value) => ['tl', 'tm', 'tr', 'ml', 'mr', 'bl', 'bm', 'br'].includes(value)
  }
});

// --- События, которые компонент может отправлять родителю ---
const emit = defineEmits(['handleMouseDown']); // Определяем событие

// --- Вычисляемые свойства ---
// Определяем класс для CSS и курсора на основе handleId
const pointClass = computed(() => `handle-${props.handleId}`);

// --- Методы ---
const onMouseDown = (event:MouseEvent) => {
  // При нажатии мыши отправляем событие 'handleMouseDown' родителю
  // Передаем объект с оригинальным событием мыши и ID точки
  emit('handleMouseDown', { originalEvent: event, handleId: props.handleId });
};

</script>

<template>
  <div
      class="resize-point"
      :class="pointClass"
      @mousedown.stop.prevent="onMouseDown"
      draggable="false"
  >
  </div>
</template>

<style scoped>
.resize-point {
  position: absolute; /* Позиционирование будет задаваться родителем через :style */
  width: 10px; /* Размер точки */
  height: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(51, 51, 51, 0.9);
  box-sizing: border-box;
  /* Предотвращение выделения */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Динамические классы для курсоров */
.handle-tl, .handle-br { cursor: nwse-resize; } /* / \ */
.handle-tr, .handle-bl { cursor: nesw-resize; } /* \ / */
.handle-tm, .handle-bm { cursor: ns-resize; }  /* | */
.handle-ml, .handle-mr { cursor: ew-resize; }  /* - */
</style>