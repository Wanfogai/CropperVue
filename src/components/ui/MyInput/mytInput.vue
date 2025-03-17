<script lang="ts" setup>

const emit = defineEmits([
    'loadImage'
])

</script>
<template>
    <input type="file" @change="emit('loadImage', $event)" v-text="'Hello'" />

    <div class="drop_zone"></div>
</template>
<style lang="css" scoped>
.drop_zone{
    
}
</style>