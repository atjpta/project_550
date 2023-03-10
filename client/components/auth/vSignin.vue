<template>
  <div class="md:w-96 mx-auto">
    <Form @submit="handleLogin" :validation-schema="FormSchema">
      <div class="text-center text-5xl py-10">Đăng nhập</div>

      <div>
        <div class="mx-auto">
          <div class="p-2 flex justify-center px-5 mx-auto">
            <div class="">
              <OtherVIcon class-icon="text-xl mt-2 mr-5" icon="fa-solid fa-user" />
            </div>
            <Field
              placeholder="tài khoản"
              name="username"
              type="text"
              class="bg-white/5 border-0 border-b-2 border-primary text-xl mb-5 w-full"
            />
          </div>
          <div class="text-red-900 text-center">
            <ErrorMessage name="username" class="error-feedback" />
          </div>
        </div>

        <div class="p-2 flex justify-center px-5 mx-auto relative">
          <div class="">
            <OtherVIcon class-icon="text-xl mt-2 mr-5" icon="fa-solid fa-lock" />
          </div>
          <Field
            placeholder="mật khẩu"
            name="password"
            :type="showPassWord"
            class="bg-white/5 border-0 border-b-2 border-primary text-xl mb-5 w-full"
          />
          <div @click="show()" class="btn btn-sm btn-ghost absolute w-fit right-5">
            <OtherVIcon
              v-if="showPassWord == 'password'"
              class-icon="text-xl "
              icon="fa-solid fa-eye"
            />
            <OtherVIcon
              v-if="showPassWord == 'text'"
              class-icon="text-xl "
              icon="fa-solid fa-eye-slash"
            />
          </div>
        </div>
        <div class="text-red-900 text-center">
          <ErrorMessage name="password" class="error-feedback" />
        </div>

        <div
          class="text-center cursor-pointer hover:scale-125 duration-300 text-sky-500 hover:text-violet-500"
        >
          <NuxtLink to="/auth/signup" class=""> Chưa có tài khoản? </NuxtLink>
        </div>

        <div class="p-5 text-center">
          <button
            :class="[loading ? 'loading' : '']"
            class="btn btn-primary btn-outline w-44"
          >
            đăng nhập
          </button>
        </div>
      </div>
    </Form>
  </div>
</template>

<script setup>
import * as Yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { authStore } from "@/stores/auth.store";
import { alertStore } from "@/stores/alert.store";
import { routeStore } from "~~/stores/route.store";
import { userStore } from "~~/stores/user.store";
import { notificationStore } from "~~/stores/notification.store";

const useNotification = notificationStore();
const useRoute = routeStore();
const useAuth = authStore();
const useUser = userStore();
const useAlertStore = alertStore();
const loading = ref();
const showPassWord = ref("password");
const FormSchema = Yup.object().shape({
  username: Yup.string()
    .required("vui lòng điền tài khoản.")
    .min(2, "Tên phải ít nhất 2 ký tự.")
    .max(50, "Tên có nhiều nhất 50 ký tự."),
  password: Yup.string()
    .required("vui lòng điền mật khẩu.")
    .min(2, "mật phải ít nhất 2 ký tự."),
});

async function handleLogin(user) {
  loading.value = true;
  try {
    await useAuth.signin(user);
    useUser.findOne(useAuth.user.id);
    await useNotification.findByMy(useAuth.user.id);
    const redirectPath = useRoute.redirectedFrom || {
      path: "/",
    };

    navigateTo(redirectPath);
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
}

function show() {
  if (showPassWord.value == "text") {
    showPassWord.value = "password";
  } else showPassWord.value = "text";
}

onMounted(() => {});
</script>
