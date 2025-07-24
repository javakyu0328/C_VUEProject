<template>
  <div class="admin-view">
    <h1>관리자 페이지</h1>
    <p class="admin-description">이 페이지는 관리자만 접근할 수 있습니다.</p>
    
    <!-- 관리자 데이터 그리드 컴포넌트 -->
    <AdminDataGrid />
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import AdminDataGrid from '../components/admin/AdminDataGrid.vue';

export default {
  name: 'AdminView',
  
  components: {
    AdminDataGrid
  },
  
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    
    // 관리자 권한 확인
    const checkAdminAccess = () => {
      // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
      if (!authStore.isLogin) {
        console.log('로그인이 필요합니다.');
        router.push('/login');
        return false;
      }
      
      // 관리자가 아닌 경우 홈으로 리다이렉트
      if (authStore.user !== 'admin') {
        console.log('관리자 권한이 필요합니다.');
        router.push('/');
        return false;
      }
      
      console.log('관리자 권한 확인 완료');
      return true;
    };
    
    // 컴포넌트 마운트 시 실행
    onMounted(() => {
      // 관리자 권한 확인
      checkAdminAccess();
    });
    
    return {};
  }
};
</script>

<style scoped>
.admin-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 10px;
}

.admin-description {
  color: #666;
  margin-bottom: 30px;
}
</style>