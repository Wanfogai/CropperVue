<script lang="ts" setup>

import {computed} from "vue";
import {SelectionModel} from "@/components";
import anymatch from "anymatch";

const props = defineProps({
  src: String,
  alt: {type: String, default: 'Превью'},
  selection:{type:Object},
})


const previewContainerStyle = computed(() => ({
  width: props.selection?.width+'px',
  height: props.selection?.height+'px'
}))


const previewImageStyle = computed(() => ({
  top: -props.selection?.y + 'px',
  left: -props.selection?.x + 'px',
}))
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
  /* Позиционируем изображение так, чтобы обрезать нужную область */
  left: 0;
  top: 0;
}
</style>