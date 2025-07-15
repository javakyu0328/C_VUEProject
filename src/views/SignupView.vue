<template>
  <div class="signup-container">
    <h2>회원가입</h2>
    <form @submit.prevent="handleSignup">
      <div class="form-group">
        <label for="id">아이디</label>
        <input type="text" v-model="id" required placeholder="아이디를 입력하세요"/>
        <div v-if="idCheckResult === 'ok'" style="color:green;">사용 가능한 아이디입니다.</div>
        <div v-else-if="idCheckResult === 'no'" style="color:red;">이미 사용 중인 아이디입니다.</div>
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
import axios from 'axios'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

const id = ref('')
const idCheckResult = ref(null) // 'ok' or 'no' or null
const name = ref('')
const email = ref('')
const birth = ref('')
const password = ref('')
const confirmPassword = ref('')
const router = useRouter()


function handleSignup() {
  if (password.value !== confirmPassword.value) {
    alert('비밀번호가 일치하지 않습니다!')
    return
  }

  if (idCheckResult.value =="no"){
    alert('아이디 중복 확인을 해주세요!')
    return
  }
  submitForm()
  console.log('회원가입 시도:', id.value, email.value)
}



//회원가입 시 아이디 유효성 검사 
const checkId = async () => {
  if (!id.value.trim()) {
    idCheckResult.value = null
    return
  }

  try {
    const response = await axios.post('http://localhost:8083/api/member/id-check', null, {
      params: {
        id: id.value
      }
    })
    idCheckResult.value = response.data
    console.log('아이디 중복 검사 결과:', response.data)
  } catch (error) {
    console.error('아이디 중복 검사 에러:', error)
    idCheckResult.value = null
  }
}

// 아이디 입력 시마다 자동 검사
watch(id, () => {
  checkId()
})

//회원가입 데이터 전송
const submitForm = async() => {
  try{
    const response = await axios.post('http://localhost:8083/api/member/save',{
      id: id.value,
      name: name.value,
      email: email.value,
      birth: birth.value,
      password:password.value
    });
    console.log('회원가입 응답:',response.data);
    if(response.data === 'ok'){
      alert("회원가입 성공! 로그인 페이지로 이동합니다.")
      router.push('/login') //Vue Router로 이동
    }
  }catch(error){
    alert('에러발생:'+error.message)
  }
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