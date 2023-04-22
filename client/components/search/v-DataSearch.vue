<template>
  <div class="w-full bg-base-100">
    <transition name="bounce">
      <div
        class="hover:bg-gradient-to-l bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 h-72 p-5 rounded-2xl overflow-y-auto space-y-2">
        <div v-if="useSearch.loadingSkeleton" class="space-y-2">
          <div v-for="i in 5" :key="i" class="h-12 w-full bg-base-300 animate-pulse"></div>
        </div>

        <div v-if="sumLength && !useSearch.loadingSkeleton" class="text-center">
          không có dữ liệu
        </div>

        <!-- course -->
        <div class="w-full space-y-2">
          <div v-for="i in useSearch.list_search_course" :key="i.id">
            <div @click="navigateTo(`/course/${i.id}/review`)"
              class="bg-base-100 shadow-sm shadow-primary flex h-12 rounded-md p-2 cursor-pointer">
              <div data-tip="môn học" class="mr-5 tooltip text">
                <OtherVIcon icon="fa-solid fa-book" />
              </div>
              <div class="overflow-hidden truncate">
                {{ i.name }}
              </div>
            </div>
          </div>
        </div>
        <!-- post -->
        <div class="w-full space-y-2">
          <div v-for="i in useSearch.list_search_post" :key="i._id">
            <div @click="goTo('post', i._id, i)"
              class="bg-base-100 shadow-sm shadow-primary flex h-12 rounded-md p-2 cursor-pointer">
              <div data-tip="bài viết" class="mr-5 tooltip text">
                <OtherVIcon icon="fa-solid fa-file-lines" />
              </div>
              <div class="overflow-hidden truncate">
                {{ i.title }}
              </div>
            </div>
          </div>
        </div>
        <!-- series -->

        <div class="w-full space-y-2">
          <div v-for="i in useSearch.list_search_series" :key="i._id">
            <div @click="goTo('series', i._id)"
              class="bg-base-100 shadow-sm shadow-primary flex h-12 rounded-md p-2 cursor-pointer">
              <div data-tip="chuỗi bài viết" class="mr-5 tooltip text">
                <OtherVIcon icon="fa-solid fa-layer-group" />
              </div>
              <div class="overflow-hidden truncate">
                {{ i.name }}
              </div>
            </div>
          </div>
        </div>
        <!-- question -->

        <div class="w-full space-y-2">
          <div v-for="i in useSearch.list_search_question" :key="i._id">
            <div @click="goTo('question', i._id, i)"
              class="bg-base-100 shadow-sm shadow-primary flex h-12 rounded-md p-2 cursor-pointer">
              <div data-tip="câu hỏi" class="mr-5 tooltip text">
                <OtherVIcon icon="fa-solid fa-file-circle-question" />
              </div>
              <div class="overflow-hidden truncate">
                {{ i.title }}
              </div>
            </div>
          </div>
        </div>
        <!-- topic -->

        <div class="w-full space-y-2">
          <div v-for="i in useSearch.list_search_topic" :key="i._id">
            <div @click="goTo('topic', i._id)"
              class="bg-base-100 shadow-sm shadow-primary flex h-12 rounded-md p-2 cursor-pointer">
              <div data-tip="chủ đề" class="mr-5 tooltip text">
                <OtherVIcon icon="fa-solid fa-layer-group" />
              </div>
              <div class="overflow-hidden truncate">
                {{ i.name }}
              </div>
            </div>
          </div>
        </div>
        <!-- user -->

        <div class="w-full space-y-2">
          <div v-for="i in useSearch.list_search_user" :key="i._id">
            <div @click="goTo('user', i._id)"
              class="bg-base-100 shadow-sm shadow-primary flex h-12 rounded-md p-2 cursor-pointer">
              <div data-tip="người dùng" class="mr-5 tooltip text">
                <OtherVIcon icon="fa-solid fa-users" />
              </div>
              <div class="overflow-hidden truncate">
                {{ i.name }}
              </div>
            </div>
          </div>
        </div>
        <!-- team -->

        <div class="w-full space-y-2">
          <div v-for="i in useSearch.list_search_team" :key="i._id">
            <div @click="goTo('team', i._id)"
              class="bg-base-100 shadow-sm shadow-primary flex h-12 rounded-md p-2 cursor-pointer">
              <div data-tip="nhóm" class="mr-5 tooltip text">
                <OtherVIcon icon="fa-solid fa-building-user" />
              </div>
              <div class="overflow-hidden truncate">
                {{ i.name }}
              </div>
            </div>
          </div>
        </div>
        <!-- tag -->

        <div class="w-full space-y-2">
          <div v-for="i in useSearch.list_search_tag" :key="i._id">
            <div @click="goTo('tag', i._id)"
              class="bg-base-100 shadow-sm shadow-primary flex h-12 rounded-md p-2 cursor-pointer">
              <div data-tip="tag" class="mr-5 tooltip text">
                <OtherVIcon icon="fa-solid fa-tag" />
              </div>
              <div class="overflow-hidden truncate">
                {{ i.name }}
              </div>
            </div>
          </div>
        </div>
        <!-- end -->
      </div>
    </transition>
  </div>
</template>

<script setup>
import { authStore } from "~/stores/auth.store";
import { postStore } from "~/stores/post.store";
import { questionStore } from "~/stores/question.store";
import { searchStore } from "~~/stores/search.store";

const useSearch = searchStore();
const usePost = postStore();
const useQuestion = questionStore();
const useAuth = authStore();
const sumLength = computed(() => {
  return (
    useSearch.list_search_post.length +
    useSearch.list_search_question.length +
    useSearch.list_search_series.length +
    useSearch.list_search_topic.length +
    useSearch.list_search_user.length +
    useSearch.list_search_team.length +
    useSearch.list_search_course.length +
    useSearch.list_search_tag.length ==
    0
  );
});

async function goReadPost(post) {
  if (useAuth.user && useAuth.user.id == post.author[0]._id) {
  } else {
    try {
      await usePost.update({
        id: post._id,
        view: post.view + 1,
      });
      post.view += 1;
    } catch (error) {
      console.log(error);
    }
  }
}

async function goReadQ(q) {
  if (useAuth.user && useAuth.user.id == q.author[0]._id) {
  } else {
    try {
      await usePost.update({
        id: q._id,
        view: q.view + 1,
      });
      q.view += 1;
    } catch (error) {
      console.log(error);
    }
  }
}

function goTo(type, id, model) {
  if (type == "post") {
    goReadPost(model);
  }
  if (type == "question") {
    goReadPost(model);
  }
  navigateTo(`/${type}/${id}`);
}
</script>

<style></style>
