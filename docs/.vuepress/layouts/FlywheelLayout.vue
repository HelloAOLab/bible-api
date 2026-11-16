<script setup lang="ts">
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue';
import FlywheelPage from '../components/FlywheelPage.vue';
</script>

<template>
    <ParentLayout>
        <template #page>
            <FlywheelPage />
        </template>
    </ParentLayout>
</template>
