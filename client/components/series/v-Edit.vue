<template>
  <div :class="!preview
      ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/0'
      : ''
    " class="p-5 rounded-2xl">
    <transition name="bounce">
      <div v-show="preview == false">
        <div class="text-4xl text-center font-extrabold">Chỉnh sửa series</div>
        <!-- tiêu đề -->
        <div>
          <div class="text-xl font-extrabold mt-5">
            Tên series
            <div class="tooltip" data-tip="không được để trống">
              <div class="btn-xs btn btn-ghost rounded-full h-1 w-6">
                <OtherVIcon class-icon="text-error" icon="fa-solid fa-star-of-life" />
              </div>
            </div>
          </div>
          <input v-model="useSeries.series_edit.name" placeholder="nhập tên series" type="text"
            class="input input-primary w-full" />
        </div>

        <!-- ảnh bìa -->
        <div class="text-xl font-extrabold mt-5">
          Biểu tượng series
          <div>
            <ImageVUploadsimple :data="useSeries.series_edit.image_cover_url" />
          </div>
        </div>
        <!-- phần tag của bài viết -->
        <div>
          <div class="text-xl font-extrabold mt-5">
            Chọn tag
            <div class="tooltip" data-tip="tag sẽ được thêm theo tag bài viết">
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

        <!-- chọn trạng thái -->

        <div class="text-xl font-extrabold mt-5 mb-2">Chọn trạng thái</div>
        <div class="w-full max-w-xs">
          <div data-tip="mọi người đều xem được bài viết" class="form-control tooltip w-full">
            <label class="label cursor-pointer">
              <span class="label-text">công khai</span>
              <input @click="useSeries.series_edit.status = 'public'" type="radio" name="radio-10"
                class="radio checked:bg-red-500" :checked="useSeries.series_edit.status == 'public'" />
            </label>
          </div>
          <div data-tip="bài viết chỉ có bạn thấy được" class="form-control tooltip w-full">
            <label class="label cursor-pointer">
              <span class="label-text">riêng tư</span>
              <input :checked="useSeries.series_edit.status == 'private'"
                @click="useSeries.series_edit.status = 'private'" type="radio" name="radio-10"
                class="radio checked:bg-blue-500" />
            </label>
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
          <textarea v-model="useSeries.series_edit.introduce" placeholder="nhập nội dung" type="text"
            class="textarea textarea-primary w-full h-20" />
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
import { teamStore } from "~~/stores/team.store";
import { seriesStore } from "~~/stores/series.store";
import { authStore } from "~~/stores/auth.store";
import { imageStore } from "~~/stores/image.store";
import { statusStore } from "~~/stores/status.store";
import { alertStore } from "~/stores/alert.store";

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
const useAlert = alertStore();
const useTeam = teamStore();
const emit = defineEmits(["save"]);

function getdata() {
  useSeries.series_edit.author = useUser.user;
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
    await useSeries.findOneEdit(route.params.id);
    if (useSeries.series.author._id != useAuth.user.id) {
      useAlert.setWarning("bạn không có quyền truy cập");
      return navigateTo("/");
    }
    useSeries.series_edit = useSeries.series;
  } else {
    useSeries.resetSeriesEdit();
  }
}

onMounted(() => {
  useSeries.reset();
  useTeam.reset();
  useTeam.findByUser(useAuth.user.id);
  useStatus.findAll();
  getApi();
});

onUnmounted(() => {
  useSeries.reset();
  useTeam.reset();
});
</script>

<style></style>
