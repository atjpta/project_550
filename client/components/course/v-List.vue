<template>
    <div class="mb-5">
        <div v-if="loadingSkeleton">
            <div class="flex flex-wrap my-5 w-fit justify-center">
                <div class="" v-for="i in 8" :key="i.id">
                    <CourseVSkeleton />
                </div>
            </div>
        </div>
        <div v-else>
            <div class="flex flex-wrap my-5 w-fit justify-center">
                <!-- <div @click="test()" class="btn btn-outline">test</div> -->
                <div class="" v-for="i in list" :key="i.id">
                    <CourseVMono class="" :color="color" :data="i" />
                </div>
            </div>
            <!-- btn chuyển trang -->
            <div class="form-control mx-auto w-fit">
                <div class="input-group lg:input-group-md input-group-sm">
                    <button @click="goToPre()" :disabled="selectPage == 1" class="btn lg:btn-md btn-sm">
                        <OtherVIcon class-icon="text-xl" icon="fa-solid fa-angle-left" />
                    </button>
                    <select v-model="selectPage" @change="goToPage()" class="select select-bordered lg:select-md select-sm">
                        <option :value="i" :disabled="i == selectPage" v-for="i in maxPage" :key="i">
                            trang {{ i }}
                        </option>
                    </select>
                    <button @click="goToNext()" :disabled="selectPage == maxPage" class="btn btn-sm lg:btn-md text-2xl">
                        <OtherVIcon class-icon="text-xl" icon="fa-solid fa-angle-right" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { courseStore } from "~/stores/course.store";
import { typecourseStore } from "~/stores/typecourse.store";

const props = defineProps({
    data: Object,
});
const size = 9;
const useCourse = courseStore();
const useTypeCourse = typecourseStore();
const loadingSkeleton = ref(false);
const list = ref([]);
const color = ref("");

const selectPage = ref(1);
const maxPage = ref(1);
let MaxLength = 0;
function goToPage() {
    getApiData();
}

function goToPre() {
    selectPage.value -= 1;
    getApiData();
}

function goToNext() {
    selectPage.value += 1;
    getApiData();
}

async function getApiData() {
    loadingSkeleton.value = true;
    try {
        list.value = await useCourse.findPerPageType(props.data.id, selectPage.value, size);
        loadingSkeleton.value = false;
    } catch (error) {
        console.log(error);
    }
}

async function getApi() {
    loadingSkeleton.value = true;
    try {
        if (props.data?.id) {
            list.value = await useCourse.findPerPageType(props.data.id, selectPage.value, size);
            color.value = useTypeCourse.getRandomColorByKey(props.data.name);
            MaxLength = await useCourse.getMaxLengthType(props.data.id);
            maxPage.value = Math.ceil(MaxLength / size);
        }
    } catch (error) {
        console.log(error);
    } finally {
        loadingSkeleton.value = false;
    }
}

onMounted(() => {
    getApi();
});
</script>

<style></style>
