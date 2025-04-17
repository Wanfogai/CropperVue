<script lang="ts" setup>
import {Cropper} from "@/components/widget/Croper";
import {CustomInput} from "@/components";
import {ref, watch} from "vue";

const image = ref<string>('')

const files = ref<File[]>();

const loadImage = (e: File[]) => {
  const file = e[0];

  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    image.value = e.target?.result as string;

  };
  reader.readAsDataURL(file);
}

watch(files,() => {
  if (!files.value)return;
    loadImage(files.value);
})


const cancelCrop = () => {
  image.value = ''
  files.value = undefined;
}
</script>

<template>
  <CustomInput v-if="!image" v-model="files"></CustomInput>

  <!-- Параметры кропера
width,height - значения для фиксированного размера всех изображения(изображения будут растянуты до заданного размера)
max-width, max-height - ограничения размера изображения(если изображение не соответствует то выведется сообщение об ошибке )
-->
  <Cropper :image="image"></Cropper>
  <div v-if="image" class="control">
    <button>Обрезать</button>
    <button @click="cancelCrop">Отмена</button>
  </div>

</template>
