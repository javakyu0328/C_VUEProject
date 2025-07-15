<template>
  <section>
    <h1>추천 영화</h1>
    <div class="banner">
      <!-- 큰 배너 이미지 또는 추천영화 -->
      <img src="/images/banner.jpg" alt="추천 영화 배너" />
    </div>

    <h2>현재 상영작</h2>
    <div class="movie-list">
      <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
    </div>
  </section>
</template>

<script>
import MovieCard from '@/components/MovieCard.vue'

export default {
  components: { MovieCard },
  data() {
    return {
      movies: [
        { id: 1, title: "영화 A", poster: "poster1.jpg" },
        { id: 2, title: "영화 B", poster: "poster2.jpg" },
        { id: 3, title: "영화 C", poster: "posterC.jpg" },
        // 원하는 영화 데이터 추가
      ]
    }
  }
}
</script>

<style scoped>
.banner img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
}
.movie-list {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}
</style>