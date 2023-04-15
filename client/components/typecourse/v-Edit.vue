<template>
  <div>
    <div class="rounded-2xl bg-base-100 mx-auto">
      <div
        class="hover:bg-gradient-to-l bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl p-5">
        <div class="text-center text-3xl font-extrabold uppercase">chỉnh sửa</div>
        <div>
          <div class="text-xl font-extrabold mt-5">
            Tên
            <div class="tooltip" data-tip="không được để trống">
              <div class="btn-xs btn btn-ghost rounded-full h-1 w-6">
                <OtherVIcon class-icon="text-error" icon="fa-solid fa-star-of-life" />
              </div>
            </div>
          </div>

          <input v-model="data.name" placeholder="nhập tên thể loại..." type="text" class="input input-primary w-full" />
        </div>

        <div>
          <div class="text-xl font-extrabold mt-5">
            Ảnh
            <div class="tooltip" data-tip="không được để trống">
              <div class="btn-xs btn btn-ghost rounded-full h-1 w-6">
                <OtherVIcon class-icon="text-error" icon="fa-solid fa-star-of-life" />
              </div>
            </div>
          </div>

          <UploadVUploadSimple :data="data.url_image" />
        </div>

        <div class="flex mt-10 space-x-1 justify-end">
          <div @click="save()" :class="loading ? 'loading' : ''" class="btn btn-primary btn-sm">
            lưu
          </div>
          <div @click="router.back()" class="btn btn-error btn-sm btn-ghost">Hủy</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: Object,
  loading: Boolean,
});
const emit = defineEmits(["save"]);
const router = useRouter();
function save() {
  emit("save");
}
</script>

<style></style>
