<template>
  <div>
    <div class="text-xl shadow-sm pt-1 bg-base-100">
      <div class="flex justify-between">
        <div class="flex">
          <OtherVNav @click="open = true" />
          <div
            @click="navigateTo('/')"
            class="btn btn-ghost bg-transparent hover:bg-transparent text-2xl font-bold"
          >
            <span
              class="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 relative inline-block"
            >
              <span class="relative text-white">abctu</span>
            </span>
          </div>
        </div>
        <div class="sm:flex hidden">
          <button class="btn btn-ghost text-xl">
            <OtherVIcon icon="fa-solid fa-magnifying-glass" />
          </button>
          <div class="">
            <input
              type="text"
              placeholder="Tìm kiếm...."
              class="input md:w-96 input-bordered mx-1"
            />
          </div>
        </div>
        <div class="flex">
          <NotificationVList v-if="useAuth.user" />
          <OtherVTheme2 />
          <OtherVAvatarDD />
        </div>
      </div>
    </div>
    <div @click="open = false" v-if="open" class="fixed h-screen w-screen"></div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { userStore } from "~~/stores/user.store";
const useUser = userStore();
const useAuth = authStore();
const open = ref(false);

onMounted(() => {
  useAuth.loadAuthState();
  if (useAuth.user) {
    useUser.findOne(useAuth.user.id);
  }
});
</script>
