<script lang="ts" setup>
import {Croper} from '@/components';
</script>

<template>

  <!-- Параметры кропера
  width,height - значения для фиксированного размера всех изображения(изображения будут растянуты до заданного размера)
  non-stretch(true, false) -если false размер будет применен к контейнеру а не к изображению и изображение не будет растянуто
  max-width, max-height - ограничения размера изображения(если изображение не соответствует то выведется сообщение об ошибке )
  -->
  <Croper :height="600" :non-stretch="true" :width="1000"/>
</template>
