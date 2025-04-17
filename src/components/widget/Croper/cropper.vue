<script setup lang="ts">
import {CropZone} from "@/components/widget/CropZone";
import {computed, ref} from "vue";

const props = defineProps({
  image: {type: String, default: ''},
})

const cropperX = ref(50);
const cropperY = ref(50);

const cropperWidth = ref(150);
const cropperHeight = ref(100);

const imageWidth = ref(500);
const imageHeight = ref(400);

const imageContainerStyle = computed(() => ({
  position: "relative",
  width: imageWidth + "px",
  height: imageHeight + "px",
}))

const onImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  imageWidth.value = img.naturalWidth;
  imageHeight.value = img.height;
}


</script>

<template>
  <div>
    <div v-if="image" :style="imageContainerStyle" class="image-container">
      <img :src="image" alt="Image to crop" style="display: block; max-width: 100%;"
           @load="onImageLoad">
      <CropZone
          :container-height="imageHeight"
          :container-width="imageWidth"
          :height="cropperHeight"
          :width="cropperWidth"
          :x="cropperX"
          :y="cropperY"
          overlay-color="rgba(0, 20, 50, 0.6)"
      />
    </div>
  </div>
</template>

<style scoped lang="css">
</style>