<script setup lang="ts">
import {ImageView} from "@/components/ui/ImageView";
import {CropZone} from "@/components/widget/CropZone";

const props = defineProps({
  image: {type: String, default: ''},
})


</script>

<template>
  <div class="crop">
    <div class="container">
      <CropZone class="crop-zone"/>
      <ImageView v-if="image!=''" :src="image"/>
    </div>
  </div>
</template>

<style scoped lang="css">
.crop-zone {
  background: rgba(0, 0, 0, 0.5);
}
.crop {
  width: fit-content;
  height: fit-content;
}
</style>