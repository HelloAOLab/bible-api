<script setup lang="ts">
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue';
import FreeUseFundPage from '../components/FreeUseFundPage.vue';
</script>

<template>
    <ParentLayout>
        <template #page>
            <FreeUseFundPage />
        </template>
    </ParentLayout>
</template>
