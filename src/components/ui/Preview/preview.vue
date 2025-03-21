<script lang="ts" setup>

import {computed} from "vue";


const props = defineProps({
  src: String,
  alt: {type: String, default: 'Превью'},
  selection:{type:Object},
  zoom:{type: Number,default:1},
});


const previewContainerStyle = computed(() => ({
  width: (props.selection?.width / props.zoom) + 'px',
  height: (props.selection?.height / props.zoom) + 'px',
}));

console.log(props.selection?.height )

const previewImageStyle = computed(() => ({
  top: -props.selection?.y /  props.zoom + 'px',
  left: -props.selection?.x /  props.zoom + 'px',
}));
</script>

<template>
 <br> <label>Предпросмотр : </label>
  <div class="preview-container" :style="previewContainerStyle">
    <img ref="previewImage" :style="previewImageStyle" :src="props.src" class="preview-image"/>
  </div>

</template>

<style lang="scss" scoped>
.preview-container {
  overflow: hidden;
  position: relative;
}

.preview-image {
  position: absolute;

  left: 0;
  top: 0;
}
</style>