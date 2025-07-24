<template>
  <div class="profile-container">
    <h2>회원 정보</h2>
    
    <div v-if="loading" class="loading">
      로딩 중...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="fetchProfile">다시 시도</button>
    </div>
    
    <div v-else>
      <form @submit.prevent="updateProfile">
        <div class="form-group">
          <label for="id">아이디</label>
          <input type="text" id="id" v-model="id" readonly />
        </div>
          
        <div class="form-group">
          <label for="name">이름</label>
          <input type="text" id="name" v-model="name" />
        </div>

        <div class="form-group">
          <label for="birth">생년월일</label>
          <Datepicker id="birth" v-model="birth" :format="'yyyy-MM-dd'" />
        </div>

        <div class="form-group">
          <label for="email">이메일</label>
          <input type="email" id="email" v-model="email" disabled />
        </div>

        <div class="form-group">
          <label for="currentPasswordForUpdate">현재 비밀번호 (정보 수정 시 필요)</label>
          <input type="password" id="currentPasswordForUpdate" v-model="currentPasswordForUpdate" required />
        </div>

        <button type="submit" :disabled="loading">정보 수정</button>
      </form>

      <div class="password-section">
        <h3>비밀번호 변경</h3>
        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label for="currentPassword">현재 비밀번호</label>
            <input type="password" id="currentPassword" v-model="currentPassword" required />
          </div>
          
          <div class="form-group">
            <label for="newPassword">새 비밀번호</label>
            <input type="password" id="newPassword" v-model="newPassword" required />
            <small v-if="newPassword && newPassword.length < 4" class="error-text">
              비밀번호는 4자 이상이어야 합니다.
            </small>
          </div>

          <div class="form-group">
            <label for="confirmPassword">새 비밀번호 확인</label>
            <input type="password" id="confirmPassword" v-model="confirmPassword" required />
            <small v-if="confirmPassword && newPassword !== confirmPassword" class="error-text">
              비밀번호가 일치하지 않습니다.
            </small>
          </div>

          <button type="submit" :disabled="loading || !isPasswordFormValid">비밀번호 변경</button>
        </form>
      </div>

      <button class="delete-btn" @click="showDeleteConfirm" :disabled="loading">회원 탈퇴</button>
      
      <div v-if="showDeleteForm" class="delete-form">
        <h3>회원 탈퇴 확인</h3>
        <p>탈퇴하시면 모든 정보가 삭제되며 복구할 수 없습니다.</p>
        <form @submit.prevent="deleteAccount">
          <div class="form-group">
            <label for="deletePassword">비밀번호 확인</label>
            <input type="password" id="deletePassword" v-model="deletePassword" required />
          </div>
          <div class="button-group">
            <button type="submit" class="delete-confirm-btn">탈퇴하기</button>
            <button type="button" @click="cancelDelete" class="cancel-btn">취소</button>
          </div>
        </form>
      </div>
    </div>
    
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Datepicker from 'vue3-datepicker'
import { useMemberStore } from '../stores/member'
import { useAuthStore } from '../stores/auth'
import apiClient from '../services/apiClient' // 커스텀 axios 인스턴스 사용

// 라우터 및 스토어 초기화
const router = useRouter()
const memberStore = useMemberStore()
const authStore = useAuthStore()

// 상태 변수
const id = ref('')
const email = ref('')
const name = ref('')
const birth = ref(null)
const loading = ref(false)
const error = ref(null)
const successMessage = ref('')
const currentPasswordForUpdate = ref('')

// 비밀번호 변경 관련 변수
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// 회원탈퇴 관련 변수
const showDeleteForm = ref(false)
const deletePassword = ref('')

// 비밀번호 폼 유효성 검사
const isPasswordFormValid = computed(() => {
  return currentPassword.value && 
         newPassword.value && 
         confirmPassword.value && 
         newPassword.value === confirmPassword.value && 
         newPassword.value.length >= 4
})

// 컴포넌트 마운트 시 프로필 정보 로드
onMounted(async () => {
  // 로그인 상태 확인
  if (!authStore.isLogin) {
    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    router.push('/login')
    return
  }
  
  try {
    // 세션 확인 API 호출
    await apiClient.get('/member/check-session')
    // axios는 오류 시 자동으로 예외를 발생시키므로 별도의 상태 확인이 필요 없음
    
    await fetchProfile()
  } catch (err) {
    console.error('세션 확인 오류:', err)
    router.push('/login')
  }
})

