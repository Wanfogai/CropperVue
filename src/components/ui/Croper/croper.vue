<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {SelectionModel} from './models';
import {CropData} from './interfaces';
import {MyInput} from '../MyInput';
import {Preview} from "@/components";

const props = defineProps({
  width: {type: Number, default: 0},
  height: {type: Number, default: 0},
  maxWidth: {type: Number, default: 0},
  maxHeight: {type: Number, default: 0},
})

/**Объект ref компонента Input для взаимодействия с ним*/
const $fileInput = ref<HTMLInputElement>();
/**Объект ref компонента Image для взаимодействия с ним*/
const $imageRef = ref<HTMLImageElement>();
/**Картинка в байтовом представлении для загрузки в компонент <img>*/
const imageSrc = ref<string>();
/**Blob дата обрезанного изображения для скачивания и предпросмотра*/
const croppedImage = ref<string>();

/**Объект выделения для отрисовки*/
const selection = ref<SelectionModel>(new SelectionModel(0, 0, 50, 50));


/**Стиль изменения размера изображения в зависимости от настроек если включен nonStretch применяется к контейнеру, а не к фото*/
const imageStyle = computed(() => ({
  width: (props.width > 0 ? props.width + 'px' : 'auto') ,
  height: (props.height > 0 ? props.height + 'px' : 'auto'),
  maxWidth: props.width + 'px',
}))

/**Стиль области выделения для перемещения и изменения размера*/
const selectionStyle = computed(() => ({
  left: selection.value.x + 'px',
  top: selection.value.y + 'px',
  width: selection.value.width + 'px',
  height: selection.value.height + 'px',
}))

/**Направления ресайза для рендера*/
const resizeHandles = ref([
  { position: 'top-left', direction: 'nw' },
  { position: 'top-right', direction: 'ne' },
  { position: 'bottom-left', direction: 'sw' },
  { position: 'bottom-right', direction: 'se' },
  { position: 'top', direction: 'n' },
  { position: 'bottom', direction: 's' },
  { position: 'left', direction: 'w' },
  { position: 'right', direction: 'e' },
])

/** Загрузка изображения*/
const loadImage = (e: object) => {
  const file = (e as File[])[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    imageSrc.value = e.target?.result as string;
    croppedImage.value = undefined;
  };
  reader.readAsDataURL(file);
}

/**Получение данных кропа для передачи на сервер*/
const getCropData = (): { X: number; Y: number; Height: number; Width: number } => {
  return {
    X: selection.value.x,
    Y: selection.value.y,
    Height: selection.value.height,
    Width: selection.value.width,
  };
}

