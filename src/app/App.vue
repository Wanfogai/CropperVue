<script lang="ts" setup>
import { Croper } from '@/components';
import { ref, onMounted, onUnmounted, computed, onBeforeMount, watch } from 'vue';


</script>

<template>

  <!--
  width,height - значения для фиксированного размера всех изображения(изображения будут растянуты до заданного размера)
  max-width, max-height - ограничения размера изображения(если изображение не соответствует то выведется сообщение об ошибке )
  non-stretch(true, false) -если false размер будет применен к контейнеру а не к изображению и изображение не будет разтянуто
  -->
    <Croper :width="400" :height="200" :non-stretch="true"/>
</template>
