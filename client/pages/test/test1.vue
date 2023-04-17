<template>
  <suspense @fallback="test2()">
    <!-- Async component here -->
    <template #default>
      <!-- Sync loading state component here -->
      <div>
        {{ data }}
      </div>
    </template>

    <template #fallback>
      <!-- Sync loading state component here -->
      <div>loading</div>
    </template>
  </suspense>
</template>

<script setup>
import { typecourseStore } from "~/stores/typecourse.store";
const useTypeCourse = typecourseStore();
const data = ref();
await test();

function test2() {
  console.log("egfoufo");
}
async function test() {
  await setTimeout(async () => {
    data.value = await useTypeCourse.findAll();
  }, 2000);
}
</script>
<style></style>
