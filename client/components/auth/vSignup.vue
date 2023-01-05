<template>
  <div class="md:w-96 mx-auto">
    <Form
      @submit="handleRegister"
      :validation-schema="userFormSchema"
      class="bg-base-200 rounded-2xl"
    >
      <div class="text-center text-5xl py-10">Đăng kí</div>
      <div>
        <div class="mx-auto">
          <div class="p-2 flex justify-center px-5 mx-auto">
            <div class="">
              <OtherVIcon class-icon="text-xl mt-2 mr-5" icon="fa-solid fa-user" />
            </div>
            <Field
              v-model="user.username"
              placeholder="nhập tài khoản của bạn"
              name="username"
              type="text"
              class="bg-white/5 border-0 border-b-2 border-primary text-xl mb-5 w-full"
            />
          </div>
          <div class="text-red-900 text-center">
            <ErrorMessage name="username" class="error-feedback" />
          </div>
        </div>

        <div class="mx-auto">
          <div class="p-2 flex justify-center px-5 mx-auto">
            <div class="">
              <OtherVIcon class-icon="text-xl mt-2 mr-5" icon="fa-solid fa-font" />
            </div>
            <Field
              v-model="user.name"
              placeholder="nhập tên của bạn"
              name="name"
              type="text"
              class="bg-white/5 border-0 border-b-2 border-primary text-xl mb-5 w-full"
            />
          </div>
          <div class="text-red-900 text-center">
            <ErrorMessage name="name" class="error-feedback" />
          </div>
        </div>

        <div class="mx-auto">
          <div class="p-2 flex justify-center px-5 mx-auto">
            <div class="">
              <OtherVIcon class-icon="text-xl mt-2 mr-5" icon="fa-solid fa-at" />
            </div>
            <Field
              v-model="user.email"
              placeholder="nhập E-mail của bạn"
              name="email"
              type="text"
              class="bg-white/5 border-0 border-b-2 border-primary text-xl mb-5 w-full"
            />
          </div>
          <div class="text-red-900 text-center">
            <ErrorMessage name="email" class="error-feedback" />
          </div>
        </div>

        <div class="mx-auto">
          <div class="p-2 flex justify-center px-5 mx-auto">
            <div class="">
              <OtherVIcon class-icon="text-xl mt-2 mr-5" icon="fa-solid fa-lock" />
            </div>
            <Field
              v-model="user.password"
              placeholder="nhập mật khẩu của bạn"
              name="password"
              :type="showPassWord"
              class="bg-white/5 border-0 border-b-2 border-primary text-xl mb-5 w-full"
            />
          </div>
          <div class="text-red-900 text-center">
            <ErrorMessage name="password" class="error-feedback" />
          </div>
        </div>

        <div class="mx-auto">
          <div class="p-2 flex justify-center px-5 mx-auto">
            <div class="">
              <OtherVIcon class-icon="text-xl mt-2 mr-5" icon="fa-solid fa-lock" />
            </div>
            <Field
              placeholder="nhập lại mật khẩu của bạn"
              name="repassword"
              :type="showPassWord"
              class="bg-white/5 border-0 border-b-2 border-primary text-xl mb-5 w-full"
            />
          </div>
          <div class="text-red-900 text-center">
            <ErrorMessage name="repassword" class="error-feedback" />
          </div>
        </div>

        <div
          class="text-center cursor-pointer hover:scale-125 duration-300 text-sky-500 hover:text-violet-500"
        >
          <NuxtLink to="/auth/signin" class=""> Đã có tài khoản? </NuxtLink>
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
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const useAuthStore = authStore();
const user = ref({});
const loading = ref(false);
const showPassWord = ref("password");
const userFormSchema = Yup.object().shape({
  username: Yup.string()
    .required("vui lòng điền tài khoản.")
    .min(2, "Tên phải ít nhất 2 ký tự.")
    .max(50, "Tên có nhiều nhất 50 ký tự."),
  name: Yup.string()
    .required("vui lòng điền tên.")
    .min(2, "Tên phải ít nhất 2 ký tự.")
    .max(50, "Tên có nhiều nhất 50 ký tự."),
  email: Yup.string()
    .email("E-mail không đúng.")
    .required("vui lòng điền E-mail.")
    .max(50, "E-mail tối đa 50 ký tự."),
  password: Yup.string()
    .required("vui lòng điền mật khẩu.")
    .min(2, "mật phải ít nhất 2 ký tự."),
  repassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Mật khẩu không đúng!")
    .required("vui lòng điền lại mật khẩu."),
});
async function handleRegister(user) {
  loading.value = true;
  try {
    const data = await useAuthStore.signup(user);
    const redirectPath = route.query.redirect || {
      path: "/auth/signin",
    };
    navigateTo(redirectPath);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
</script>
