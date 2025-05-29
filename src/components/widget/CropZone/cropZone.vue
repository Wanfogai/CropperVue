<script setup lang="ts">
import {computed, onBeforeUnmount, ref, watch} from 'vue';
import {Point} from "@/components/ui/Point";
import {HandleMouseDownPayload, HandlePosition} from "@/components/ui/Point/models/PointModel";

const props = defineProps<{
  width: number
  height: number
  containerWidth: number
  containerHeight: number
  overlayColor?: string
  x?: number
  y?: number
  pointSize?: number
  pointColor?: string
  pointBorderColor?: string
  pointHoverColor?: string
  pointActiveColor?: string
}>()

/** Цвет наложения*/
const overlayColor = computed(() => props.overlayColor ?? 'rgba(0, 0, 0, 0.5)')

/**Массив позиций точек изменения размера*/
const handles: HandlePosition[] = ['tl', 'tm', 'tr', 'ml', 'mr', 'bl', 'bm', 'br']

//Переменные позиции зоны кропера
const cropperX = ref(props.x ?? 0)
const cropperY = ref(props.y ?? 0)

// Текущие размеры зоны выделения
const cropperWidth = ref(props.width)
const cropperHeight = ref(props.height)

// Отслеживание изменений props x и y
watch(() => props.x, (newX) => {
  if (newX !== undefined) {
    cropperX.value = newX
  }
})

watch(() => props.y, (newY) => {
  if (newY !== undefined) {
    cropperY.value = newY
  }
})

// Флаг активного перетаскивания
const isDragging = ref(false)

// Тип текущего действия (перемещение или изменение размера за определенный Point)
const dragType = ref<'move' | typeof handles[number] | null>(null)

// Начальные координаты мыши при старте перетаскивания
const startX = ref(0)
const startY = ref(0)

// Начальные позиции области выделения при старте перетаскивания
const startLeft = ref(0)
const startTop = ref(0)

// Начальные размеры области выделения при старте изменения размера
const startWidth = ref(0)
const startHeight = ref(0)

// Стили для контейнера кропа
const containerStyle = computed((): Partial<CSSStyleDeclaration> => ({
  position: 'absolute',
  top: '0px',
  left: '0px',
  width: `${props.containerWidth}px`,
  height: `${props.containerHeight}px`,
  overflow: 'hidden',
  pointerEvents: 'none'
}))

// Стили для области выделения
const cropperStyle = computed((): Partial<CSSStyleDeclaration> => ({
  position: 'absolute',
  left: `${cropperX.value}px`,
  top: `${cropperY.value}px`,
  width: `${cropperWidth.value}px`,
  height: `${cropperHeight.value}px`,
  boxShadow: `0 0 0 ${Math.max(props.containerWidth, props.containerHeight)}px ${overlayColor.value}`,
  border: '1px dashed rgba(255, 255, 255, 0.7)',
  cursor: 'move',
  pointerEvents: 'auto',
  boxSizing: 'border-box'
}))

const getCropData = (magnificRate: number): { X: number; Y: number; Height: number; Width: number } => {
  return {
    X: cropperX.value / magnificRate,
    Y: cropperY.value / magnificRate,
    Height: cropperHeight.value / magnificRate,
    Width: cropperWidth.value / magnificRate,
  };
}


/**Обработчик события mousedown на области выделения для начала операции перемещения*/
function onMouseDownCropper(event: MouseEvent) {
  isDragging.value = true
  dragType.value = 'move'
  startX.value = event.clientX
  startY.value = event.clientY
  startLeft.value = cropperX.value
  startTop.value = cropperY.value
  attachListeners()
}

/** Обработчик события mousedown на точках изменения размера*/
function onHandleMouseDown(payload: HandleMouseDownPayload) {
  isDragging.value = true
  dragType.value = payload.handleId
  startX.value = payload.originalEvent.clientX
  startY.value = payload.originalEvent.clientY
  startLeft.value = cropperX.value
  startTop.value = cropperY.value
  startWidth.value = cropperWidth.value
  startHeight.value = cropperHeight.value
  attachListeners()
}

/** Добавляет слушатели событий mousemove и mouseup к окну*/
function attachListeners() {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

/**
 * Обработчик события mousemove во время операций перетаскивания
 * Обновляет позицию области выделения при перемещении или размеры при изменении размера
 */
function onMouseMove(event: MouseEvent) {
  if (!isDragging.value || !dragType.value) return
  const dx = event.clientX - startX.value
  const dy = event.clientY - startY.value

  if (dragType.value === 'move') {
    cropperX.value = Math.min(
        Math.max(startLeft.value + dx, 0),
        props.containerWidth - cropperWidth.value
    )
    cropperY.value = Math.min(
        Math.max(startTop.value + dy, 0),
        props.containerHeight - cropperHeight.value
    )
  } else {
    // Изменение размера в зависимости от направления точки
    let newX = startLeft.value
    let newY = startTop.value
    let newW = startWidth.value
    let newH = startHeight.value

    if (dragType.value.includes('l')) {
      newW = startWidth.value - dx
      newX = startLeft.value + dx
    }
    if (dragType.value.includes('r')) {
      newW = startWidth.value + dx
    }
    if (dragType.value.includes('t')) {
      newH = startHeight.value - dy
      newY = startTop.value + dy
    }
    if (dragType.value.includes('b')) {
      newH = startHeight.value + dy
    }

    // Ограничение значений
    cropperX.value = Math.max(0, Math.min(newX, props.containerWidth))
    cropperY.value = Math.max(0, Math.min(newY, props.containerHeight))
    cropperWidth.value = Math.max(20, Math.min(newW, props.containerWidth - cropperX.value))
    cropperHeight.value = Math.max(20, Math.min(newH, props.containerHeight - cropperY.value))
  }
}

/**
 * Обработчик события mouseup для завершения операций перетаскивания
 * Удаляет слушатели событий и сбрасывает состояние перетаскивания
 */
function onMouseUp() {
  isDragging.value = false
  dragType.value = null
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
}

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
})

defineExpose({
  getCropData,
})
</script>

<template>
  <div :style="containerStyle" class="crop-zone-container">
    <div :style="cropperStyle" class="cropper-handle" @mousedown.prevent="onMouseDownCropper">
      <Point
          v-for="handleId in handles"
          :key="handleId"
          :active-color="props.pointActiveColor"
          :border-color="props.pointBorderColor"
          :color="props.pointColor"
          :handle-id="handleId"
          :hover-color="props.pointHoverColor"
          :size="props.pointSize"
          @handleMouseDown="onHandleMouseDown"
      />
    </div>
  </div>
</template>

<style scoped>
.crop-zone-container {
  position: relative;
}
</style>