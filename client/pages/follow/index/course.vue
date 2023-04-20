<template>
    <div class="mt-5">
        <div v-if="loadingSkeleton" class="space-y-5">
            <div v-for="i in 7" :key="i">
                <QuestionVSkeleton />
            </div>
        </div>
        <div v-else>
            <div class="flex flex-wrap" v-if="usefollow.follow_course[0]">
                <div v-for="i in usefollow.follow_course" :key="i.id">
                    <CourseVMono class="mr-3 mb-3" :data="i.course[0]" />
                </div>
            </div>
            <div v-else>
                <div class="text-center text-2xl my-10">Bạn chưa lưu câu hỏi nào cả !?</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { routeStore } from "~~/stores/route.store";
import { followStore } from "~~/stores/follow.store";

const loadingSkeleton = ref(false);
const useAuth = authStore();
const useRouteS = routeStore();
const usefollow = followStore();
async function getApi() {
    loadingSkeleton.value = true;
    try {
        usefollow.findByMyCourse(useAuth.user.id);
        loadingSkeleton.value = false;
    } catch (error) {
        console.log(error);
    }
}
onMounted(() => {
    useRouteS.cb = getApi;
    getApi();
});
</script>

<style></style>
