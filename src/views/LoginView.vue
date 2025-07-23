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
import { useRouter } from 'vue-router' //프론트앤드-백앤드 연결
import { useAuthStore } from '@/store/auth'  // 이거 빠지면 오류남
import apiClient from '@/services/apiClient' // 커스텀 axios 인스턴스 사용


const memberid = ref('')
const password = ref('')
const router = useRouter() //프론트앤드-백앤드 연결
const authStore = useAuthStore()

async function handleLogin() {
  if (!memberid.value || !password.value) {
    alert('아이디와 비밀번호를 모두 입력해주세요.')
    return
  }

  try {
    const response = await apiClient.post('/member/login',
      {
        id: memberid.value,
        password: password.value
      }
    )

  if (response.status === 200 && response.data.result === 'ok') {
      alert('로그인 성공!');
      //await fetchLoginUser(); // 세션에서 로그인 아이디 재확인
      // 로그인 성공 → 사용자 정보 다시 요청해서 저장
      const userRes = await apiClient.get('/member/me')

      authStore.login(userRes.data) // Pinia 상태에 저장
      router.push('/'); // 홈으로 이동
  } else {
      alert('로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.');
  }
  } catch (error) {
      if (error.response && error.response.status === 401) {
          alert('로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.');
      } else {
          alert('서버 오류가 발생했습니다. 나중에 다시 시도해주세요.');
      }
      console.error(error);
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