/** Функция обрезки изображения*/
async function cropImage(ImageData: string, SelectionData: CropData) {
  if (!ImageData || !SelectionData) throw new Error("Требуются вводные данные");
  //Данные отправляемые на сервер
  const toServer = {
    image: ImageData,
    crop: SelectionData,
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

  croppedImage.value = result.croppedImage;
  return response.json();
}

/** Функция для скачивания обрезанного изображения*/
const downloadImage = () => {
  if (!croppedImage.value) return;

  const link = document.createElement('a');
  link.href = croppedImage.value;
  link.download = 'cropped-image.png';
  link.click();
}

/**Начало перемещения выделенной области*/
const startDrag = (event: MouseEvent) => {
  selection.value.dragging = true;
  selection.value.startX = event.clientX - selection.value.x;
  selection.value.startY = event.clientY - selection.value.y;
}

/** Перемещение выделенной области*/
const moveSelection = (event: MouseEvent) => {
  if (!selection.value.dragging || !$imageRef.value) return;

  const imgRect = $imageRef.value.getBoundingClientRect();
  selection.value.x = Math.max(0, Math.min(event.clientX - (selection.value.startX ?? 0), imgRect.width - selection.value.width));
  selection.value.y = Math.max(0, Math.min(event.clientY - (selection.value.startY ?? 0), imgRect.height - selection.value.height));
};

/** Остановка действий (перемещения и изменения размера)*/
const stopActions = () => {
  selection.value.dragging = false;
  selection.value.resizing = false;
}

/**функция отмены кропа перехода к выбору файла*/
const cancaleCrop = () => {
  imageSrc.value = '';
  selection.value = new SelectionModel(0, 0, 50, 50);
}

/** Начало изменения размера*/
const startResize = (event: MouseEvent, direction: string) => {
  selection.value.resizing = true;
  selection.value.resizeDirection = direction;
  selection.value.startX = selection.value.x;
  selection.value.startY = selection.value.y;
  selection.value.startWidth = selection.value.width;
  selection.value.startHeight = selection.value.height;
  document.addEventListener('mousemove', resizeSelection);
  document.addEventListener('mouseup', stopActions);
}

/**Функция ресайза кропера*/
const resizeSelection = (event: MouseEvent) => {
  if (!selection.value.resizing || !$imageRef.value) return;

  const imgRect = $imageRef.value.getBoundingClientRect();
  const mouseX = event.clientX - imgRect.left;
  const mouseY = event.clientY - imgRect.top;

  const dx = mouseX - (selection.value.startX ?? 0);
  const dy = mouseY - (selection.value.startY ?? 0);

  let newX = selection.value.x;
  let newY = selection.value.y;
  let newWidth = selection.value.startWidth ?? 0;
  let newHeight = selection.value.startHeight ?? 0;

  if (selection.value.resizeDirection?.includes('e')) {
    newWidth = Math.max(10, mouseX - newX);
  }

  if (selection.value.resizeDirection?.includes('w')) {
    newWidth = Math.max(10, (selection.value.startWidth ?? 0) - dx);
    newX = (selection.value.startX ?? 0) + dx;
  }

  if (selection.value.resizeDirection?.includes('s')) {
    newHeight = Math.max(10, mouseY - newY);
  }

  if (selection.value.resizeDirection?.includes('n')) {
    newHeight = Math.max(10, (selection.value.startHeight ?? 0) - dy);
    newY = (selection.value.startY ?? 0) + dy;
  }

  // Ограничения, чтобы выделение не выходило за пределы изображения
  newX = Math.max(0, Math.min(newX, imgRect.width - newWidth));
  newY = Math.max(0, Math.min(newY, imgRect.height - newHeight));
  newWidth = Math.min(newWidth, imgRect.width - newX);
  newHeight = Math.min(newHeight, imgRect.height - newY);

  // Применяем новые значения
  selection.value.x = newX;
  selection.value.y = newY;
  selection.value.width = newWidth;
  selection.value.height = newHeight;
}

///Наблюдатель для предотвращения рендера изображений превышающих ограничения и вывода сообщения об ошибке
watch($imageRef, () => {
  if (imageSrc.value == '') return
  if (($imageRef.value!.height > props.maxHeight || $imageRef.value!.width > props.maxWidth) && (props.maxHeight > 0 && props.maxWidth > 0)) {
    imageSrc.value = '';
    alert(`Изображение слишком большое, оно не должно превышать ограничения :  Ширина:${props.maxWidth}, Длинна:${props.maxHeight}`)
  }
})

// Добавление обработчиков событий
onMounted(() => {
  document.addEventListener('mousemove', moveSelection);
  document.addEventListener('mousemove', resizeSelection);
  document.addEventListener('mouseup', stopActions);
})

// Удаление обработчиков при удалении компонента
onUnmounted(() => {
  document.removeEventListener('mousemove', moveSelection);
  document.removeEventListener('mousemove', resizeSelection);
  document.removeEventListener('mouseup', stopActions);
})


defineExpose({cropImage, croppedImage, imageSrc, getCropData, selection});
</script>

<template>
  <MyInput v-if="!imageSrc" ref="$fileInput" @load-image="loadImage" @files-dropped="loadImage"></MyInput>
  <br>
  <div v-if="imageSrc" class="image-container" :style="props.nonStretch? imageStyle:''">
    <img ref="$imageRef" :style="!props.nonStretch? imageStyle:''" :src="imageSrc" class="image"/>
    <div class="selection" :style="selectionStyle" @mousedown="startDrag">
      <div v-for="handle in resizeHandles" :key="handle.position" class="resize-handle"
        :class="handle.position" @mousedown.stop="(e) => startResize(e, handle.direction)"></div>
    </div>
  </div>

  <Preview v-if="imageSrc" :src="imageSrc"
           :max-width="props.maxWidth" :max-height="props.maxHeight"
           :height="props.height" :width="props.width"
           alt="Превью" :selection="selection"
            :non-stretch="props.nonStretch"
  ></Preview>

  <div class="control">
    <button @click="cancaleCrop" v-if="imageSrc">Отменить</button>
    <button @click="cropImage(imageSrc, getCropData())" v-if="imageSrc">Обрезать</button>
  </div>
</template>

<style scoped>

.image-container {
  user-select: none;
  position: relative;
  display: inline-block;
}

.image {
  max-width: 100%;
  height: auto;
}

.selection {
  position: absolute;
  border: 1px dashed red;
  cursor: move;
}

.resize-handle {
  width: 10px;
  height: 10px;
  background: blue;
  position: absolute;
}

.top-left {
  top: -5px;
  left: -5px;
  cursor: nw-resize;
}

.top-right {
  top: -5px;
  right: -5px;
  cursor: ne-resize;
}

.bottom-left {
  bottom: -5px;
  left: -5px;
  cursor: sw-resize;
}

.bottom-right {
  bottom: -5px;
  right: -5px;
  cursor: se-resize;
}

.top {
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  cursor: n-resize;
}

.bottom {
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  cursor: s-resize;
}

.left {
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
  cursor: w-resize;
}

.right {
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
  cursor: e-resize;
}
</style>