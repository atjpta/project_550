<template>
  <div>
    <!-- list đã chọn -->
    <div class="flex flex-wrap">
      <div v-for="i in data" :key="i.id">
        <div
          @click="removetag(i)"
          :class="[i.id || i._id ? '' : 'btn-secondary']"
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
  data: Set,
});
const usetag = tagStore();

function addtag(data) {
  if (props.data.size > 0 && props.data.size < 5) {
    let double = 0;
    props.data.forEach((value) => {
      if (value.name == data.name) {
        double = 1;
        return;
      }
    });
    if (double == 0) {
      props.data.add(data);
    }
  } else props.data.add(data);
}
function removetag(data) {
  props.data.delete(data);
}
onMounted(() => {
  usetag.findAll();
});
</script>

<style></style>
