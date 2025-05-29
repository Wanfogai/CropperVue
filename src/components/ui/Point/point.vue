<script setup lang="ts">
import {computed} from 'vue'
import {HandleMouseDownPayload, HandlePosition} from './models/PointModel'

// Определение события для передачи в родительский компонент 
const emit = defineEmits<{
  (e: 'handleMouseDown', payload: HandleMouseDownPayload): void
}>()

// Определение входных свойств компонента
const props = defineProps<{
  handleId: HandlePosition
  size?: number
  color?: string
  borderColor?: string
  hoverColor?: string
  activeColor?: string
}>()

// Значения по умолчанию для необязательных свойств
const pointSize = computed(() => props.size ?? 10)
const pointColor = computed(() => props.color ?? 'rgba(255, 255, 255, 0.9)')

// Обработчик события нажатия мыши
const onMouseDown = (event: MouseEvent) => {
  emit('handleMouseDown', {originalEvent: event, handleId: props.handleId})
}

// Вычисление стилей позиционирования точки
const positionStyle = computed(() => {
  const halfSize = pointSize.value / 2
  const offset = -halfSize + 'px'

  // Карта позиций для каждой точки
  const map: Record<HandlePosition, Partial<CSSStyleDeclaration>> = {
    tl: {top: offset, left: offset},
    tm: {top: offset, left: '50%', transform: 'translateX(-50%)'},
    tr: {top: offset, right: offset},

    ml: {top: '50%', left: offset, transform: 'translateY(-50%)'},
    mr: {top: '50%', right: offset, transform: 'translateY(-50%)'},

    bl: {bottom: offset, left: offset},
    bm: {bottom: offset, left: '50%', transform: 'translateX(-50%)'},
    br: {bottom: offset, right: offset}
  }

  return map[props.handleId] || {}
})

// Задание базовых стилей точки
const pointStyle = computed(() => ({
  width: `${pointSize.value}px`,
  height: `${pointSize.value}px`,
  backgroundColor: pointColor.value,
}))
</script>

<template>
  <div
      class="resize-point"
      :class="`handle-${handleId}`"
      :style="[positionStyle, pointStyle]"
      @mousedown.stop.prevent="onMouseDown"
      draggable="false"
  />
</template>

<style scoped>
.resize-point {
  position: absolute;
  border: 1px solid;
  border-radius: 50%;
  box-sizing: border-box;
  user-select: none;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  z-index: 10;
}

.resize-point:hover {
  transform: scale(1.2);
}

.resize-point:active {
  transform: scale(1.3);
}

/* Стили курсора для разных направлений */
.handle-tl, .handle-br {
  cursor: nwse-resize;
}

.handle-tr, .handle-bl {
  cursor: nesw-resize;
}

.handle-tm, .handle-bm {
  cursor: ns-resize;
}

.handle-ml, .handle-mr {
  cursor: ew-resize;
}
</style>