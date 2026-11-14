<script setup lang="ts">
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue';
import OpenEcosystemPage from '../components/OpenEcosystemPage.vue';
</script>

<template>
    <ParentLayout>
        <template #page>
            <OpenEcosystemPage />
        </template>
    </ParentLayout>
</template>
