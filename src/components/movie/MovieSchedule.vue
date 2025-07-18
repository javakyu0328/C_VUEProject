<template>
  <div>
    <h3>상영 시간 선택</h3>
    <ul>
      <li v-for="s in schedules" :key="s.time">
        <router-link :to="`/reserve/${movieId}?date=${s.date}&time=${s.time}`">
          {{ s.date }} | {{ s.time }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps(['schedules', 'movieId'])
</script>