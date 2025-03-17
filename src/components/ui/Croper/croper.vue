<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { SelectionModel } from './models';
import { CropData } from './interfaces';
import { MyInput } from '../MyInput';
import { watch } from 'fs';

/**Объект ref компонента Input для взаимодействия с ним*/
const $fileInput = ref<HTMLInputElement>();
/**Объект ref компонента Image для взаимодействия с ним*/
const $imageRef = ref<HTMLImageElement>();
/**Картинка в байтовом представлении для загрузки в компонент <img>*/
const imageSrc = ref<string>();
/**Blob дата обрезанного изображения для скачивания и предпросмотра*/
const croppedImage = ref<string>();

/**Объект выделения для отрисовки*/
const selection = ref<SelectionModel>(new SelectionModel(50, 50, 150, 150));

const preView = ref();

/**Стиль области выделения для перемещения и изменения размера*/
const selectionStyle = computed(() => ({
  left: selection.value.x + 'px',
  top: selection.value.y + 'px',
  width: selection.value.width + 'px',
  height: selection.value.height + 'px',
}))

const resizeHandles = ref([
  { position: 'top-left', direction: 'nw' },
  { position: 'top-right', direction: 'ne' },
  { position: 'bottom-left', direction: 'sw' },
  { position: 'bottom-right', direction: 'se' },
  { position: 'top', direction: 'n' },
  { position: 'bottom', direction: 's' },
  { position: 'left', direction: 'w' },
  { position: 'right', direction: 'e' },
]);

/** Загрузка изображения*/
const loadImage = (e) => {
  const file = e[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    imageSrc.value = e.target?.result as string;
    croppedImage.value = undefined;
  };
  reader.readAsDataURL(file);
};

const getCropData = (): { X: number; Y: number; Height: number; Width: number } => {
  return {
    X: selection.value.x,
    Y: selection.value.y,
    Height: selection.value.height,
    Width: selection.value.width,
  };
};

const PreImage = () => {
  if (!imageSrc.value || !$imageRef.value) return;

  const img = new Image();
  img.src = imageSrc.value;
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = selection.value.width;
    canvas.height = selection.value.height;
    const ctx = canvas.getContext('2d');

    if (ctx && $imageRef.value) {
      const scaleX = img.naturalWidth / $imageRef.value.width;
      const scaleY = img.naturalHeight / $imageRef.value.height;

      ctx.drawImage(
        img,
        selection.value.x * scaleX, selection.value.y * scaleY,
        selection.value.width * scaleX, selection.value.height * scaleY,
        0, 0, selection.value.width, selection.value.height
      );

      preView.value = canvas.toDataURL('image/png');
    }
  };
};

/** Функция обрезки изображения*/
async function cropImage(ImageData: string, SelectionData: CropData) {
  if (!ImageData || !SelectionData) throw new Error("Требуются вводные данные");
  //Данные отправляемые на сервер
  const toServer = {
    image: ImageData,
    crop: SelectionData,
  };
  //Отправка fetch запроса для получения обрезанного изображения
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
};

/** Функция для скачивания обрезанного изображения*/
const downloadImage = () => {
  if (!croppedImage.value) return;

  const link = document.createElement('a');
  link.href = croppedImage.value;
  link.download = 'cropped-image.png';
  link.click();
};

/**Ограничения выделения внутри изображения*/


/**Начало перемещения выделенной области*/
const startDrag = (event: MouseEvent) => {
  selection.value.dragging = true;
  selection.value.startX = event.clientX - selection.value.x;
  selection.value.startY = event.clientY - selection.value.y;
};

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
  document.removeEventListener('mousemove', moveSelection);
  document.removeEventListener('mousemove', resizeSelection);
  document.removeEventListener('mouseup', stopActions);
};

/** Начало изменения размера*/
const startResize = (event: MouseEvent, direction: string) => {
  selection.value.resizing = true;
  selection.value.resizeDirection = direction;
  selection.value.startX = event.clientX;
  selection.value.startY = event.clientY;
  selection.value.startWidth = selection.value.width;
  selection.value.startHeight = selection.value.height;
  document.addEventListener('mousemove', resizeSelection);
  document.addEventListener('mouseup', stopActions);
};


/** Изменение размера выделенной области*/
const resizeSelection = (event: MouseEvent) => {
  if (!selection.value.resizing || !$imageRef.value) return;

  const imgRect = $imageRef.value.getBoundingClientRect();
  const dx = event.clientX - (selection.value.startX ?? 0);
  const dy = event.clientY - (selection.value.startY ?? 0);

  if (selection.value.resizeDirection?.includes('e')) {
    selection.value.width = Math.min(imgRect.width - selection.value.x, (selection.value.startWidth ?? 0) + dx);
  }
  if (selection.value.resizeDirection?.includes('w')) {
    selection.value.x = Math.max(0, selection.value.x + dx);
    selection.value.width = Math.max(10, (selection.value.startWidth ?? 0) - dx);
  }
  if (selection.value.resizeDirection?.includes('s')) {
    selection.value.height = Math.min(imgRect.height - selection.value.y, (selection.value.startHeight ?? 0) + dy);
  }
  if (selection.value.resizeDirection?.includes('n')) {
    selection.value.y = Math.max(0, selection.value.y + dy);
    selection.value.height = Math.max(10, (selection.value.startHeight ?? 0) - dy);
  }
};



// Добавление обработчиков событий
onMounted(() => {
  document.addEventListener('mousemove', moveSelection);
  document.addEventListener('mousemove', resizeSelection);
  document.addEventListener('mouseup', stopActions);
});

// Удаление обработчиков при удалении компонента
onUnmounted(() => {
  document.removeEventListener('mousemove', moveSelection);
  document.removeEventListener('mousemove', resizeSelection);
  document.removeEventListener('mouseup', stopActions);
});

watch(selection, () => { })

defineExpose({ cropImage, croppedImage, imageSrc, getCropData })
</script>

<template>
  <MyInput ref="$fileInput" @load-image="loadImage" @files-dropped="loadImage"></MyInput>
  <br>
  <div v-if="imageSrc" class="image-container">
    <img ref="$imageRef" :src="imageSrc" class="image" />
    <div class="selection" :style="selectionStyle" @mousedown="startDrag">

      <div v-for="handle in resizeHandles" :key="handle.position" dropzone="Hello" class="resize-handle"
        :class="handle.position" @mousedown.stop="(e) => startResize(e, handle.direction)"></div>
    </div>
  </div>




  <button @click="cropImage(imageSrc, getCropData())" v-if="imageSrc">Обрезать</button>

  <div v-if="croppedImage">
    <h3>Обрезанное изображение:</h3>
    <img :src="preView" alt="Cropped Image" />
    <!-- <button @click="downloadImage">Скачать</button> -->
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
  border: 2px dashed red;
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