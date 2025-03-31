<script lang="ts" setup>

import {computed} from "vue";

const props = defineProps({
  src: String,
  alt: {type: String, default: 'Превью'},
  height: {type: Number, default: 0},
  width: {type: Number, default: 0},
  nonStretch: {type: Boolean, default: 0},
  selection:{type:Object},
});

/**Стиль применяющийся к контейнеру preview*/
const previewContainerStyle = computed(() => ({
  width: props.selection?.width + 'px',
  height: props.selection?.height + 'px',
}));

/**Стиль применяющийся к изображению preview*/
const previewImageStyle = computed(() => ({
  width: props.width > 0 && !props.nonStretch ? props.width + 'px' : 'auto',
  maxWidth: props.width > 0 && props.nonStretch ? props.width + 'px' : 'auto',
  height: props.height > 0 && !props.nonStretch ? props.height + 'px' : 'auto',
  top: -props.selection?.y + 'px',
  left: -props.selection?.x + 'px',
}));


</script>

<template>
 <br> <label>Предпросмотр : </label>
  <div class="preview-container" :style="previewContainerStyle">
      <img ref="previewImage" :style="previewImageStyle" :src="props.src" class="preview-image" alt=""/>
  </div>

</template>

<style lang="scss" scoped>
.preview-container {
  overflow: hidden;
  position: relative;
}

.preview-image {
  position: absolute;

}
</style>