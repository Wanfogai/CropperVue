<script lang="ts" setup>
import { store } from '@/app/store';
import { ref, onMounted, nextTick, onUnmounted } from 'vue';
import SelectionModel from './models/SelectionModel';

//Пропсы :
//Ограничения размера изображения
const props = defineProps({
    limination_width: { type: Number, default: 0 },
    limitation_height: { type: Number, default: 0 }
});

/**Высвобождение переменных ограничения для облегченного использования */
const { limination_width, limitation_height } = props;  

/**Ref компонент канваса для взаимодействия с ним */
const $canvas = ref<HTMLCanvasElement>();

/**Объект Context 2d для отрисовки */
const ctx = ref();

/**Параметры выделенной области*/
const selection = ref<SelectionModel>(new SelectionModel(50, 50, 75, 75, false, false));

/**Загрузка изображения
 *  Подключаеться к компоненту Input через  @change
*/
const loadImage = (event: Event) => {

    const input = (event.target as HTMLInputElement);
    if (!input.files) return;
    const file = input.files[0];

    //Проверка не пустой ли файл и существует ли изображение
    if (store.image.src = "") return;

    /**Ридер для файла изображения */
    const reader = new FileReader();

    reader.onload = (e) => {
        store.image = new Image();
        if (e.target?.result) store.image.src = e.target.result.toString();
        store.image.onload = () => {
            //Проверка  заданы ли ограничения и соответствует ли им изображение 
            if (limination_width > 0 && store.image.width > limination_width || limitation_height > 0 && store.image.height > limitation_height) {
                alert("Изображение слишком большое");
                store.image = new Image();
                input.value = '';
            }
            else {
                $canvas.value!.width = store.image?.width;
                $canvas.value!.height = store.image?.height
                console.log(`w:${store.image?.width}\nh:${store.image?.height}`)
                drawCanvas()
            }
        };
    };

    reader.readAsDataURL(file);
};

/**Отрисовка на canvas*/
const drawCanvas = () => {
    if (!$canvas.value || !store.image) return;
    ctx.value = $canvas.value.getContext('2d');
    ctx.value.clearRect(0, 0, $canvas.value.width, $canvas.value.height);

    // Отрисовка изображения
    ctx.value.drawImage(store.image, 0, 0, $canvas.value.width, $canvas.value.height);

    // Рисуем облатсть кропера
    ctx.value.strokeStyle = 'red';
    ctx.value.lineWidth = 2;
    ctx.value.strokeRect(selection.value.x, selection.value.y, selection.value.width, selection.value.height);

    // Рисуем квадрат для маштабирования
    const handleSize = 10;
    ctx.value.fillStyle = 'blue';
    ctx.value.fillRect(selection.value.x + selection.value.width - handleSize / 2, selection.value.y + selection.value.height - handleSize / 2, handleSize, handleSize);
};

/**Обрезка изображения
 * Подключаеться к кнопке или друкому компоненту выполняющий функцию "Обрезать"
*/
const cropImage = () => {
    if (!$canvas.value || !store.image) return;

    /**Временный канвас для создания обрезанного изображения */
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = selection.value.width;
    tempCanvas.height = selection.value.height;
    /**Контекст временного канваса для отрисовки изображения */
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx?.drawImage(
        store.image,
        selection.value.x * (store.image.width / $canvas.value.width),
        selection.value.y * (store.image.height / $canvas.value.height),
        selection.value.width * (store.image.width / $canvas.value.width),
        selection.value.height * (store.image.height / $canvas.value.height),
        0, 0, selection.value.width, selection.value.height
    );

    /**Сохранение вырезанного элемента в виде Blob для возможности скачивания */
    store.croppedImage = tempCanvas.toDataURL();
};


/**Управление выделением (задание координат и проверка)*/
const startDrag = (event: MouseEvent) => {
    const handleSize = 10;
    const offsetX = event.offsetX;
    const offsetY = event.offsetY;
    /**Высвобождение переменных из модели выделения для уменьшения кода  */
    const { x, y, width, height } = selection.value;

    // Проверяем, нажали ли на квадратик для изменения размера
    if (offsetX >= x + width - handleSize && offsetY >= y + height - handleSize) {
        selection.value.resizing = true;
    } else {
        selection.value.dragging = true;
    }
};

/**Отключение перетаскивания при отпускании кнопки мыши */
const stopDrag = () => {
    selection.value.dragging = false;
    selection.value.resizing = false;
};

/**Управление выделением (перемещение и изменение размера) */
const moveSelection = (event: MouseEvent) => {
    if (store.image && store.image.src != "") {
        if (selection.value.dragging && $canvas.value) {
            selection.value.x = Math.max(0, Math.min(event.offsetX - selection.value.width / 2, $canvas.value.width - selection.value.width));
            selection.value.y = Math.max(0, Math.min(event.offsetY - selection.value.height / 2, $canvas.value.height - selection.value.height));
        } else if (selection.value.resizing) {
            const newWidth = event.offsetX - selection.value.x;
            const newHeight = event.offsetY - selection.value.y;
            if (newWidth > 10 && newHeight > 10) {
                selection.value.width = newWidth;
                selection.value.height = newHeight;
            }
        }
        drawCanvas();
    }
};

/**Высвоюождение функций загрузки и ибрезки изображения для использования во внешних компонентах */
defineExpose({ loadImage, cropImage });

</script>

<template>
    <div>
        <canvas ref="$canvas" @mousedown="startDrag" @mouseup="stopDrag" @mousemove="moveSelection">
        </canvas>
    </div>
</template>

<style lang="scss" scoped>
canvas {
    border: 1px solid #ccc;
    cursor: crosshair;
}
</style>
