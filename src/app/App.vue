<script lang="ts" setup>
import { Container, Footer, Header } from '@/components';
import { NotFound } from './pages';
import { computed } from 'vue';
import { store } from './store';

window.addEventListener('hashchange', () => {
    store.currentPath = window.location.hash
})
</script>

<template>
    <Header />
    <RouterView class="content" ></RouterView>
    <Footer class="footer"></Footer>
</template>

<style lang="scss" scoped>
.content {
    height: 100%;
}

.footer {
    bottom: 0;
    position: static;
    height: auto;
}
</style>
