<template>
  <div class="signup-container">
    <h2>회원가입</h2>
    <form @submit.prevent="handleSignup">
      <div class="form-group">
        <label for="name">아이디</label>
        <input type="name" v-model="name" required placeholder="아이디를 입력하세요"/>
      </div>

      <div class="form-group">
        <label for="name">이름</label>
        <input type="name" v-model="name" required placeholder="이름을 입력하세요"/>
      </div>

      <div class="form-group">
        <label for="name">생년월일</label>
        <Datepicker v-model="birth" :format="'yyyy-MM-dd'" />
      </div>

      <div class="form-group">
        <label for="email">이메일</label>
        <input type="email" v-model="email" required placeholder="이메일을 입력하세요"/>
      </div>

      <div class="form-group">
        <label for="password">비밀번호</label>
        <input type="password" v-model="password" required placeholder="비밀번호를 입력하세요"/>
      </div>

      <div class="form-group">
        <label for="confirm">비밀번호 확인</label>
        <input type="password" v-model="confirmPassword" required placeholder="동일한 비밀번호를 입력하세요"/>
      </div>

      <button type="submit">회원가입</button>
    </form>

    <p class="back-link">
      <router-link to="/">← 로그인으로 돌아가기</router-link>
    </p>
  </div>
</template>

<script setup>
import Datepicker from 'vue3-datepicker'
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const birth = ref(null)

function handleSignup() {
  if (password.value !== confirmPassword.value) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }
  console.log('회원가입 시도:', email.value, password.value)
}
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 16px;
}
label {
  font-weight: bold;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
}
.back-link {
  margin-top: 16px;
  text-align: center;
}
</style>