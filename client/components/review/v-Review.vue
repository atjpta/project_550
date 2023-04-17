<template>
    <div>
        <div class="">
            <!-- list -->
            <div v-for="i in list" :key="i.title">
                <div class="text-2xl font-extrabold uppercase">{{ i.title }}:</div>
                <div>
                    <div class="my-5 flex justify-between items-center">
                        <input disabled v-model="i.value" type="range" :min="min" :max="max"
                            class="cursor-default mx-5 range range-primary range-lg h-4 border-r-0 ring-2 rounded-tl-full rounded-br-full rounded-none skew-x-[-45deg] bg-transparent w-full bg-gradient-to-r from-violet-500/50 via-purple-400/50 to-pink-400/50" />
                        <div class="font-extrabold text-2xl">{{ i.value }}</div>
                    </div>
                </div>
            </div>
            <!-- sl -->
            <div class="italic">{{ data.size }} người dùng đánh giá</div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    data: Object,
});

const list = computed(() => {
    return [
        {
            title: "độ khó",
            value: props.data.level,
        },
        {
            title: "chất lượng",
            value: props.data.quality,
        },
        {
            title: "sự hữu dụng",
            value: props.data.useful,
        },
        {
            title: "độ quan trọng",
            value: props.data.importance,
        },
        {
            title: "độ phổ biến",
            value: props.data.popularity,
        },
    ];
});

const min = 0;
const max = 10;
</script>

<style></style>
