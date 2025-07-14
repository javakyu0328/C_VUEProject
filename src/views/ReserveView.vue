<template>
  <div>
    <h2>좌석 선택</h2>
    <SeatSelector @confirm="handleReserve" />
  </div>
</template>

<script setup>
import SeatSelector from '../components/SeatSelector.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

function handleReserve(selectedSeats) {
  alert(`예매 완료! 선택 좌석: ${selectedSeats.join(', ')}`)
  // 여기서 axios로 예매 정보 백엔드 전송 가능
}
</script>