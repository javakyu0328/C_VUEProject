<template>
  <div class="movie-registration-view">
    <div class="container">
      <div class="header">
        <h1>영화 등록</h1>
        <p class="description">
          새로운 영화 정보를 등록하여 데이터베이스에 추가합니다.
          <br>
          <span class="required-note">* 표시된 항목은 필수 입력 사항입니다.</span>
        </p>
      </div>
      
      <MovieRegistration />
    </div>
  </div>
</template>

<script>
import MovieRegistration from '../components/movie/MovieRegistration.vue';

export default {
  name: 'MovieRegistrationView',
  components: {
    MovieRegistration
  }
};
</script>

<style scoped>
.movie-registration-view {
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: 30px;
  text-align: center;
}

h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
}

.description {
  color: #666;
  font-size: 16px;
  line-height: 1.5;
}

.required-note {
  font-size: 14px;
  color: #e74c3c;
}

@media (max-width: 768px) {
  .movie-registration-view {
    padding: 10px;
  }
  
  .header {
    margin-bottom: 20px;
  }
  
  h1 {
    font-size: 24px;
  }
  
  .description {
    font-size: 14px;
  }
}
</style>