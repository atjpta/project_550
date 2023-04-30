<template>
  <div>
    <div class="grid sm:grid-cols-2">
      <!-- list -->
      <div v-for="i in list" :key="i.title">
        <div class="text-2xl">{{ i.title }}:</div>

        <div class="flex items-center space-x-2 text-2xl">
          <div class="rating rating-half">
            <input
              :checked="i.value == 0"
              type="radio"
              :name="i.title"
              class="rating-hidden"
            />
            <input
              :checked="i.value > 0.5"
              type="radio"
              :name="i.title"
              class="bg-primary mask mask-star-2 cursor-default mask-half-1"
              disabled
            />
            <input
              :checked="i.value > 1.5"
              type="radio"
              :name="i.title"
              class="bg-primary mask mask-star-2 cursor-default mask-half-2"
              disabled
            />
            <input
              :checked="i.value > 1"
              type="radio"
              :name="i.title"
              class="bg-primary mask mask-star-2 cursor-default mask-half-1"
              disabled
            />
            <input
              :checked="i.value > 1.5"
              type="radio"
              :name="i.title"
              class="bg-primary mask mask-star-2 cursor-default mask-half-2"
              disabled
            />
            <input
              :checked="i.value > 2"
              type="radio"
              :name="i.title"
              class="bg-primary mask mask-star-2 cursor-default mask-half-1"
              disabled
            />
            <input
              :checked="i.value > 2.5"
              type="radio"
              :name="i.title"
              class="bg-primary mask mask-star-2 cursor-default mask-half-2"
              disabled
            />
            <input
              :checked="i.value > 3"
              type="radio"
              :name="i.title"
              class="bg-primary mask mask-star-2 cursor-default mask-half-1"
              disabled
            />
            <input
              :checked="i.value > 3.5"
              type="radio"
              :name="i.title"
              class="bg-primary mask mask-star-2 cursor-default mask-half-2"
              disabled
            />
            <input
              :checked="i.value > 4"
              type="radio"
              :name="i.title"
              class="bg-primary mask mask-star-2 cursor-default mask-half-1"
              disabled
            />
            <input
              :checked="i.value > 4.5"
              type="radio"
              :name="i.title"
              class="bg-primary mask mask-star-2 cursor-default mask-half-2"
              disabled
            />
          </div>
          <div class="">{{ i.value }}</div>
        </div>
      </div>
      <!-- sl -->
    </div>
    <div class="italic">{{ data.size }} người dùng đánh giá</div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: Object,
});

const list = computed(() => {
  return [
    {
      title: "Độ khó",
      value: props.data.level,
    },
    {
      title: "Chất lượng",
      value: props.data.quality,
    },
    {
      title: "Sự hữu dụng",
      value: props.data.useful,
    },
    {
      title: "Độ quan trọng",
      value: props.data.importance,
    },
    {
      title: "Độ phổ biến",
      value: props.data.popularity,
    },
  ];
});

const max = 5;
</script>

<style></style>
