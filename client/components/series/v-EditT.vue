<template>
  <div
    :class="
      !preview
        ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/0'
        : ''
    "
    class="p-5 rounded-2xl"
  >
    <transition name="bounce">
      <div v-show="preview == false">
        <div class="text-4xl text-center font-semibold">Chỉnh sửa series</div>
        <!-- tiêu đề -->
        <div>
          <div class="text-xl font-semibold mt-5">
            Tên series
            <div class="tooltip" data-tip="không được để trống">
              <div class="btn-xs btn btn-ghost rounded-full h-1 w-6">
                <OtherVIcon class-icon="text-error" icon="fa-solid fa-star-of-life" />
              </div>
            </div>
          </div>
          <input
            v-model="useSeries.series_edit.name"
            placeholder="nhập tên series"
            type="text"
            class="input input-primary w-full"
          />
        </div>

        <!-- ảnh bìa -->
        <div class="text-xl font-semibold mt-5">
          Biểu tượng series
          <div>
            <ImageVUploadsimple :data="useSeries.series_edit.image_cover_url" />
          </div>
        </div>
        <!-- phần tag của bài viết -->
        <div>
          <div class="text-xl font-semibold mt-5">
            Chọn tag
            <div class="tooltip" data-tip="tag sẽ được thêm theo tag bài viết">
              <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
                <OtherVIcon class-icon="" icon="fa-solid fa-info" />
              </div>
            </div>
          </div>
          <div class="">
            <input
              disabled
              placeholder="nhập tag"
              type="text"
              class="input relative bg-inherit border-0 border-b-2 border-primary mb-1 w-full"
            />
            <div
              disabled="disabled"
              class="btn btn-sm mb-1 btn-primary btn-outline disabled"
            >
              thêm
            </div>
          </div>
        </div>

        <!-- chọn trạng thái -->
        <div>
          <div class="text-xl font-semibold mt-5 mb-2">
            Trạng thái của series
            <div class="tooltip" data-tip="riêng tư là chỉ bạn xem được">
              <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
                <OtherVIcon class-icon="" icon="fa-solid fa-info" />
              </div>
            </div>
          </div>

          <select
            v-model="useSeries.series_edit.status"
            class="select-sm select select-primary w-full max-w-xs"
          >
            <option :value="i" v-for="i in list_status" :key="i">
              {{ i.name == "public" ? "Công khai" : "Riêng tư" }}
            </option>
          </select>
        </div>

        <!-- phần nội dung bài viết -->
        <div class="mt-5 mb-2">
          <div class="text-xl font-semibold mt-5">
            Lời giới thiệu
            <div class="tooltip" data-tip="không được để trống">
              <div class="btn-xs btn btn-ghost rounded-full h-1 w-6">
                <OtherVIcon class-icon="text-error" icon="fa-solid fa-star-of-life" />
              </div>
            </div>
          </div>
          <textarea
            v-model="useSeries.series_edit.introduce"
            placeholder="nhập nội dung"
            type="text"
            class="textarea textarea-primary h-20 w-full"
          />
        </div>
      </div>
    </transition>
    <!-- preview -->
    <transition name="bounce">
      <div v-show="preview == true">
        <SeriesVPreview :data="useSeries.series_edit" />
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
      <div @click="useRouter().back()" class="btn btn-outline btn-sm btn-error">hủy</div>
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
const useSeries = seriesStore();
const route = useRoute();
const useTeam = teamStore();

const list_status = computed(() => {
  useStatus.getPost.forEach((e) => {
    if (e.name == "public") {
      useSeries.series_edit.status = e;
    }
  });
  return useStatus.getPost;
});

const emit = defineEmits(["save"]);

function getdata() {
  useSeries.series_edit.author = useUser.user;
  useSeries.series_edit.team = useTeam.team[0];
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
  await useTeam.findOne(route.params.id);
}

onMounted(() => {
  useSeries.series_edit = {
    team: {},
  };
  useStatus.findAll();
  getApi();
});

onUnmounted(() => {
  useSeries.reset();
  useTeam.reset();
});
</script>

<style></style>
