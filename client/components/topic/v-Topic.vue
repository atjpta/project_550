<template>
  <div>
    <transition name="bounce">
      <div class="rounded-2xl">
        <div
          class="glass rounded-2xl ring-0 p-2 my-2 lg:flex justify-between sticky top-14"
        >
          <div class="w-fit">
            <nuxtLink
              class="hover:text-sky-500 hover:scale-110 duration-500"
              :to="`/user/${author?._id}/overview`"
            >
              <!-- tác giả -->
              <div class="flex">
                <div class="avatar">
                  <div class="w-12 h-12 rounded-full">
                    <img :src="author?.avatar_url" />
                  </div>
                </div>
                <div class="text-2xl mx-3">
                  {{ author?.name }}
                </div>
              </div>
            </nuxtLink>
          </div>
          <!-- các btn -->
          <div class="flex mt-1">
            <div class="tooltip" data-tip="lưu topic">
              <div
                v-if="loading != 'save'"
                @click="openDialogSignin(save)"
                :class="classSave"
                class="btn-sm lg:btn-md btn btn-ghost btn-square"
              >
                <OtherVIcon class-icon="text-xl" icon="fa-solid fa-bookmark" />
              </div>
              <div
                v-if="loading == 'save'"
                class="btn-sm lg:btn-md btn btn-circle btn-ghost loading"
              ></div>
            </div>

            <!-- thông báo  -->
            <div
              v-if="useFollow.follow && useAuth.user"
              class="ml-1 tooltip"
              :data-tip="
                useFollow.follow.notification ? 'tắt thông báo' : 'bật thông báo'
              "
            >
              <div
                @click="setOnAndoff()"
                :class="loading == 'notification' ? 'loading' : ''"
                class="btn-sm lg:btn-md btn btn-ghost btn-square"
              >
                <OtherVIcon
                  class-icon="text-xl text-warning"
                  :icon="
                    useFollow.follow.notification
                      ? 'fa-solid fa-bell-slash'
                      : 'fa-solid fa-bell'
                  "
                />
              </div>
            </div>

            <div class="tooltip" data-tip="điểm series">
              <div class="btn-sm lg:btn-md btn btn-ghost">
                <OtherVIcon
                  class-icon="text-xl mr-1 text-warning"
                  icon="fa-solid fa-star"
                />
                <div class="text-2xl">{{ data.valScore }}</div>
              </div>
            </div>
            <div class="tooltip" data-tip="điểm series">
              <div class="btn-sm lg:btn-md btn btn-ghost">
                <OtherVIcon
                  class-icon="text-xl mr-1 text-info"
                  icon="fa-solid fa-file-lines"
                />
                <div class="text-2xl">{{ valQuestion }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex">
          <!-- ảnh team -->
          <div class="mx-auto min-w-max w-32 min-h-max h-32 mr-3">
            <img
              class="rounded-2xl w-32 h-32"
              :src="useImage.previewImage || data.image_cover_url"
              alt=""
            />
          </div>
          <div class="w-full">
            <div class="flex justify-between">
              <div>
                <!-- tên team -->
                <div class="text-2xl font-bold uppercase">
                  {{ data.name }}
                </div>
              </div>
            </div>
            <!-- giới thiệu -->
            <div class="text-xl">{{ data.introduce }}</div>
            <!-- tag -->
            <div class="mt-4 flex">
              <div v-for="i in list_tag" :key="i._id" class="">
                <nuxt-link
                  :to="`/tag/${i._id}/post`"
                  class="btn btn-outline btn-sm mr-1 mt-1"
                  >{{ "#" + i.name }}</nuxt-link
                >
              </div>
            </div>
          </div>
        </div>
        <!-- phần team -->
        <div v-if="data.team?.length > 0" class="mt-5">
          <div class="text-2xl font-semibold">Nhóm</div>
          <nuxtLink
            :to="`/team/${data.team[0]._id}/read/post`"
            class="btn btn-ghost justify-start"
            >{{ data.team[0]?.name }}</nuxtLink
          >
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { dialogStore } from "~~/stores/dialog.store";
import { followStore } from "~~/stores/follow.store";
import { imageStore } from "~~/stores/image.store";
import { postStore } from "~~/stores/post.store";
import { routeStore } from "~~/stores/route.store";
const useImage = imageStore();
const loading = ref("");
const useFollow = followStore();
const route = useRoute();
const useAuth = authStore();
const useRouteS = routeStore();
const props = defineProps({
  data: Object,
});

const classSave = computed(() => {
  if (useAuth.user) {
    if (props.data.author) {
      if (props.data.author[0]?._id == useAuth.user.id) {
        return "btn-disabled";
      }
    }
    if (useFollow.follow) {
      return "text-primary";
    }
  }
  return "";
});

const list_tag = computed(() => {
  let list = [];
  if (props.data.listtag?.length > 0) {
    props.data.listtag.forEach((e) => {
      e.forEach((ee) => {
        check(list, ee);
      });
    });
  }
  return list;
});

function check(list, tag) {
  let mark = 0;
  list.forEach((e) => {
    if (e._id == tag._id) {
      mark = 1;
      return;
    }
  });
  if (mark == 0) {
    list.push(tag);
  }
}
const author = computed(() => {
  if (props.data.author) {
    return props.data.author[0];
  }
  return null;
});

const valQuestion = computed(() => {
  if (props.data.question && props.data.question.length > 0) {
    return props.data.question[0].count;
  }
  return 0;
});

function openDialogSignin(cb) {
  if (!useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn cần đăng nhập để dùng chức năng",
        btn1: "đăng nhập",
        btn2: "hủy",
      },
      () => {
        navigateTo("/auth/signin");
        useRouteS.redirectedFrom = `/series/${props.data._id}`;
      }
    );
  } else {
    cb();
  }
}

async function getFollow() {
  if (useAuth.user?.id) {
    await useFollow.findByFollow(route.params.id, useAuth.user.id);
  }
}

const save = async () => {
  try {
    loading.value = "save";
    if (!useFollow.follow) {
      const data = {
        user: props.data._id,
        follow: useAuth.user.id,
      };
      await useFollow.create(data);
    } else {
      await useFollow.deleteOne(useFollow.follow.id);
    }
    await useFollow.findByFollow(route.params.id, useAuth.user.id);
  } catch (error) {
    console.log(erorr);
    console.log("lỗi save");
  } finally {
    loading.value = "";
  }
};

async function setOnAndoff() {
  try {
    const data = {
      id: useFollow.follow.id,
      notification: true,
    };
    loading.value = "notification";
    if (useFollow.follow.notification) {
      data.notification = false;
    }
    await useFollow.update(data);
    await getFollow();
  } catch (error) {
    console.log(erorr);
    console.log("lỗi save");
  } finally {
    loading.value = "";
  }
}

onMounted(() => {
  getFollow();
});
</script>
