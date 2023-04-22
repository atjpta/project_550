<template>
    <div>
        <PostVEditC @save="save" :loading="loading" />
    </div>
</template>

<script setup>
import { imageStore } from "~~/stores/image.store";
import { postStore } from "~~/stores/post.store";
import { tagStore } from "~~/stores/tag.store";
import { alertStore } from "~~/stores/alert.store";
import { notificationStore } from "~~/stores/notification.store";
import { courseStore } from "~/stores/course.store";

const useAlert = alertStore();
const useImage = imageStore();
const useTag = tagStore();
const usePost = postStore();
const useNotification = notificationStore();
const useCourse = courseStore();
const route = useRoute();
let post;
const loading = ref(false);

function formatData(listtag) {
    const data = {
        author: post.author.id,
        content: post.content,
        status: "public",
        title: post.title,
        course: post.course.id,
        image_cover_url: useImage.url ?? post.image_cover_url,
    };
    if (listtag) {
        const array = Array.from(post.tag);
        const tag = listtag;
        array.forEach((e) => {
            tag.push(e.id);
        });
        data.tag = tag;
    } else {
        const array = Array.from(post.tag);
        const tag = [];
        array.forEach((e) => {
            tag.push(e.id);
        });
        data.tag = tag;
    }
    return data;
}

async function save() {
    post = usePost.post_edit;
    if (!(post.content.ops[0].insert != "\n" && post.title)) {
        useAlert.setError("phải nhập đủ tiêu đề và nội dung");
        return;
    }
    loading.value = true;

    const dataNotification = {
        model: route.params.id,
        content: `bạn có bài viết mới trong môn học "${useCourse.course.name}"`,
        url: `/course/${useCourse.course.id}/post`,
        type: "info",
    };

    try {
        const listtag = await useTag.createAll(post.tag);
        const data = formatData(listtag);
        if (useImage.url) {
            await useImage.uploadImage();
            data.image_cover_url = useImage.url;
        }
        const id = await usePost.create(data);
        usePost.resetPostEdit();
        await useNotification.create(dataNotification);
        useRouter().back();
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
}
definePageMeta({
    middleware: "guest",
});

useHead({
    title: "tạo bài viết",
});
</script>

<style></style>
