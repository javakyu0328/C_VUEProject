<template>
  <div class="movie-card-skeleton">
    <!-- 포스터 스켈레톤 -->
    <div class="poster-skeleton pulse"></div>
    
    <!-- 정보 스켈레톤 -->
    <div class="info-skeleton">
      <div class="title-skeleton pulse"></div>
      
      <div class="meta-skeleton">
        <div class="genre-skeleton pulse"></div>
        <div class="date-skeleton pulse"></div>
      </div>
      
      <div class="description-skeleton">
        <div class="line-skeleton pulse"></div>
        <div class="line-skeleton pulse"></div>
        <div class="line-skeleton pulse short"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieCardSkeleton'
};
</script>

<style scoped>
.movie-card-skeleton {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%;
}

.poster-skeleton {
  width: 100%;
  padding-top: 150%; /* 2:3 비율 (영화 포스터 표준) */
  background-color: #f0f0f0;
}

.info-skeleton {
  padding: 15px;
  flex-grow: 1;
}

.title-skeleton {
  height: 24px;
  width: 80%;
  background-color: #f0f0f0;
  margin-bottom: 15px;
  border-radius: 4px;
}

.meta-skeleton {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.genre-skeleton {
  height: 16px;
  width: 60px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.date-skeleton {
  height: 16px;
  width: 100px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.description-skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.line-skeleton {
  height: 14px;
  width: 100%;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.line-skeleton.short {
  width: 60%;
}

/* 펄스 애니메이션 */
.pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .title-skeleton {
    height: 20px;
  }
  
  .genre-skeleton,
  .date-skeleton,
  .line-skeleton {
    height: 12px;
  }
}
</style>