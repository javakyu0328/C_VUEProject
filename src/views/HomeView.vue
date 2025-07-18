<template>
  <div class="home-view">
    <!-- 메인 배너 섹션 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>영화의 모든 것</h1>
        <p>다양한 영화 정보를 한눈에 확인하고 추천해보세요</p>
        <router-link to="/movies" class="browse-button">영화 둘러보기</router-link>
      </div>
    </section>
    
    <!-- 최신 영화 섹션 -->
    <section class="movie-section">
      <div class="section-header">
        <h2>최신 등록 영화</h2>
        <router-link to="/movies" class="view-all-link">
          더 보기
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </router-link>
      </div>
      
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>영화 목록을 불러오는 중...</p>
      </div>
      
      <div v-else-if="latestMovies.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
          <line x1="7" y1="2" x2="7" y2="22"></line>
          <line x1="17" y1="2" x2="17" y2="22"></line>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <line x1="2" y1="7" x2="7" y2="7"></line>
          <line x1="2" y1="17" x2="7" y2="17"></line>
          <line x1="17" y1="17" x2="22" y2="17"></line>
          <line x1="17" y1="7" x2="22" y2="7"></line>
        </svg>
        <p>등록된 영화가 없습니다.</p>
      </div>
      
      <div v-else class="movie-grid">
        <MovieCard 
          v-for="movie in latestMovies" 
          :key="movie.id" 
          :movie="movie"
          @click="handleMovieClick"
          @recommend="handleRecommend"
        />
      </div>
    </section>
    
    <!-- 추천 영화 섹션 -->
    <section class="movie-section recommended-section">
      <div class="section-header">
        <h2>인기 추천 영화</h2>
        <router-link to="/movies" class="view-all-link">
          더 보기
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </router-link>
      </div>
      
      <div v-if="loadingRecommended" class="loading-container">
        <div class="loading-spinner"></div>
        <p>추천 영화를 불러오는 중...</p>
      </div>
      
      <div v-else-if="recommendedMovies.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <p>추천 영화가 없습니다.</p>
      </div>
      
      <div v-else class="movie-grid">
        <MovieCard 
          v-for="movie in recommendedMovies" 
          :key="movie.id" 
          :movie="movie"
          @click="handleMovieClick"
          @recommend="handleRecommend"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMovieStore } from '../stores/movie';
import MovieCard from '../components/movie/MovieCard.vue';
import { notificationService } from '../services';

export default defineComponent({
  name: 'HomeView',
  
  components: {
    MovieCard
  },
  
  setup() {
    const router = useRouter();
    const movieStore = useMovieStore();
    
    // 상태 변수
    const latestMovies = ref([]);
    const recommendedMovies = ref([]);
    const loading = ref(false);
    const loadingRecommended = ref(false);
    const error = ref(null);
    
    // 최신 영화 목록 불러오기
    const fetchLatestMovies = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        await movieStore.fetchMovies();
        latestMovies.value = movieStore.movies.slice(0, 6); // 최대 6개만 표시
      } catch (err) {
        error.value = '영화 목록을 불러오는데 실패했습니다.';
        console.error('영화 목록 로드 오류:', err);
      } finally {
        loading.value = false;
      }
    };
    
    // 추천 영화 목록 불러오기
    const fetchRecommendedMovies = async () => {
      loadingRecommended.value = true;
      
      try {
        await movieStore.fetchRecommendedMovies();
        recommendedMovies.value = movieStore.recommendedMovies;
      } catch (err) {
        console.error('추천 영화 로드 오류:', err);
      } finally {
        loadingRecommended.value = false;
      }
    };
    
    // 영화 클릭 처리
    const handleMovieClick = (movie) => {
      router.push(`/movies/${movie.id}`);
    };
    
    // 추천 처리
    // eslint-disable-next-line no-unused-vars
    const handleRecommend = ({ movieId, recommended }) => {
      const message = recommended 
        ? '영화를 추천했습니다.' 
        : '영화 추천을 취소했습니다.';
      
      notificationService.success(message);
    };
    
    // 컴포넌트 마운트 시 영화 목록 불러오기
    onMounted(() => {
      fetchLatestMovies();
      fetchRecommendedMovies();
    });
    
    return {
      latestMovies,
      recommendedMovies,
      loading,
      loadingRecommended,
      error,
      handleMovieClick,
      handleRecommend
    };
  }
});
</script>

<style scoped>
.home-view {
  padding-bottom: 40px;
}

.hero-section {
  background-color: #2c3e50;
  background-size: cover;
  background-position: center;
  color: white;
  padding: 80px 20px;
  text-align: center;
  margin-bottom: 40px;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 42px;
  margin-bottom: 20px;
}

.hero-content p {
  font-size: 18px;
  margin-bottom: 30px;
  opacity: 0.9;
}

.browse-button {
  display: inline-block;
  background-color: #e74c3c;
  color: white;
  padding: 12px 24px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s;
}

.browse-button:hover {
  background-color: #c0392b;
}

.movie-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  margin-bottom: 60px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 24px;
  color: #333;
}

.view-all-link {
  display: flex;
  align-items: center;
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.view-all-link:hover {
  color: #2c6cb0;
}

.view-all-link svg {
  margin-left: 5px;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 25px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #4a90e2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #666;
  text-align: center;
}

.empty-state svg {
  margin-bottom: 20px;
  color: #ddd;
}

.recommended-section {
  background-color: #f9f9f9;
  padding: 40px 20px;
  margin: 0 -20px;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 60px 15px;
  }
  
  .hero-content h1 {
    font-size: 32px;
  }
  
  .hero-content p {
    font-size: 16px;
  }
  
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px;
  }
  
  .section-header h2 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 40px 15px;
  }
  
  .hero-content h1 {
    font-size: 28px;
  }
  
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }
}
</style>