<template>
  <div>
    <!-- list đã chọn -->
    <div class="flex flex-wrap">
      <div v-for="i in list_select_tag" :key="i.id">
        <div
          @click="removetag(i)"
          :class="[i.id ? '' : 'badge-secondary']"
          class="badge gap-2 m-1"
        >
          {{ i.name }}
          <OtherVIcon class-icon="" icon="fa-solid fa-x" />
        </div>
      </div>
    </div>

    <!-- input -->
    <div>
      <SearchVInput
        @select_data="addtag"
        :btnInput="{ name: 'thêm' }"
        :data="usetag.List_tag"
      />
    </div>
  </div>
</template>

<script setup>
import { tagStore } from "~~/stores/tag.store";

const usetag = tagStore();
const list_select_tag = ref(new Set());
function addtag(data) {
  if (list_select_tag.value.size < 5) {
    list_select_tag.value.add(data);
  }
}
function removetag(data) {
  list_select_tag.value.delete(data);
}
onMounted(() => {
  usetag.findAll();
});
</script>

<style></style>
