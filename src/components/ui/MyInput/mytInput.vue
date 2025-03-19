<script lang="ts" setup>
import { onMounted, onUnmounted, defineEmits, ref } from 'vue'
import {file} from "@babel/types";
import {extension} from "mime";

const emit = defineEmits([
    'files-dropped'

])

const $fileInput = ref<HTMLInputElement>()

const $dropZone = ref<HTMLDivElement>()

let active = ref(false)

function setActive() {
    active.value = true
}
function setInactive() {
    active.value = false
}

function clickLoad(input: Event) {
    const inputElement = (input.target as HTMLInputElement)
    if (inputElement.files)
        emit('files-dropped', [...inputElement.files])
}

function onDrop(e: any) {
   const sadad =[ ...e.dataTransfer.files]
    sadad.forEach(file => {
     if (file.extension != "png" || file.extension != "jpg" || file.extension != "jpeg") {
       console.log(file.extension)
       alert("Не верный тип файла")
       return null;
     }
   })
    setInactive() // add this line too
    emit('files-dropped', sadad)
}



</script>
<template>
    <input type="file" ref="$fileInput" style="display: none;" accept="image/png, image/jpeg, image/jpg"  @change="clickLoad">
    <div class="drop_zone" ref="$dropZone" @drop.prevent="onDrop" :data-active="active" @dragenter.prevent="setActive"
        @dragover.prevent="setActive" @dragleave.prevent="setInactive" @click="$fileInput?.click()">
        Нажмите для выбора файла<br>или<br>переместите в зону сюда
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