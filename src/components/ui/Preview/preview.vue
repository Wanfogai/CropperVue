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


const previewContainerStyle = computed(() => ({
  width: props.selection?.width + 'px',
  height: props.selection?.height + 'px',
}));

const previewImageStyle = computed(() => ({
  width: props.width > 0 && props.nonStretch ? props.width + 'px' : 'auto',
  height: props.height > 0 && props.nonStretch ? props.height + 'px' : 'auto',
  top: -props.selection?.y + 'px',
  left: -props.selection?.x + 'px',
}));

const previewStyle = computed(() => ({
  width:  props.width + 'px',
  height:  props.height + 'px' ,
}))
</script>

<template>
 <br> <label>Предпросмотр : </label>
  <div class="preview-container" :style="previewContainerStyle">
    <div class="preview-image" :style="props.nonStretch?previewStyle:''" >
      <img ref="previewImage" :style="previewImageStyle" :src="props.src" class="preview-image" alt=""/>
    </div>
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