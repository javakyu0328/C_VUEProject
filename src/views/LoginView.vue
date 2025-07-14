<template>
  <div class="login-container">
    <h2>로그인</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="memberid">아이디</label>
        <input
          type="id"
          id="memberid"
          v-model="memberid"
          required
          placeholder="아이디를 입력하세요"
        />
      </div>

      <div class="form-group">
        <label for="password">비밀번호</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      <button type="submit">로그인</button>
    </form> 

    <p class="signup-link">
      아직 회원이 아니신가요?
      <router-link to="/signup">회원가입</router-link>
    </p>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const memberid = ref('')
const password = ref('')

function handleLogin() {
  if (!memberid.value || !password.value) {
    alert('아이디와 비밀번호를 모두 입력해주세요.')
    return
  }

  console.log('로그인 시도:', memberid.value, password.value)
}
</script>

<style scoped>
.login-container {
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
  display: block;
  margin-bottom: 6px;
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
  font-size: 16px;
}
</style>