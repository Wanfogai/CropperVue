<script lang="ts" setup>
import { Croper } from '@/components';
import { ref } from 'vue';
import { store } from './store';

/**Объект кропера для взаимодействия с ним и использования встроенных функций*/
const $croper = ref();

/**Скачивание изображения*/
const downloadImage = () => {
    const link = document.createElement('a');
    link.href = store.croppedImage;
    link.download = 'cropped-image.png';
    link.click();
};
</script>

<template>
    <Croper ref="$croper"></Croper>

    <input type="file" @change="$croper.loadImage" accept="image/png, image/gif, image/jpeg" />
    <button v-if="store.image.src != ''" @click="$croper.cropImage">Обрезать</button>

    <div v-if="store.croppedImage">
        <h3>Обрезанное изображение:</h3>
        <img :src="store.croppedImage" alt="Cropped Image" />
        <br>
        <button v-if="store.croppedImage" @click="downloadImage">Скачать</button>
    </div>
</template>
