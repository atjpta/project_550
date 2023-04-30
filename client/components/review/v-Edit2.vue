<template>
  <div>
    <div class="grid sm:grid-cols-2">
      <!-- độ khó -->
      <div>
        <div class="text-2xl">Độ khó:</div>
        <div class="flex items-center space-x-2 text-2xl">
          <div class="rating">
            <input
              :checked="data.level == 0"
              type="radio"
              name="rating-level"
              class="rating-hidden"
            />
            <input
              :checked="data.level == i"
              v-for="i in max"
              :key="i"
              @click="data.level = i"
              type="radio"
              name="rating-level"
              class="mask mask-star-2 bg-primary"
            />
          </div>
          <div>
            {{ data.level }}
          </div>
        </div>
      </div>

      <!-- chất lượng -->
      <div>
        <div class="text-2xl">Chất lượng:</div>
        <div class="flex items-center space-x-2 text-2xl">
          <div class="rating">
            <input
              :checked="data.quality == 0"
              type="radio"
              name="rating-quality"
              class="rating-hidden"
            />
            <input
              :checked="data.quality == i"
              v-for="i in max"
              :key="i"
              @click="data.quality = i"
              type="radio"
              name="rating-quality"
              class="mask mask-star-2 bg-primary"
            />
          </div>
          <div>
            {{ data.quality }}
          </div>
        </div>
      </div>
      <!-- sự hữu dụng -->
      <div>
        <div class="text-2xl">Sự hữu dụng:</div>
        <div class="flex items-center space-x-2 text-2xl">
          <div class="rating">
            <input
              :checked="data.useful == 0"
              type="radio"
              name="rating-useful"
              class="rating-hidden"
            />
            <input
              :checked="data.useful == i"
              v-for="i in max"
              :key="i"
              @click="data.useful = i"
              type="radio"
              name="rating-useful"
              class="mask mask-star-2 bg-primary"
            />
          </div>
          <div>
            {{ data.useful }}
          </div>
        </div>
      </div>
      <!-- độ quan trọng  -->
      <div>
        <div class="text-2xl">Độ quan trọng:</div>
        <div class="flex items-center space-x-2 text-2xl">
          <div class="rating">
            <input
              :checked="data.importance == 0"
              type="radio"
              name="rating-importance"
              class="rating-hidden"
            />
            <input
              :checked="data.importance == i"
              v-for="i in max"
              :key="i"
              @click="data.importance = i"
              type="radio"
              name="rating-importance"
              class="mask mask-star-2 bg-primary"
            />
          </div>
          <div>
            {{ data.importance }}
          </div>
        </div>
      </div>
      <!-- độ phổ biến -->
      <div>
        <div class="text-2xl">Độ phổ biến:</div>
        <div class="flex items-center space-x-2 text-2xl">
          <div class="rating">
            <input
              :checked="data.popularity == 0"
              type="radio"
              name="rating-popularity"
              class="rating-hidden"
            />
            <input
              :checked="data.popularity == i"
              v-for="i in max"
              :key="i"
              @click="data.popularity = i"
              type="radio"
              name="rating-popularity"
              class="mask mask-star-2 bg-primary"
            />
          </div>
          <div>
            {{ data.popularity }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: Object,
});

const max = 5;
</script>

<style></style>
