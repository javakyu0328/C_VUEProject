<template>
  <div class="movies-view">
    <div class="page-header">
      <h1>영화 목록</h1>
      <p>모든 영화를 한눈에 살펴보세요</p>
    </div>
    
    <MovieList 
      @movie-click="handleMovieClick"
      @recommend="handleRecommend"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import MovieList from '../components/movie/MovieList.vue';
import { notificationService } from '../services';

export default defineComponent({
  name: 'MoviesView',
  
  components: {
    MovieList
  },
  
  setup() {
    const router = useRouter();
    
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
    
    return {
      handleMovieClick,
      handleRecommend
    };
  }
});
</script>

<style scoped>
.movies-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h1 {
  font-size: 32px;
  margin-bottom: 10px;
  color: #333;
}

.page-header p {
  font-size: 16px;
  color: #666;
}

@media (max-width: 768px) {
  .movies-view {
    padding: 15px;
  }
  
  .page-header h1 {
    font-size: 28px;
  }
}
</style>