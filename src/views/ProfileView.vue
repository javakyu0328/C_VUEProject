<template>
  <div class="profile-container">
    <h2>회원 정보</h2>
    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="id">아이디</label>
        <input type="id" v-model="id" />
      </div>
        
      <div class="form-group">
        <label for="name">이름</label>
        <input type="text" v-model="name" />
      </div>

      <div class="form-group">
        <label for="name">생년월일</label>
        <Datepicker v-model="birth" :format="'yyyy-MM-dd'" />
      </div>

      <div class="form-group">
        <label for="email">이메일</label>
        <input type="email" v-model="email" disabled />
      </div>


      <div class="form-group">
        <label for="password">새 비밀번호</label>
        <input type="password" v-model="password" placeholder="변경할 비밀번호" />
      </div>

      <div class="form-group">
        <label for="password">새 비밀번호 확인</label>
        <input type="password" v-model="password" placeholder="변경할 비밀번호 확인" />
      </div>

      <button type="submit">정보 수정</button>
    </form>

    <button class="delete-btn" @click="deleteAccount">회원 탈퇴</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Datepicker from 'vue3-datepicker'


const email = ref('user@example.com') // 실제로는 로그인한 사용자 정보 불러오기
const name = ref('홍길동')
const password = ref('')
const birth = ref(null)

function updateProfile() {
  // 유효성 검사 등 추가 가능
  console.log('회원 정보 수정 요청:', { email: email.value, name: name.value, password: password.value })
  alert('회원 정보 수정 기능은 아직 구현 중입니다.')
}

function deleteAccount() {
  if (confirm('정말 회원 탈퇴 하시겠습니까?')) {
    console.log('회원 탈퇴 요청')
    alert('회원 탈퇴 기능은 아직 구현 중입니다.')
  }
}
</script>

<style scoped>
.profile-container {
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
  margin-top: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
}
.delete-btn {
  background-color: #e74c3c;
  margin-top: 20px;
}
</style>