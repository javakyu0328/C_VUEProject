<template>
  <div class="seats">
    <div
      v-for="seat in seats"
      :key="seat"
      class="seat"
      :class="{ selected: selected.includes(seat) }"
      @click="toggle(seat)"
    >
      {{ seat }}
    </div>
    <button @click="$emit('confirm', selected)">예매 확정</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const seats = Array.from({ length: 25 }, (_, i) => `A${i + 1}`)
const selected = ref([])

function toggle(seat) {
  if (selected.value.includes(seat)) {
    selected.value = selected.value.filter(s => s !== seat)
  } else {
    selected.value.push(seat)
  }
}
</script>

<style scoped>
.seats {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  max-width: 200px;
}
.seat {
  width: 40px;
  height: 40px;
  background: lightgray;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
}
.selected {
  background: tomato;
  color: white;
}
</style>