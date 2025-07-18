import { defineStore } from 'pinia'


export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLogin: false,
    user: null,
  }),
  actions: {
    login(user) {
      this.isLogin = true
      this.user = user
    },
    logout() {
      this.isLogin = false
      this.user = null
    }
  },
  persist: true // 새로고침해도 로그인 유지하려면 pinia-plugin-persist 필요
})