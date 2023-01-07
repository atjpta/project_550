<template>
  <div class="">
    <div class="hidden">
      {{ data.content }}
    </div>
    <div>
      <QuillEditor
        :on-update:content="gettagname()"
        @text-change="getdata()"
        ref="quill"
        theme="snow"
        toolbar="full"
      />
    </div>
    <!-- các tag name đã chọn -->
    <div class="flex justify-start mt-1">
      <div v-for="user in data.tagname" :key="user.id">
        <div @click="removeUser(user.id)" class="btn btn-info btn-sm btn-outline">
          {{ "@" + user.name }}

          <OtherVIcon
            class-icon="cursor-pointer hover:scale-125 duration-300 ml-2"
            icon="fa-solid fa-x"
          />
        </div>
      </div>
    </div>
    <!-- listuser -->
    <transition name="bounce">
      <div
        v-if="tagName"
        class="z-50 absolute bg-base-300 h-60 w-80 p-5 rounded-2xl overflow-y-auto"
      >
        <div v-if="listUser.length == 0" class="text-center">không có dữ liệu</div>
        <div v-for="user in listUser" :key="user.id" class="">
          <div
            @click="selectUser(user.id)"
            class="bg-base-100 my-1 btn btn-block btn-ghost justify-start shadow-sm shadow-primary"
          >
            <img class="rounded-full w-12 h-12" :src="user.avatar_url" alt="" />

            <div class="p-3">{{ user.name }}</div>
          </div>
        </div>
      </div>
    </transition>
    <div
      @click="$emit('send')"
      :class="[loading ? 'loading' : '']"
      class="btn btn-primary btn-sm btn-outline my-2"
    >
      <OtherVIcon icon="fa-solid fa-paper-plane" />
      gửi
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUpdated, ref } from "vue";
import { QuillEditor, Quill } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { userStore } from "~~/stores/user.store";

const useUser = userStore();
const quill = ref();
const tagName = ref("");

const props = defineProps({
  data: Object,
  reset: Intl,
  loading: Boolean,
});

const listUser = computed(() => {
  let list;
  if (tagName.value.length > 0) {
    list = useUser.list_user.filter(
      (user) => user.name.indexOf(tagName.value) > -1 && user.id != useUser.user.id
    );
  }
  return list;
});

function getdata() {
  props.data.content = quill.value.getContents();
}

function gettagname() {
  if (quill.value) {
    let text = quill.value.getText();
    let indextagname = text.search("@");
    if (indextagname > -1) {
      tagName.value = text.substring(indextagname + 1, text.length).trim();
    }
  }
}

function removeUser(id) {
  const index = props.data.tagname.findIndex((e) => e.id == id);
  props.data.tagname.splice(index, 1);
}

function checkdouble(id) {
  let check = false;
  props.data.tagname.forEach((e) => {
    if (e.id == id) {
      check = true;
    }
  });
  return check;
}
function selectUser(id) {
  useUser.list_user.forEach((user) => {
    if (user.id == id) {
      if (!checkdouble(id)) {
        props.data.tagname.push(user);
      }
      props.data.content.ops.forEach((e, i) => {
        let index = e.insert.indexOf("@");
        if (index > -1) {
          props.data.content.ops[i].insert = props.data.content.ops[i].insert.substring(
            0,
            index
          );
          quill.value.setContents(props.data.content.ops);
        }
      });
      tagName.value = "";
    }
  });
}
const isReset = ref(0);

onUpdated(() => {
  if (props.reset > isReset.value) {
    isReset.value = props.reset;
    quill.value.setContents({ ops: [{ insert: "\n" }] });
  }
});

onMounted(() => {
  quill.value.setContents({ ops: [{ insert: "\n" }] });
});
</script>

<style></style>
