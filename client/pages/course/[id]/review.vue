<template>
    <div class="bg-gradient-to-l from-info/10 via-info/5 to-pink-500/5 rounded-md p-5">
        <!-- phần edit review -->
        <div v-if="openEdit">
            <div class="text-3xl font-extrabold text-center">chỉnh sửa đánh giá</div>
            <ReviewVEdit :data="data" />
            <div class="flex justify-end space-x-1">
                <div @click="save()" :class="loading ? 'loading' : ''" class="btn btn-primary btn-sm">
                    lưu
                </div>
                <div @click="openEdit = false" class="btn btn-ghost btn-sm text-error">hủy</div>
            </div>
        </div>
        <!-- phần review -->
        <div v-else>
            <div class="text-end">
                <div @click="openDialogSignin()" class="btn btn-outline btn-success btn-sm">
                    <div v-if="data.id">đánh giá lại</div>
                    <div v-else>đánh giá</div>
                </div>
            </div>
            <ReviewVReview :data="useReview.review" />
        </div>
        <!-- phần cmt -->
    </div>
</template>

<script setup>
import { authStore } from "~/stores/auth.store";
import { dialogStore } from "../../../stores/dialog.store";
import { routeStore } from "~/stores/route.store";
import { reviewStore } from "~/stores/review.store";
import { alertStore } from "~/stores/alert.store";

const openEdit = ref(false);
const useDialog = dialogStore();
const data = ref({});
const useAuth = authStore();
const route = useRoute();
const useReview = reviewStore();
const useRouteS = routeStore();
const loading = ref(false);
const useAlert = alertStore();

async function save() {
    loading.value = true;
    try {
        if (data.value.id) {
            await useReview.update(data.value);
            useAlert.setSuccess("đánh giá lại thành công");
        } else {
            await useReview.create(data.value);
            await getEdit();
            useAlert.setSuccess("đánh giá thành công");
        }
        await getApi();
        openEdit.value = false;
        loading.value = false;
    } catch (error) {
        useAlert.setError("đánh giá thất bại, hãy thử lại sau!!");
        console.log(error);
    }
}

function openDialogSignin() {
    if (!useAuth.isUserLoggedIn) {
        useDialog.showDialog(
            {
                title: "Thông báo cực căng!",
                content: "bạn cần đăng nhập để tạo bài viết",
                btn1: "đăng nhập",
                btn2: "hủy",
            },
            () => {
                useRouteS.redirectedFrom = route.fullPath;
                return navigateTo("/auth/signin");
            }
        );
    } else {
        openEdit.value = true;
    }
}

async function getEdit() {
    try {
        data.value = {
            author: useAuth.user?.id,
            course: route.params.id,
            level: 0,
            quality: 0,
            useful: 0,
            importance: 0,
            popularity: 0,
        };
        if (useAuth.user) {
            data.value = await useReview.findOneEdit(useAuth.user.id, route.params.id);
        }
    } catch (error) {
        console.log(error);
    }
}

async function getApi() {
    try {
        await useReview.findAvg(route.params.id);
    } catch (error) {
        console.log(error);
    }
}

onMounted(() => {
    getEdit();
    getApi();
});
</script>

<style></style>
