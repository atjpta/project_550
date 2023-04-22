<template>
  <div :class="!preview ? 'bg-gradient-to-r from-pink-500/10 via-pink-500/5 to-pink-500/0' : ''
    " class="p-5 rounded-2xl">
    <transition name="bounce">
      <div v-show="preview == false">
        <div class="text-4xl text-center font-extrabold">Chỉnh sửa topic</div>
        <!-- tiêu đề -->
        <div>
          <div class="text-xl font-extrabold mt-5">
            Tên topic
            <div class="tooltip" data-tip="không được để trống">
              <div class="btn-xs btn btn-ghost rounded-full h-1 w-6">
                <OtherVIcon class-icon="text-error" icon="fa-solid fa-star-of-life" />
              </div>
            </div>
          </div>
          <input v-model="useTopic.topic_edit.name" placeholder="nhập tên topic" type="text"
            class="input input-primary w-full" />
        </div>

        <!-- ảnh bìa -->
        <div class="text-xl font-extrabold mt-5">
          Biểu tượng topic
          <div>
            <ImageVUploadsimple :data="useTopic.topic_edit.image_cover_url" />
          </div>
        </div>
        <!-- phần tag của bài viết -->
        <div>
          <div class="text-xl font-extrabold mt-5">
            Chọn tag
            <div class="tooltip" data-tip="tag sẽ được thêm theo tag câu hỏi">
              <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
                <OtherVIcon class-icon="" icon="fa-solid fa-info" />
              </div>
            </div>
          </div>
          <div class="">
            <input disabled placeholder="nhập tag" type="text"
              class="input relative bg-inherit border-0 border-b-2 border-primary mb-1 w-full" />
            <div disabled="disabled" class="btn btn-sm mb-1 btn-primary btn-outline disabled">
              thêm
            </div>
          </div>
        </div>

        <!-- phần nội dung bài viết -->
        <div class="mt-5 mb-2">
          <div class="text-xl font-extrabold mt-5">
            Tóm tắt
            <div class="tooltip" data-tip="không được để trống">
              <div class="btn-xs btn btn-ghost rounded-full h-1 w-6">
                <OtherVIcon class-icon="text-error" icon="fa-solid fa-star-of-life" />
              </div>
            </div>
          </div>
          <textarea v-model="useTopic.topic_edit.introduce" placeholder="nhập nội dung" type="text"
            class="textarea textarea-primary w-full h-20" />
        </div>
      </div>
    </transition>
    <!-- preview -->
    <transition name="bounce">
      <div v-show="preview == true">
        <TopicVPreview :data="useTopic.topic_edit" />
      </div>
    </transition>
    <!-- các nút btn -->
    <div class="flex justify-end space-x-5 my-5">
      <div v-if="preview == false" @click="showPreview()" class="btn btn-outline btn-sm btn-info">
        xem trước
      </div>
      <div v-if="preview == true" @click="preview = false" class="btn btn-outline btn-sm btn-info">
        chỉnh tiếp
      </div>
      <div @click="save()" :class="[loading ? 'loading' : '']" class="btn btn-sm btn-primary">
        lưu
      </div>
      <div @click="useRouter().back()" class="btn btn-ghost btn-sm text-error">hủy</div>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "~~/stores/user.store";
import { topicStore } from "~~/stores/topic.store";
import { authStore } from "~~/stores/auth.store";
import { imageStore } from "~~/stores/image.store";
import { statusStore } from "~~/stores/status.store";

const props = defineProps({
  loading: Boolean,
});
const preview = ref(false);

const useUser = userStore();
const useAuth = authStore();
const useStatus = statusStore();
const useImage = imageStore();
const useTopic = topicStore();
const route = useRoute();

const emit = defineEmits(["save"]);

function getdata() {
  useTopic.topic_edit.author = useUser.user;
}

function save() {
  getdata();
  emit("save");
}

function showPreview() {
  getdata();
  preview.value = true;
}

async function getApi() {
  if (route.params.id) {
    await useTopic.findOneEdit(route.params.id);
    if (useTopic.topic.author._id != useAuth.user.id) {
      useAlert.setWarning("bạn không có quyền truy cập");
      return navigateTo("/");
    }
    useTopic.topic_edit = useTopic.topic;
  } else {
    useTopic.resettopicEdit();
  }
}

onMounted(() => {
  useTopic.reset();
  getApi();
});

onUnmounted(() => {
  useTopic.reset();
});
</script>

<style></style>
