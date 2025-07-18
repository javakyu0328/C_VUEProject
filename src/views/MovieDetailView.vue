<template>
  <div>
    <h2>{{ movie.title }}</h2>
    <p>영화 설명: {{ movie.description }}</p>

    <MovieSchedule :schedules="schedules" :movieId="movie.id" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import MovieSchedule from '../components/movie/MovieSchedule.vue'

const route = useRoute()
const movieId = route.params.id

const movie = ref({
  id: movieId,
  title: '범죄도시4',
  description: '마석도 형사의 맨주먹 액션이 돌아왔다!'
})

const schedules = ref([
  { date: '2025-07-15', time: '14:00' },
  { date: '2025-07-15', time: '18:00' },
  { date: '2025-07-16', time: '16:00' }
])
</script>