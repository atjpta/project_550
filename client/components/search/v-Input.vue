<template>
  <div>
    <div class="">
      <input
        @keyup.enter="select_data()"
        placeholder="nhập tag"
        v-model="input_data"
        type="text"
        class="input relative bg-inherit border-0 border-b-2 border-primary mb-1 w-full"
      />
      <div @click="select_data()" class="btn btn-sm mb-1 btn-primary btn-outline">
        {{ btnInput.name }}
      </div>
    </div>
    <transition name="bounce">
      <div
        v-if="input_data"
        class="z-50 absolute bg-base-300 h-60 w-80 p-5 rounded-2xl overflow-y-auto"
      >
        <div v-if="dataResult.length == 0" class="text-center">không có dữ liệu</div>
        <div v-for="i in dataResult" :key="i" class="">
          <div
            @click="select_data2(i)"
            class="bg-base-100 my-1 btn btn-block btn-ghost justify-start shadow-sm shadow-primary"
          >
            {{ i.name }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
const props = defineProps({
  data: Array,
  btnInput: Object,
});
const input_data = ref("");

const dataResult = computed(() => {
  let list = [];
  if (input_data.value.length > 0) {
    list = props.data.filter((e) => {
      if (e.name) {
        return (
          e.name.toLowerCase().trim().indexOf(input_data.value.toLowerCase().trim()) > -1
        );
      }
      return false;
    });
  }
  return list;
});

const emit = defineEmits(["select_data"]);

function check(data) {
  dataResult.value.forEach((e) => {
    if (data.name.toLowerCase().trim() == e.name.toLowerCase().trim()) {
      data = e;
      return;
    }
  });
  return data;
}

function select_data() {
  const data = {
    name: input_data.value,
  };
  if (data.name.length > 0) {
    emit("select_data", check(data));
    input_data.value = "";
  }
}

function select_data2(data) {
  if (data.name.length > 0) {
    emit("select_data", data);
    input_data.value = "";
  }
}
</script>

<style>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
