<template>
 <div id="app">
    <NavBar />
    <main>
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
  import NavBar from './components/NavBar.vue'
  import AppFooter from './components/AppFooter.vue';
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from './store/auth'
  import apiClient from './services/apiClient'

  const router = useRouter()
  const authStore = useAuthStore()


  // 페이지 로딩 시 세션 확인
  onMounted(async () => {
    try {
      const response = await apiClient.get('/member/check-session')
        authStore.login(response.data.user)  // 서버에서 받아온 로그인 아이디로 상태 복원
        console.log('로그인된 사용자 아이디:', response.data)

      // TODO: 전역 상태에 저장하고 싶으면 Pinia나 ref 활용 가능
      // 예: loginUser.value = response.data
    } catch (error) {
        authStore.logout()        // 세션 없으면 상태 초기화
        console.log('세션 없음. 로그인 페이지로 이동')
        router.push('/login')
    }
  })

</script>

<style>
/* 기본 스타일 유지 */
</style>