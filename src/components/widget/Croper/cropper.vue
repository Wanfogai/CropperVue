<script setup lang="ts">
import {CropZone} from "@/components/widget/CropZone";
import {computed, ref} from "vue";
import {CropData} from "@/app/interfaces";

const model = defineModel();

const $cropZone = ref(null);

const props = defineProps({
  image: {type: String, default: ''},
  pointSize: {type: Number, default: 10},
  pointColor: {type: String, default: 'rgba(255, 255, 255, 0.9)'},
  pointBorderColor: {type: String, default: 'rgba(51, 51, 51, 0.9)'},
  pointHoverColor: {type: String, default: 'rgba(255, 255, 255, 1)'},
  pointActiveColor: {type: String, default: 'rgba(0, 120, 215, 1)'},
  magnificRate: {type: Number, default: 1}
})

// Начальные координаты области выделения
const cropperX = ref(50);
const cropperY = ref(50);

// Начальные размеры области выделения
const cropperWidth = ref(150);
const cropperHeight = ref(100);

// Размеры изображения 
const imageWidth = ref(500);
const imageHeight = ref(400);

/** Стили для контейнера изображения*/
const imageContainerStyle = computed(() => ({
  position: "relative",
  width: imageWidth.value + "px",
  height: imageHeight.value + "px",
}))

/** Функция обрезки изображения*/
async function cropImage(ImageData: string) {
  if (!ImageData) throw new Error("Требуются вводные данные");
  //Данные, отправляемые на сервер
  const toServer = {
    image: ImageData,
    crop: $cropZone.value?.getCropData(props.magnificRate) as CropData,
  };

  /***Отправка fetch запроса для получения обрезанного изображения*/
  const response = await fetch("/api/crop", {
    method: "POST",
    body: JSON.stringify(toServer),
    headers: { "Content-Type": "application/json" },
  });

  //Ошибка при подключении к серверу или обрезки изображения
  if (!response.ok) {
    throw new Error("Ошибка при обрезке изображения");
  }

  const result = await response.json();

  model.value = result.croppedImage;
  return result;
}

/**
 * Обработчик загрузки изображения
 * Устанавливает реальные размеры изображения с учетом коэффициента увеличения
 */
const onImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  imageWidth.value = img.naturalWidth * props.magnificRate;
  imageHeight.value = img.naturalHeight * props.magnificRate;
}

/** Стили для изображения*/
const imageStyle = computed(() => ({
  display: "block",
  maxWith: imageWidth.value + "px",
  height: imageHeight.value + "px",
}))

defineExpose({
  cropImage
})
</script>

<template>
  <div>
    <div v-if="image" :style="imageContainerStyle" class="image-container">
      <img :src="image" :style=imageStyle alt="Image to crop"
           @load="onImageLoad">
      <CropZone ref="$cropZone"
          :container-height="imageHeight"
          :container-width="imageWidth"
          :height="cropperHeight"
          :width="cropperWidth"
          :x="cropperX"
          :y="cropperY"
          :point-size="props.pointSize"
          overlay-color="rgba(0, 20, 50, 0.6)"
      />
    </div>
  </div>
</template>

<style scoped lang="css">
.image-container {
  user-select: none;
}
</style>
