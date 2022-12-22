<template>
  <div class="w-96 lg:w-3/5 p-5 mx-auto">
    <Form
      @submit="handleLogin"
      :validation-schema="FormSchema"
      class="bg-base-200 rounded-2xl"
    >
      <div class="text-center text-5xl py-10">Đăng nhập</div>

      <div>
        <div class="mx-auto">
          <div class="p-2 flex mx-auto w-11/12 lg:w-3/5">
            <div class="">
            <OtherVIcon class-icon="text-xl mt-2 mr-5" icon="fa-solid fa-user"/>

            </div>
            <Field
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

        <div class="p-2 flex justify-center w-11/12 lg:w-3/5 mx-auto">
          <div class="">
            <OtherVIcon class-icon="text-xl mt-2 mr-5" icon="fa-solid fa-lock"/>
          </div>
          <Field
            placeholder="nhập password bạn"
            name="password"
            type="password"
            class="bg-white/5 border-0 border-b-2 border-primary text-xl mb-5 w-full"
          />
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
          <button :class="[loading ? 'loading' :'']" class="btn btn-primary btn-outline w-44">
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
import { routeStore } from "~~/stores/route.store"

const useRoute = routeStore()
const useAuth = authStore();
const useAlertStore = alertStore();
const loading = ref()
const FormSchema = Yup.object().shape({
  username: Yup.string()
    .required("Tên phải có giá trị.")
    .min(2, "Tên phải ít nhất 2 ký tự.")
    .max(50, "Tên có nhiều nhất 50 ký tự."),
  password: Yup.string()
    .required("mật khẩu phải có giá trị.")
    .min(2, "mật phải ít nhất 2 ký tự."),
});

async function handleLogin(user) {
  loading.value = true
  try {
    await useAuth.signin(user);

    const redirectPath = useRoute.redirectedFrom || {
      path: "/",
    };
    navigateTo(redirectPath)
  } catch (err) {
    console.log(err);
  }
  finally { 
    loading.value = false
  }
}



onMounted(() => { 
})
</script>
