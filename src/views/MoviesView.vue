<template>
  <div>
    <h2>현재 상영 중인 영화</h2>
    <div class="movie-list">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
      />
    </div>
  </div>
</template>

<script setup>
import MovieCard from '../components/MovieCard.vue'

const movies = [
  { id: 1, title: '범죄도시4', poster: 'crime4.jpg' },
  { id: 2, title: '인사이드 아웃2', poster: 'insideout2.jpg' },
  { id: 3, title: '쿵푸팬더4', poster: 'kungfu4.jpg' }
]
</script>