<template>
  <div class="flex flex-col">
    nhập câu hỏi để test
    <input class="input input-primary" v-model="q" type="text" />
    <div @click="test()" class="btn btn-primary">test</div>
    <div class="text-2xl italic my-5">
      {{ kq }}
    </div>
  </div>
</template>

<script setup>
const q = ref();
const kq = ref();

// Hàm tính khoảng cách Levenshtein distance giữa 2 chuỗi
function levenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
function findSimilarQuestions(question, allQuestions, threshold) {
  const similarQuestions = [];
  for (const q of allQuestions) {
    const distance = levenshteinDistance(question, q);
    const similarity = 1 - distance / Math.max(question.length, q.length);
    if (similarity >= threshold) {
      similarQuestions.push(q);
    }
  }
  return similarQuestions;
}

// example usage
const allQuestions = [
  "Lập trình là gì?",
  "Ngôn ngữ lập trình phổ biến nhất hiện nay là gì?",
  "Làm thế nào để học lập trình?",
  "Có bao nhiêu loại hình lập trình?",
  "Phần mềm lập trình nào được sử dụng nhiều nhất?",
  "Lập trình viên làm những công việc gì?",
  "Lập trình web cần học những gì?",
  "Học lập trình có khó không?",
  "Lập trình viên làm việc ở đâu?",
  "Lập trình có thể kiếm được nhiều tiền không?",
];

const threshold = 0.4;

function test() {
  kq.value = findSimilarQuestions(q.value, allQuestions, threshold);
}

useHead({
  title: "test",
});
</script>
<style></style>
