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
        <div class="flex justify-between">
            <div @click="openInputCmt = !openInputCmt" class="btn btn-sm btn-ghost text-primary my-2">
                Nhập bình luận
                <div class="tooltip ml-2" data-tip="gõ @ để tag tên">
                    <div class="btn-xs btn btn-info btn-outline btn-circle h-1 w-6">
                        <OtherVIcon class-icon="" icon="fa-solid fa-info" />
                    </div>
                </div>
            </div>
            <div>
                <div @click="filterCmt = !filterCmt" class="btn btn-sm btn-ghost mb-2">
                    <div class="tooltip ml-2" data-tip="lọc bình luận">
                        <div class="btn-xs btn btn-info btn-ghost h-1 w-6">
                            <OtherVIcon class-icon="text-primary" icon="fa-solid fa-filter" />
                        </div>
                    </div>
                    {{ filterCmt ? "điểm cao nhất" : "mới nhất" }}
                </div>
            </div>
        </div>
        <div v-if="openInputCmt">
            <CommentsVInputCmt @send="openDialogSignin(send)" :loading="loading" :data="dataInput" :reset="resetInput" />
        </div>

        <div v-if="loadingCmt" class="mb-3">
            <div v-for="(i, n) in 9" :key="i">
                <div class="animate-pulse bg-base-300 h-32 w-full">
                    <div></div>
                </div>
                <div v-if="n < 8" class="divider my-0"></div>
            </div>
        </div>

        <div v-else>
            <div v-for="(i, n) in dataPerPage" :key="i">
                <CommentsVCmt :data="i" />
                <div v-if="n < (dataPerPage.length > size ? size : dataPerPage.length) - 1" class="divider my-0"></div>
            </div>
        </div>

        <!-- btn chuyển trang cmt -->
        <div v-if="dataPerPage.length > 0" class="form-control mx-auto w-fit">
            <div class="input-group lg:input-group-md input-group-sm">
                <button @click="goToPre()" :disabled="selectPage == 1" class="btn btn-sm">
                    <OtherVIcon class-icon="text-xl" icon="fa-solid fa-angle-left" />
                </button>
                <select v-model="selectPage" class="select select-bordered select-sm">
                    <option :value="i" :disabled="i == selectPage" v-for="i in maxPage" :key="i">
                        trang {{ i }}
                    </option>
                </select>
                <button @click="goToNext()" :disabled="selectPage == maxPage" class="btn btn-sm text-2xl">
                    <OtherVIcon class-icon="text-xl" icon="fa-solid fa-angle-right" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { authStore } from "~/stores/auth.store";
import { dialogStore } from "../../../stores/dialog.store";
import { routeStore } from "~/stores/route.store";
import { reviewStore } from "~/stores/review.store";
import { alertStore } from "~/stores/alert.store";
import { cmtStore } from "~/stores/cmt.store";
import { notificationStore } from "~/stores/notification.store";
import { courseStore } from "~/stores/course.store";

const openInputCmt = ref(false);
const openEdit = ref(false);
const useCmt = cmtStore();
const useDialog = dialogStore();
const data = ref({});
const useAuth = authStore();
const route = useRoute();
const useReview = reviewStore();
const useRouteS = routeStore();
const useCourse = courseStore();
const loading = ref(false);
const useAlert = alertStore();
const useNotification = notificationStore();
const filterCmt = ref(false);
const loadingCmt = ref(false);
const size = 9;
const maxPage = computed(() => {
    selectPage.value = 1;
    return Math.ceil(useCmt.list_cmt.length / size);
});
const selectPage = ref(1);

const dataPerPage = computed(() => {
    let list = [];
    let index = size * (selectPage.value - 1);

    for (let i = 0; i < size; i++) {
        if (index < useCmt.list_cmt.length) list.push(useCmt.list_cmt[index]);
        index++;
    }

    return list;
});

function goToPre() {
    selectPage.value -= 1;
}

function goToNext() {
    selectPage.value += 1;
}

const dataInput = ref({
    content: {},
    tagname: [],
});
const resetInput = ref(0);

const send = async () => {
    loading.value = true;
    let list = [];
    dataInput.value.tagname.forEach((e) => {
        list.push(e.id);
    });
    const dataSend = {
        author: useAuth.user.id,
        post: route.params.id,
        content: dataInput.value.content,
        tag_name: list,
    };

    const dataNotification = {
        author: useAuth.user.id,
        model: route.params.id,
        content: `bạn có bình luận mới về môn học "${useCourse.course.name}"`,
        url: route.fullPath,
        type: "info",
        // listTagName: list,
    };

    try {
        if (
            dataSend.content.ops.length > 1 ||
            typeof dataSend.content.ops[0].insert != "string" ||
            dataSend.content.ops[0].insert.trim() != "" ||
            dataSend.tag_name.length
        ) {
            await useCmt.create(dataSend);
            await useNotification.create(dataNotification);
            await useCmt.getBy("post", route.params.id);
            dataInput.value.content = { ops: [{ insert: "\n" }] };
            dataInput.value.tagname = [];
            resetInput.value++;
        } else {
            useAlert.setWarning("hãy nhập bình luận");
        }
    } catch (error) {
        console.log("lỗi gửi cmt");
        console.log(error);
    } finally {
        loading.value = false;
    }
};

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

function openDialogSignin(cb) {
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
        if (cb) {
            cb();
            return;
        }
        openEdit.value = true;
    }
}

watch(filterCmt, async () => {
    if (filterCmt.value) {
        try {
            loadingCmt.value = true;
            await useCmt.getBy("post", route.params.id, "vote");
            loadingCmt.value = false;
        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            loadingCmt.value = true;
            await useCmt.getBy("post", route.params.id, "new");
            loadingCmt.value = false;
        } catch (error) {
            console.log(error);
        }
    }
});

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
        await useCmt.getBy("post", route.params.id);
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
