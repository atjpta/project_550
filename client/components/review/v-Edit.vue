<template>
  <div>
    <div class="">
      <!-- độ khó -->
      <div>
        <div class="text-2xl uppercase">Độ khó:</div>
        <div>
          <div class="text-center text-2xl">
            {{ data.level }}
          </div>
          <div class="mb-3 flex justify-between items-center">
            <div class="text-2xl">{{ min }}</div>
            <input
              v-model="data.level"
              type="range"
              :min="min"
              :max="max"
              class="mx-5 range range-primary range-lg h-4 border-r-0 ring-2 rounded-tl-full rounded-br-full rounded-none skew-x-[-45deg] bg-transparent w-full bg-gradient-to-r from-violet-500/50 via-purple-400/50 to-pink-400/50"
            />
            <div class="text-2xl">{{ max }}</div>
          </div>
        </div>
      </div>
      <!-- chất lượng -->
      <div>
        <div class="text-2xl uppercase">Chất lượng:</div>
        <div>
          <div class="text-center text-2xl">
            {{ data.quality }}
          </div>
          <div class="mb-3 flex justify-between items-center">
            <div class="text-2xl">{{ min }}</div>
            <input
              v-model="data.quality"
              type="range"
              :min="min"
              :max="max"
              class="mx-5 range range-primary range-lg h-4 border-r-0 ring-2 rounded-tl-full rounded-br-full rounded-none skew-x-[-45deg] bg-transparent w-full bg-gradient-to-r from-violet-500/50 via-purple-400/50 to-pink-400/50"
            />
            <div class="text-2xl">{{ max }}</div>
          </div>
        </div>
      </div>
      <!-- sự hữu dụng -->
      <div>
        <div class="text-2xl uppercase">Sự hữu dụng:</div>
        <div>
          <div class="text-center text-2xl">
            {{ data.useful }}
          </div>
          <div class="mb-3 flex justify-between items-center">
            <div class="text-2xl">{{ min }}</div>
            <input
              v-model="data.useful"
              type="range"
              :min="min"
              :max="max"
              class="mx-5 range range-primary range-lg h-4 border-r-0 ring-2 rounded-tl-full rounded-br-full rounded-none skew-x-[-45deg] bg-transparent w-full bg-gradient-to-r from-violet-500/50 via-purple-400/50 to-pink-400/50"
            />
            <div class="text-2xl">{{ max }}</div>
          </div>
        </div>
      </div>
      <!-- độ quan trọng  -->
      <div>
        <div class="text-2xl uppercase">Độ quan trọng:</div>
        <div>
          <div class="text-center text-2xl">
            {{ data.importance }}
          </div>
          <div class="mb-3 flex justify-between items-center">
            <div class="text-2xl">{{ min }}</div>
            <input
              v-model="data.importance"
              type="range"
              :min="min"
              :max="max"
              class="mx-5 range range-primary range-lg h-4 border-r-0 ring-2 rounded-tl-full rounded-br-full rounded-none skew-x-[-45deg] bg-transparent w-full bg-gradient-to-r from-violet-500/50 via-purple-400/50 to-pink-400/50"
            />
            <div class="text-2xl">{{ max }}</div>
          </div>
        </div>
      </div>
      <!-- độ phổ biến -->
      <div>
        <div class="text-2xl uppercase">Độ phổ biến:</div>
        <div>
          <div class="text-center text-2xl">
            {{ data.popularity }}
          </div>
          <div class="mb-3 flex justify-between items-center">
            <div class="text-2xl">{{ min }}</div>
            <input
              v-model="data.popularity"
              type="range"
              :min="min"
              :max="max"
              class="mx-5 range range-primary range-lg h-4 border-r-0 ring-2 rounded-tl-full rounded-br-full rounded-none skew-x-[-45deg] bg-transparent w-full bg-gradient-to-r from-violet-500/50 via-purple-400/50 to-pink-400/50"
            />
            <div class="text-2xl">{{ max }}</div>
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

const min = 0;
const max = 10;
</script>

<style></style>
