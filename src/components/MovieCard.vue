<template>
  <div class="card">
    <img :src="`/images/${movie.poster}`" alt="영화 포스터" />
    <h3>{{ movie.title }}</h3>
    <router-link :to="`/movies/${movie.id}`">예매하기</router-link>
  </div>
</template>

<script>
export default {
  props: {
    movie: {
      type: Object,
      required: true
    }
  }
}
</script>