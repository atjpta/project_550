<template>
  <div>
    <!-- list đã chọn -->
    <div class="flex flex-wrap">
      <div v-for="i in list_select_tag" :key="i.id">
        <div
          @click="removetag(i)"
          :class="[i.id ? '' : 'btn-secondary']"
          class="btn btn-outline btn-sm m-1"
        >
          {{ i.name }}
          <OtherVIcon class-icon="ml-1" icon="fa-solid fa-x" />
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

const props = defineProps({
  data: Array,
});
const usetag = tagStore();
const list_select_tag = ref(new Set());
function addtag(data) {
  if (list_select_tag.value.size < 5) {
    list_select_tag.value.add(data);
  }
  props.data.splice(0, props.data.length);
  for (const item of list_select_tag.value) {
    props.data.push(item);
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
