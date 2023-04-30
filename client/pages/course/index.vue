<template>
    <div>
        <div v-if="!loadingSkeletonMenu">
            <!-- các btn -->
            <div class="tabs">
                <div v-for="i in useTypeCourse.list" :key="i.id" class="">
                    <div @click="selectTab = i.id" :class="[selectTab == i.id ? 'router-link-active tab-active' : '']"
                        class="tab tab-bordered uppercase font-medium">
                        {{ i.name }}
                    </div>
                </div>
            </div>

            <!--dnội dung -->
            <div v-for="i in useTypeCourse.list" :key="i.id" class="">
                <div v-show="i.id == selectTab">
                    <CourseVList :id="i.id" :data="i" />
                </div>
            </div>
        </div>
        <div v-else>
            <div class="flex flex-wrap">
                <div v-for="i in 5" :key="i" class="">
                    <div class="btn btn-sm mr-1 mb-1 w-20 h-6 animate-pulse"></div>
                </div>
            </div>
            <div class="flex flex-wrap my-5 w-fit justify-center">
                <div class="" v-for="i in 8" :key="i.id">
                    <CourseVSkeleton />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { typecourseStore } from "~/stores/typecourse.store";

const useTypeCourse = typecourseStore();
const loadingSkeletonMenu = ref(false);
const selectTab = ref("");
const route = useRoute();

async function getApi() {
    loadingSkeletonMenu.value = true;
    try {
        await useTypeCourse.findAll();
        if (route.hash) {
            selectTab.value = route.hash.slice(1);
        } else {
            selectTab.value = useTypeCourse.list[0].id;
        }
        loadingSkeletonMenu.value = false;
    } catch (error) {
        console.log(error);
    }
}

onMounted(() => {
    getApi();
});

useHead({
    title: "Môn học",
});
</script>

<style></style>
