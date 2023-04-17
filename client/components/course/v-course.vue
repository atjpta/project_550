<template>
    <div>
        <div class="indicator w-full">
            <div
                class="bg-gradient-to-r from-info/10 via-info/5 to-pink-500/5 rounded-md border-b-4 border-info p-5 w-full">
                <span
                    class="italic before:h-[98%] before:my-auto py-1 before:block before:absolute before:-inset-1 before:-skew-y-3 before:-skew-x-12 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative inline-block">
                    <span class="relative text-white text-3xl font-black px-3">{{
                        data.name
                    }}</span>
                </span>
                <div class="text-xl indent-8 mt-5">
                    {{ data.introduce || "chưa có mô tả về tag này" }}
                </div>
                <div @click="navigateTo(`/course/#${data.type?._id}`)" class="btn btn-ghost">
                    {{ data.type?.name }}
                </div>
            </div>
            <div class="indicator-item mr-10 mt-10">
                <div v-if="loading != 'save'" @click="openDialogSignin(save)" :class="classSave"
                    class="btn-sm lg:btn-md btn btn-ghost btn-square">
                    <OtherVIcon class-icon="text-xl" icon="fa-solid fa-bookmark" />
                </div>
                <div v-if="loading == 'save'" class="btn-sm lg:btn-md btn btn-circle btn-ghost loading"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "../../stores/dialog.store";
import { followStore } from "~~/stores/follow.store";
const useAuth = authStore();
const useRouteS = routeStore();
const useDialog = dialogStore();
const useFollow = followStore();
const route = useRoute();
const loading = ref("");

const props = defineProps({
    data: Object,
});

const classSave = computed(() => {
    if (useAuth.user) {
        if (useFollow.follow) {
            return "text-primary";
        }
    }
    return "";
});

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
                user: props.data.id,
                follow: useAuth.user.id,
            };
            await useFollow.create(data);
        } else {
            await useFollow.deleteOne(useFollow.follow.id);
        }
        await getFollow();
        loading.value = "";
    } catch (error) {
        console.log(erorr);
        console.log("lỗi save");
    } finally {
        loading.value = "";
    }
};

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
                useRouteS.redirectedFrom = route.fullPath;
            }
        );
    } else {
        cb();
    }
}

onMounted(() => {
    getFollow();
});
</script>

<style></style>
