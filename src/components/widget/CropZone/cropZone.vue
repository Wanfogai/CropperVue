<script setup lang="ts">
import {computed, ref} from 'vue';
import DragAdrop from "@/components/ui/DragADrop/dragAdrop.vue";
import {Point} from "@/components/ui/Point";

const props = defineProps({

  x: {type: Number, required: true, default: 50},
  y: {type: Number, required: true, default: 50},

  width: {type: Number, required: true, default: 150},
  height: {type: Number, required: true, default: 100},

  containerWidth: {type: Number, required: true},
  containerHeight: {type: Number, required: true},

  overlayColor: {type: String, default: 'rgba(0, 0, 0, 0.5)'}
});

const handles = ref([
  { id: 'tl' }, { id: 'tm' }, { id: 'tr' },
  { id: 'ml' }, { id: 'mr' },
  { id: 'bl' }, { id: 'bm' }, { id: 'br' }
]);

const $cropContainer = ref<HTMLDivElement>();

const containerStyle = computed(() => ({
  position: 'absolute',

  top: 0,
  left: 0,

  width: `${props.containerWidth}px`,
  height: `${props.containerHeight}px`,

  overflow: 'hidden',
  pointerEvents: 'none',
}));

const cropperStyle = computed(() => {

  const maxDimension = Math.max(props.containerWidth, props.containerHeight);

  return {
    position: 'absolute',
    width: `${props.width}px`,
    height: `${props.height}px`,

    boxShadow: `0 0 0 ${maxDimension}px ${props.overlayColor}`,
    cursor: 'move',
    pointerEvents: 'auto',

    border: '1px dashed rgba(255, 255, 255, 0.7)',
    boxSizing: 'border-box',
  };
});

const getOffSetLeft = computed(() => {
  if ($cropContainer.value) {
    return $cropContainer.value.offsetLeft
  }
})

const getOffSetTop = computed(() => {
  if ($cropContainer.value) {
    return $cropContainer.value.offsetTop
  }
})

</script>

<template>
  <div ref="$cropContainer" :style="containerStyle" class="crop-zone-container">
    <drag-adrop :offset-left="getOffSetLeft" :offset-top="getOffSetTop">
      <div :style="cropperStyle" class="cropper-handle">
        <Point v-for="item in handles"  :handle-id="item.id" ></Point>
      </div>
    </drag-adrop>
  </div>

</template>

<style scoped>
</style>