// 프로필 정보 가져오기
async function fetchProfile() {
  loading.value = true
  error.value = null
  
  try {
    // 먼저 로그인 ID 가져오기
    await memberStore.fetchMemberInfo()
    const memberInfo = memberStore.getMemberInfo
    
    if (memberInfo && memberInfo.id) {
      id.value = memberInfo.id
      
      // 로그인 ID로 사용자 정보 조회
      const response = await apiClient.get(`/member/${id.value}`)
      
      // axios는 오류 시 자동으로 예외를 발생시키므로 별도의 상태 확인이 필요 없음
      const userData = response.data
      
      // 사용자 정보 설정
      email.value = userData.email || ''
      name.value = userData.name || ''
      
      // 생년월일이 문자열로 오는 경우 Date 객체로 변환
      if (userData.birth) {
        birth.value = new Date(userData.birth)
      }
    }
  } catch (err) {
    error.value = '회원 정보를 불러오는데 실패했습니다. ' + (err.message || '')
    console.error('프로필 로드 오류:', err)
  } finally {
    loading.value = false
  }
}

// 회원 정보 수정
async function updateProfile() {
  loading.value = true
  error.value = null
  successMessage.value = ''
  
  try {
    // 생년월일 포맷 변환 (yyyy-MM-dd)
    let birthStr = ''
    if (birth.value) {
      const d = new Date(birth.value)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      birthStr = `${year}-${month}-${day}`
    }
    
    const memberData = {
      id: id.value,
      name: name.value,
      birth: birthStr,
      email: email.value,
      password: currentPasswordForUpdate.value // 현재 비밀번호를 사용하여 인증
    }
    
    await memberStore.updateMemberInfo(memberData)
    successMessage.value = '회원 정보가 성공적으로 수정되었습니다.'
    
    // 3초 후 성공 메시지 숨기기
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    error.value = '회원 정보 수정에 실패했습니다. ' + (err.message || '')
    console.error('회원 정보 수정 오류:', err)
  } finally {
    loading.value = false
  }
}

// 비밀번호 변경
async function changePassword() {
  if (!isPasswordFormValid.value) return
  
  loading.value = true
  error.value = null
  successMessage.value = ''
  
  try {
    const passwordData = {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value
    }
    
    await memberStore.changePassword(passwordData)
    successMessage.value = '비밀번호가 성공적으로 변경되었습니다.'
    
    // 입력 필드 초기화
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    
    // 3초 후 성공 메시지 숨기기
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    error.value = '비밀번호 변경에 실패했습니다. ' + (err.message || '')
    console.error('비밀번호 변경 오류:', err)
  } finally {
    loading.value = false
  }
}

// 회원탈퇴 확인 대화상자 표시
function showDeleteConfirm() {
  showDeleteForm.value = true
}

// 회원탈퇴 취소
function cancelDelete() {
  showDeleteForm.value = false
  deletePassword.value = ''
}

// 회원탈퇴 실행
async function deleteAccount() {
  if (!deletePassword.value) return
  
  loading.value = true
  error.value = null
  
  try {
    await memberStore.deleteAccount(deletePassword.value)
    
    // 로그아웃 처리
    authStore.logout()
    
    // 세션 정리를 위해 서버에 로그아웃 요청 보내기
    try {
      await apiClient.get('/member/logout')
    } catch (e) {
      console.error('로그아웃 API 호출 실패:', e)
    }
    
    // 로컬 스토리지에서 회원 정보 삭제
    localStorage.removeItem('member-store')
    localStorage.removeItem('auth')
    
    // 세션 스토리지에서 회원 정보 삭제
    sessionStorage.clear()
    
    // 회원탈퇴 성공 시 홈페이지로 리다이렉트
    alert('회원탈퇴가 성공적으로 처리되었습니다.')
    router.push('/')
  } catch (err) {
    error.value = '회원탈퇴에 실패했습니다. ' + (err.message || '')
    console.error('회원탈퇴 오류:', err)
    showDeleteForm.value = false
  } finally {
    loading.value = false
    deletePassword.value = ''
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  position: relative;
}
.form-group {
  margin-bottom: 16px;
}
label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background-color: #a8d5c2;
  cursor: not-allowed;
}
.delete-btn {
  background-color: #e74c3c;
  margin-top: 20px;
}
.password-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
.loading {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #666;
}
.error {
  color: #e74c3c;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #e74c3c;
  border-radius: 4px;
  background-color: #fadbd8;
}
.error-text {
  color: #e74c3c;
  font-size: 0.8em;
  margin-top: 5px;
  display: block;
}
.success-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #42b983;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 1000;
}
.delete-form {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #e74c3c;
  border-radius: 4px;
  background-color: #fadbd8;
}
.button-group {
  display: flex;
  gap: 10px;
}
.delete-confirm-btn {
  background-color: #e74c3c;
  flex: 1;
}
.cancel-btn {
  background-color: #7f8c8d;
  flex: 1;
}
</style>