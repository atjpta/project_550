<template>
  <div class="glass ring-0">
    <div class="text-xl shadow-sm pt-1">
      <div class="flex justify-between">
        <div class="flex">
          <OtherVNav class="" @click="open = true" />
          <div @click="navigateTo('/')" class="btn btn-ghost bg-transparent hover:bg-transparent font-black text-white">
            <!-- logo -->
            <span
              class="before:ring-8 before:ring-indigo-500/20 hover:before:translate-x-2 hover:before:rotate-180 before:duration-500 before:rounded-tr-none before:rounded-bl-rounded-tr-none translate before:block before:absolute before:-inset-1 before:skew-y-12 before:skew-x-12 before:bg-gradient-to-r before:from-green-500 before:via-teal-500/50 before:to-blue-500 relative inline-block">
              <span
                class="before:ring-8 before:ring-pink-500/20 hover:before:-translate-x-2 hover:before:-rotate-180 before:duration-500 before:rounded-tl-rounded-tr-none before:rounded-br-rounded-tr-none before:block before:absolute before:-inset-1 before:-skew-y-12 before:-skew-x-12 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500/50 before:to-pink-500 relative inline-block">
                <span class="relative italic px-2">abctu</span>
              </span>
            </span>
          </div>
        </div>
        <div class="sm:flex hidden form-control w-1/2 relative">
          <div class="input-group">
            <input v-if="route.path.slice(0, 7) != '/search'" v-model="useSearch.key" type="text" placeholder="Tìm kiếm…"
              class="input input-bordered w-lg w-full" />

            <input v-else disabled type="text" placeholder="Tìm kiếm…" class="input input-bordered w-lg" />

            <button class="btn btn-square">
              <OtherVIcon icon="fa-solid fa-magnifying-glass" />
            </button>
          </div>
          <SearchVDataSearch v-if="useSearch.key.length > 0 && route.path.slice(0, 7) != '/search'"
            class="absolute top-14" />
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
import { searchStore } from "~~/stores/search.store";
import { userStore } from "~~/stores/user.store";
const useUser = userStore();
const useAuth = authStore();
const open = ref(false);
const useSearch = searchStore();
const route = useRoute();

onMounted(() => {
  useAuth.loadAuthState();
  if (useAuth.user) {
    useUser.findOne(useAuth.user.id);
  }
  useSearch.getApi();
});
</script>
