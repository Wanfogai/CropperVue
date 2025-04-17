<script setup lang="ts">
import {ref} from "vue";

const $image = ref<HTMLImageElement>();

const props = defineProps({
  src: {type:String, default:''}
})

</script>

<template>

  <img ref="$image" :src="props.src" alt="cropped image"/>
</template>


<style lang="css" scoped></style>