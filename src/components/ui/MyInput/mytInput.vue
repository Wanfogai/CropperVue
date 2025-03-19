<script lang="ts" setup>
import { onMounted, onUnmounted, defineEmits, ref } from 'vue'

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
    setInactive() // add this line too
    emit('files-dropped', [...e.dataTransfer.files])
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