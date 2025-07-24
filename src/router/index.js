// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import ProfileView from '../views/ProfileView.vue'
import HomeView from '../views/HomeView.vue'
import MoviesView from '../views/MoviesView.vue'  
import MovieDetailView from '../views/MovieDetailView.vue'  
import InfoView from '../views/InfoView.vue'
import MovieRegistrationView from '../views/MovieRegistrationView.vue'
import AdminView from '../views/AdminView.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', name: 'HomeView', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/signup', name: 'Signup', component: SignupView },
  { path: '/profile', name: 'Profile', component: ProfileView },
  { path: '/movies', name: 'MoviesView', component: MoviesView },
  { path: '/movieDetail', name: 'MovieDetail', component: MovieDetailView },
  { path: '/info', name: 'Info', component: InfoView },
  { path: '/movies/register', name: 'MovieRegistration', component: MovieRegistrationView },
  { 
    path: '/admin', 
    name: 'Admin', 
    component: AdminView,
    meta: { requiresAdmin: true } // 관리자 권한 필요 표시
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/**
 * 네비게이션 가드 추가
 * 페이지 이동 전에 권한 확인
 */
router.beforeEach(async (to, from, next) => {
  // 관리자 권한이 필요한 페이지인 경우
  if (to.meta.requiresAdmin) {
    // 인증 스토어 초기화
    const authStore = useAuthStore();
    
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    if (!authStore.isLogin) {
      console.log('로그인이 필요한 페이지입니다.');
      next({ name: 'Login', query: { redirect: to.fullPath } });
    } 
    // 관리자가 아닌 경우 홈으로 리다이렉트
    else if (authStore.user !== 'admin') {
      console.log('관리자 권한이 필요한 페이지입니다.');
      next({ name: 'HomeView' });
    } 
    // 권한 확인 완료, 페이지 이동 허용
    else {
      next();
    }
  } 
  // 관리자 권한이 필요하지 않은 페이지는 바로 이동
  else {
    next();
  }
});

export default router