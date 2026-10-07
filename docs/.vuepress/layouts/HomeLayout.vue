<script setup lang="ts">
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue';
import HomePage from '../components/HomePage.vue';
</script>

<template>
    <ParentLayout>
        <template #page>
            <HomePage />
        </template>
    </ParentLayout>
</template>
