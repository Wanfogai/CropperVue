<script lang="ts" setup>
import {computed, ref} from 'vue';
import {PositionModel} from './models/PositionModel';

/**HTML элемент DragWrap */
const $dragWraper = ref<HTMLDivElement>()

/**Стиль курсора при перетаскивании*/
const cursorStyle = ref<HTMLStyleElement>()

/**Позиция карты относительно страницы */
const screenPos = ref<PositionModel>()

const props = defineProps({
  canDrag: {
    type: Boolean, default: true
  },
})

//Переменные расчета начальной точки перемещения
const offsetX = ref()
const offsetY = ref()

/**Проверка идет ли перетаскивание*/
const isDrag = computed(() => {
  emit('drag', !!$dragWraper.value)

  return !!$dragWraper.value
})

const emit = defineEmits<{
  drag: [isDrag: boolean],
  drop: []
}>()

/**При нажатии лкм */
const onMouseDragDowm = (event: MouseEvent) => {
  if (!props.canDrag) return
  //Расчитывание позиции элемента относительно страницы
  if (!$dragWraper.value) return
  screenPos.value = new PositionModel($dragWraper.value.getBoundingClientRect());

  $dragWraper.value.classList.add('dragging');

  //Задание начальной позиции
  if (!screenPos.value) return
  offsetX.value = event.clientX - screenPos.value.x;
  offsetY.value = event.clientY - screenPos.value.y;

  //Перемещение на начальную позицию
  if (!$dragWraper.value) return
  $dragWraper.value.style.left = `${event.clientX - offsetX.value}px`
  $dragWraper.value.style.top = `${event.clientY - offsetY.value}px`

  //Задание стиля курсора (сжатый кулак)
  cursorStyle.value = document.createElement('style')
  cursorStyle.value.innerHTML = '*{cursor: grabbing!important;}'
  cursorStyle.value.id = "cursorStyle"

  //Добавление клона на страницу и присваивание ему эвентов
  document.head.appendChild(cursorStyle.value);
  document.addEventListener('mouseup', onMouseDragUp)
  document.addEventListener('mousemove', onMouseDragMove)

}

const onMouseDragUp = (event: MouseEvent) => {

  //Удаление класса "пустой" у оригинала
  if (!$dragWraper.value) return
  $dragWraper.value.classList.remove("empty")

  //Удаление стиля курсора
  cursorStyle.value?.remove();

  //Удаление евентов
  document.removeEventListener('mouseup', onMouseDragUp)
  document.removeEventListener('mousemove', onMouseDragMove)

}

/**Перемещение*/
const onMouseDragMove = (event: MouseEvent) => {
  if (!$dragWraper.value) return
  $dragWraper.value.style.left = `${event.clientX - offsetX.value}px`
  $dragWraper.value.style.top = `${event.clientY - offsetY.value}px`
}

</script>

<template>
  <div ref="$dragWraper" class="drag-zone" @mousedown="onMouseDragDowm" @mouseup="emit('drop')">
    <slot/>
  </div>
</template>

<style lang="scss" scoped>

.drag-zone {
  position: absolute;
  cursor: grab;
  outline: none;
  user-select: none;
}
</style>

<style lang="scss">
.dragging {
  pointer-events: none;
  z-index: 100000;
}
</style>