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
  }
})