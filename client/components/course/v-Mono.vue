<template>
    <div>
        <div @click="navigateTo(`/course/${data.id}/review`)" :style="`background: ${color};`"
            class="btn btn-outline shadow-sm m-2 shadow-blue-500 border-0 w-72 h-40 font-extrabold text-2xl flex items-center justify-center p-10 overflow-clip">
            <div class="">
                {{ data.name }}
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    data: Object,
    color: String,
});
</script>

<style></style>
