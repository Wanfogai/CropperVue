<script lang="ts" setup>
import {Cropper} from "@/components/widget/Croper";
import {CustomInput} from "@/components";
import {ref, watch} from "vue";

/**Переменная, хранящая обрабатываемое изображение*/
const image = ref<string>('')

const $cropper = ref<null>();

const croppedImage = ref<string>('')

/**Переменная, содержащая значение множителя увеличения изображения*/
const magnific = ref<number>(0)

/**Переменная, хранящая файл изображения*/
const files = ref<File[]>();

/**Функция загрузки изображения из файла*/
const loadImage = (e: File[]) => {
  const file = e[0];
  const reader = new FileReader();

  reader.onload = (e: ProgressEvent<FileReader>) => image.value = e.target?.result as string;
  reader.readAsDataURL(file);
}

/**Наблюдатель, следящий за изменением состояния переменной files для загрузки изображения*/
watch(files,() => {
  if (!files.value)return;
    loadImage(files.value);
})

/**Функция отмены обрезки изображения (возвращает всё к 0)*/
const cancelCrop = () => {
  image.value = ''
  files.value = undefined;
}

const CroppButtonClick = () => {
  $cropper.value?.cropImage(image.value)

  if (!croppedImage.value) return;

  const link = document.createElement('a');
  link.href = croppedImage.value;
  link.download = 'cropped-image.png';
  link.click();
}
</script>

<template>
  <CustomInput v-if="!image" v-model="files"></CustomInput>
  <div v-if="!image" class="magnificSetting">
    <br>
    Значение множителя ({{ magnific }}) :
    <input v-model="magnific"
           max="8" step="2"
           type="range">
  </div>
  <Cropper ref="$cropper" :image="image" v-model="croppedImage"
           :magnificRate="magnific>0?magnific:1"></Cropper>
  <div v-if="image" class="control">
    <button @click="CroppButtonClick">Обрезать</button>
    <button @click="cancelCrop">Отмена</button>
  </div>
</template>
