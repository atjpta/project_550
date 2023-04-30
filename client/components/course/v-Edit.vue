<template>
  <div>
    <div class="rounded-2xl bg-base-100 mx-auto">
      <div
        class="rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-5 item"
      >
        <div class="text-center text-4xl">Chỉnh sửa môn học</div>

        <!-- tên môn học -->
        <div>
          <div class="text-2xl mt-5">
            Tên
            <div class="tooltip" data-tip="Không được để trống">
              <div class="btn-xs btn btn-ghost rounded-full h-1 w-6">
                <OtherVIcon class-icon="text-error" icon="fa-solid fa-star-of-life" />
              </div>
            </div>
          </div>
          <input
            v-model="data.name"
            placeholder="Nhập tên..."
            type="text"
            class="input input-primary w-full text-base"
          />
        </div>

        <!-- loại môn học -->
        <div>
          <div class="text-2xl mt-5">
            Loại môn học
            <div class="tooltip" data-tip="Không được để trống">
              <div class="btn-xs btn btn-ghost rounded-full h-1 w-6">
                <OtherVIcon class-icon="text-error" icon="fa-solid fa-star-of-life" />
              </div>
            </div>
          </div>
          <select
            v-model="data.type"
            class="select-sm select select-primary w-full max-w-xs text-base"
          >
            <option :value="{}" disabled>Chọn</option>
            <option
              :value="i.id"
              :disabled="i.id == data.type"
              v-for="i in useTypeCourse.list"
              :key="i"
            >
              {{ i.name }}
            </option>
          </select>
        </div>

        <!-- mô tả môn học -->
        <div>
          <div class="text-2xl mt-5">
            Mô tả
            <div class="tooltip" data-tip="Không được để trống">
              <div class="btn-xs btn btn-ghost rounded-full h-1 w-6">
                <OtherVIcon class-icon="text-error" icon="fa-solid fa-star-of-life" />
              </div>
            </div>
          </div>
          <textarea
            v-model="data.introduce"
            placeholder="Nhập mô tả ..."
            type="text"
            class="textarea textarea-primary w-full text-base"
          />
        </div>

        <div class="flex mt-10 space-x-1 justify-end">
          <div
            @click="save()"
            :class="loading ? 'loading' : ''"
            class="btn btn-primary btn-sm"
          >
            Lưu
          </div>
          <div @click="router.back()" class="btn text-error btn-sm btn-ghost">Hủy</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { typecourseStore } from "~/stores/typecourse.store";

const props = defineProps({
  data: Object,
  loading: Boolean,
});
const useTypeCourse = typecourseStore();
const emit = defineEmits(["save"]);
const router = useRouter();
function save() {
  emit("save");
}

async function getApi() {
  try {
    await useTypeCourse.findAll();
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  getApi();
});
</script>

<style></style>
