<script lang="ts" setup>
import {defineEmits, ref} from 'vue'

const model = defineModel()

/**Переменная input элемента для взаимодействия*/
const $fileInput = ref<HTMLInputElement>();

/**Переменная div элемента зоны дропа*/
const $dropZone = ref<HTMLDivElement>();

/**Переменная определяющая активность зоны дропа*/
const active = ref(false);

//Функции меняющие активность дропа
const setActive = () => active.value = true;
const setInactive = () => active.value = false;

/**Функция использующая $fileInput вызывающая выбор файла**/
function clickLoad(input: Event) {
  const inputElement = (input.target as HTMLInputElement);
    if (inputElement.files)
      model.value = [...inputElement.files];
}

/**Обработка дропа файла в зону загрузки*/
function onDrop(e: any) {
  const files = [...e.dataTransfer.files];
  setInactive();
  model.value = files;
}

</script>
<template>
    <input type="file" ref="$fileInput" style="display: none;" accept="image/png, image/jpeg, image/jpg"  @change="clickLoad">
    <div class="drop_zone" ref="$dropZone" @drop.prevent="onDrop" :data-active="active" @dragenter.prevent="setActive"
        @dragover.prevent="setActive" @dragleave.prevent="setInactive" @click="$fileInput?.click()">
        Нажмите для выбора файла<br>или<br>переместите его сюда
    </div>

</template>
<style lang="css" scoped>
.drop_zone {
    background: gray;
    border: black 2px dashed;

    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    cursor: pointer;

    width: 250px;
    height: 150px;
}
</style>