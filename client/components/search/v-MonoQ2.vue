<template>
    <div class="p-5">
        <div class="text-2xl">
            {{ data.title }}
        </div>
        <div class="truncate">
            {{ data.content }}
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    data: Object,
});
</script>

<style></style>
