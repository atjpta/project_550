<template>
  <div :class="!preview
    ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10'
    : ''
    " class="p-5 rounded-2xl">
    <transition name="bounce">
      <div v-show="preview == false">
        <div class="text-4xl text-center font-extrabold">Chỉnh sửa nhóm</div>
        <!-- tiêu đề -->
        <div>
          <div class="text-xl font-extrabold mt-5">
            Tên nhóm
            <div class="tooltip" data-tip="Không được để trống">
              <div class="btn-xs btn btn-ghost rounded-full h-1 w-6">
                <OtherVIcon class-icon="text-error" icon="fa-solid fa-star-of-life" />
              </div>
            </div>
          </div>
          <input v-model="useTeam.team_edit.name" placeholder="Nhập tên nhóm..." type="text"
            class="input input-primary w-full" />
        </div>

        <!-- ảnh bìa -->
        <div class="text-xl font-extrabold mt-5">
          Biểu tượng nhóm
          <div>
            <ImageVUploadsimple :data="useTeam.team_edit?.image_cover_url" />
          </div>
        </div>
        <!-- phần tag của bài viết -->
        <div>
          <div class="text-xl font-extrabold mt-5">
            Thẻ tag
            <div class="tooltip" data-tip="được chọn tối đa 5 tag">
              <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
                <OtherVIcon class-icon="" icon="fa-solid fa-info" />
              </div>
            </div>
          </div>
          <TagVInputTag :data="useTeam.team_edit?.tag" />
        </div>

        <!-- chọn trang thái -->

        <div class="text-xl font-extrabold mt-5 mb-2">Chọn trạng thái</div>
        <div class="w-full max-w-xs">
          <div data-tip="Mọi người đều xem được bài viết" class="form-control tooltip w-full">
            <label class="label cursor-pointer">
              <span class="label-text">Công khai</span>
              <input @click="useTeam.team_edit.status = 'public'" type="radio" name="radio-10"
                class="radio checked:bg-red-500" :checked="useTeam.team_edit.status == 'public'" />
            </label>
          </div>
          <div data-tip="Bài viết và câu hỏi chỉ thành viên thấy được" class="form-control tooltip w-full">
            <label class="label cursor-pointer">
              <span class="label-text">Riêng tư</span>
              <input :checked="useTeam.team_edit.status == 'private'" @click="useTeam.team_edit.status = 'private'"
                type="radio" name="radio-10" class="radio checked:bg-blue-500" />
            </label>
          </div>
        </div>

        <!-- phần nội dung bài viết -->
        <div class="mt-5 mb-2">
          <div class="text-xl font-extrabold mt-5">
            Lời giới thiệu
            <div class="tooltip" data-tip="Không được để trống">
              <div class="btn-xs btn btn-ghost rounded-full h-1 w-6">
                <OtherVIcon class-icon="text-error" icon="fa-solid fa-star-of-life" />
              </div>
            </div>
          </div>
          <textarea v-model="useTeam.team_edit.introduce" placeholder="Nhập nội dung..." type="text"
            class="textarea textarea-primary w-full h-20" />
        </div>
      </div>
    </transition>
    <!-- preview -->
    <transition name="bounce">
      <div v-show="preview == true">
        <TeamVPreview :data="useTeam.team_edit" />
      </div>
    </transition>
    <!-- các nút btn -->
    <div class="flex justify-end space-x-5 my-5">
      <div v-if="preview == false" @click="showPreview()" class="btn btn-outline btn-sm btn-info">
        Xem trước
      </div>
      <div v-if="preview == true" @click="preview = false" class="btn btn-outline btn-sm btn-info">
        Chỉnh tiếp
      </div>
      <div @click="save()" :class="[loading ? 'loading' : '']" class="btn btn-sm btn-primary">
        Lưu
      </div>
      <div @click="useRouter().back()" class="btn btn-ghost btn-sm text-error">Hủy</div>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "~~/stores/user.store";
import { teamStore } from "~~/stores/team.store";
import { seriesStore } from "~~/stores/series.store";
import { authStore } from "~~/stores/auth.store";
import { imageStore } from "~~/stores/image.store";
import { statusStore } from "~~/stores/status.store";
import { memberStore } from "~/stores/member.store";
import { alertStore } from "~/stores/alert.store";

const props = defineProps({
  loading: Boolean,
});
const preview = ref(false);

const useUser = userStore();
const useAuth = authStore();
const useStatus = statusStore();
const useImage = imageStore();
const useTeam = teamStore();
const route = useRoute();
const useAlert = alertStore();
const useMember = memberStore();

// const list_status = computed(() => {
//   useStatus.getPost.forEach((e) => {
//     if (e.name == "public") {
//       useTeam.team_edit.status = e;
//     }
//   });
//   return useStatus.getPost;
// });

const list_status = computed(() => {
  useStatus.getPost.forEach((e) => {
    if (useTeam.team_edit.status) {
      if (useTeam.team_edit.status[0]?.name == e.name) {
        useTeam.team_edit.status = e;
        return;
      }
    } else if (e.name == "public") {
      useTeam.team_edit.status = e;
    }
  });
  return useStatus.getPost;
});

const emit = defineEmits(["save"]);

function getdata() {
  useTeam.team_edit.author = useUser.user;
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
    await useMember.checkIsChief(route.params.id, useAuth.user.id);
    if (!useMember.isChief) {
      useAlert.setWarning("Bạn Không có quyền truy cập");
      return navigateTo("/");
    }
    await useTeam.findOneEdit(route.params.id);
    useTeam.team_edit = useTeam.team;
  } else {
    useTeam.resetTeamEdit();
  }
}

onMounted(() => {
  useStatus.findAll();
  getApi();
});
</script>

<style></style>
