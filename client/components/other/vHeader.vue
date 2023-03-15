<template>
  <div>
    <div class="bg-base-200 pt-1 text-xl px-5">
      <div class="flex justify-between">
        <!-- <nuxt-link to="/" class="btn btn-ghost"> wblogit </nuxt-link> -->
        <div class="flex">
          <button class="btn btn-ghost text-xl">
            <OtherVIcon icon="fa-solid fa-magnifying-glass" />
          </button>
          <div class="sm:flex hidden">
            <input
              type="text"
              placeholder="Tìm kiếm...."
              class="input md:w-96 w-20 input-bordered mx-1"
            />
          </div>
        </div>
        <div class="flex">
          <NotificationVList />
          <OtherVTheme2 />
          <OtherVAvatarDD />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { userStore } from "~~/stores/user.store";
const useUser = userStore();
const useAuth = authStore();

onMounted(() => {
  useAuth.loadAuthState();
  if (useAuth.user) {
    useUser.findOne(useAuth.user.id);
  }
});
</script>
