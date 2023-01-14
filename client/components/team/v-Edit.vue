<template>
  <div class="p-5 bg-base-200 rounded-2xl">
    <transition name="bounce">
      <div v-show="preview == false">
        <div class="text-4xl text-center font-semibold">Chỉnh sửa nhóm</div>
        <!-- tiêu đề -->
        <div>
          <div class="text-xl font-semibold mt-5">Tên nhóm</div>
          <input
            v-model="useTeam.team_edit.name"
            placeholder="nhập tiêu đề"
            type="text"
            class="p-1 bg-inherit border-0 border-b-2 border-primary w-full"
          />
        </div>

        <!-- ảnh bìa -->
        <div class="text-xl font-semibold mt-5">
          Biểu tượng nhóm
          <div>
            <ImageVUploadsimple :data="useTeam.team_edit.image_cover_url" />
          </div>
        </div>
        <!-- phần tag của bài viết -->
        <div>
          <div class="text-xl font-semibold mt-5">
            Chọn tag
            <div class="tooltip" data-tip="được chọn tối đa 5 tag">
              <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
                <OtherVIcon class-icon="" icon="fa-solid fa-info" />
              </div>
            </div>
          </div>
          <TagVTag :data="useTeam.team_edit?.tag" />
        </div>
        <!-- chọn trạng thái -->
        <div>
          <div class="text-xl font-semibold mt-5 mb-2">
            Trạng thái của nhóm
            <div class="tooltip" data-tip="riêng tư là các bài viết bị ẩn đi">
              <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
                <OtherVIcon class-icon="" icon="fa-solid fa-info" />
              </div>
            </div>
          </div>

          <select
            v-model="useTeam.team_edit.status"
            class="select-sm select select-primary w-full max-w-xs"
          >
            <option :value="i" v-for="i in list_status" :key="i">
              {{ i.name == "public" ? "Công khai" : "Riêng tư" }}
            </option>
          </select>
        </div>

        <!-- phần nội dung bài viết -->
        <div class="mt-5 mb-2">
          <div class="text-xl font-semibold">Lời giới thiệu</div>
          <textarea
            v-model="useTeam.team_edit.introduce"
            placeholder="nhập nội dung"
            type="text"
            class="p-1 bg-inherit border-0 border-b-2 border-primary w-full h-20"
          />
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
      <div
        v-if="preview == false"
        @click="showPreview()"
        class="btn btn-outline btn-sm btn-info"
      >
        xem trước
      </div>
      <div
        v-if="preview == true"
        @click="preview = false"
        class="btn btn-outline btn-sm btn-info"
      >
        chỉnh tiếp
      </div>
      <div
        @click="save()"
        :class="[loading ? 'loading' : '']"
        class="btn btn-outline btn-sm btn-primary"
      >
        lưu
      </div>
      <div @click="this.$router.back()" class="btn btn-outline btn-sm btn-error">hủy</div>
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

const list_status = computed(() => {
  useStatus.getPost.forEach((e) => {
    if (e.name == "public") {
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
    await useTeam.teamOne(route.params.id);
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
