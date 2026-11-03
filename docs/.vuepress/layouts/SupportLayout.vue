<script setup lang="ts">
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue';
import SupportPage from '../components/SupportPage.vue';
</script>

<template>
    <ParentLayout>
        <template #page>
            <SupportPage />
        </template>
    </ParentLayout>
</template>
