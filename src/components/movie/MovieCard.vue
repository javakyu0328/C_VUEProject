<template>
  <div 
    class="movie-card" 
    :class="{ 'hover-effect': enableHover }"
    @click="handleCardClick"
  >
    <!-- 포스터 이미지 -->
    <div class="poster-container">
      <img 
        v-if="posterUrl" 
        :src="posterUrl" 
        :alt="movie.title + ' 포스터'" 
        class="poster-image"
        @error="handleImageError"
      />
      <div v-else class="poster-placeholder">
        <div class="placeholder-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
            <line x1="7" y1="2" x2="7" y2="22"></line>
            <line x1="17" y1="2" x2="17" y2="22"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <line x1="2" y1="7" x2="7" y2="7"></line>
            <line x1="2" y1="17" x2="7" y2="17"></line>
            <line x1="17" y1="17" x2="22" y2="17"></line>
            <line x1="17" y1="7" x2="22" y2="7"></line>
          </svg>
        </div>
        <span>이미지 없음</span>
      </div>
      
      <!-- 추천 수 배지 -->
      <div v-if="showRecommendationCount && movie.recommendationCount > 0" class="recommendation-badge">
        <span class="recommendation-count">{{ movie.recommendationCount }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </div>
    </div>
    
    <!-- 영화 정보 -->
    <div class="movie-info">
      <h3 class="movie-title">{{ movie.title }}</h3>
      
      <div class="movie-meta">
        <span v-if="movie.genre" class="movie-genre">{{ movie.genre }}</span>
        <span v-if="movie.releaseDate" class="movie-release-date">{{ formattedReleaseDate }}</span>
      </div>
      
      <p v-if="movie.description && showDescription" class="movie-description">
        {{ truncatedDescription }}
      </p>
      
      <router-link v-if="showReserveButton" :to="`/movies/${movie.id}`" class="reserve-button">예매하기</router-link>
    </div>
    
    <!-- 추천 버튼 -->
    <button 
      v-if="showRecommendButton"
      type="button" 
      class="recommend-button" 
      :class="{ 'recommended': movie.recommendedByCurrentUser, 'recommending': isRecommending }"
      @click.stop="toggleRecommendation"
      :disabled="isRecommending"
      :aria-label="movie.recommendedByCurrentUser ? '추천 취소하기' : '추천하기'"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        :fill="movie.recommendedByCurrentUser ? '#e74c3c' : 'none'" 
        :stroke="movie.recommendedByCurrentUser ? '#e74c3c' : 'currentColor'" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        class="heart-icon"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <span v-if="showRecommendationCount" class="recommendation-count">{{ movie.recommendationCount || 0 }}</span>
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useMovieStore } from '../../stores/movie';
import { notificationService, fileUploadService, utilService } from '../../services';

export default {
  name: 'MovieCard',
  
  props: {
    /**
     * 영화 데이터
     */
    movie: {
      type: Object,
      required: true
    },
    
    /**
     * 설명 표시 여부
     */
    showDescription: {
      type: Boolean,
      default: true
    },
    
    /**
     * 추천 버튼 표시 여부
     */
    showRecommendButton: {
      type: Boolean,
      default: true
    },
    
    /**
     * 추천 수 표시 여부
     */
    showRecommendationCount: {
      type: Boolean,
      default: true
    },
    
    /**
     * 예매 버튼 표시 여부
     */
    showReserveButton: {
      type: Boolean,
      default: true
    },
    
    /**
     * 호버 효과 활성화 여부
     */
    enableHover: {
      type: Boolean,
      default: true
    },
    
    /**
     * 설명 최대 길이
     */
    descriptionMaxLength: {
      type: Number,
      default: 100
    }
  },
  
  emits: ['click', 'recommend'],
  
  setup(props, { emit }) {
    const movieStore = useMovieStore();
    const isRecommending = ref(false);
    const useDefaultPoster = ref(false);
    
    // 포스터 URL 계산
    const posterUrl = computed(() => {
      if (useDefaultPoster.value) {
        return fileUploadService.getDefaultImageUrl('poster');
      }
      
      // 기존 포스터 형식 지원
      if (props.movie.poster) {
        return `/images/${props.movie.poster}`;
      }
      
      // 새로운 포스터 URL 형식 지원
      if (props.movie.posterUrl) {
        return props.movie.posterUrl;
      }
      
      return fileUploadService.getDefaultImageUrl('poster');
    });
    
    // 개봉일 포맷팅
    const formattedReleaseDate = computed(() => {
      return props.movie.releaseDate ? utilService.formatDate(props.movie.releaseDate) : '';
    });
    
    // 설명 텍스트 자르기
    const truncatedDescription = computed(() => {
      return props.movie.description 
        ? utilService.truncateText(props.movie.description, props.descriptionMaxLength) 
        : '';
    });
    
    // 카드 클릭 처리
    const handleCardClick = () => {
      emit('click', props.movie);
    };
    
    // 이미지 로드 오류 처리
    const handleImageError = () => {
      useDefaultPoster.value = true;
    };
    
    // 추천 토글 처리
    const toggleRecommendation = async () => {
      if (isRecommending.value) return;
      
      isRecommending.value = true;
      
      try {
        await movieStore.toggleRecommendation(props.movie.id);
        emit('recommend', {
          movieId: props.movie.id,
          recommended: props.movie.recommendedByCurrentUser
        });
      } catch (error) {
        notificationService.error(error.message || '영화 추천 중 오류가 발생했습니다.');
      } finally {
        isRecommending.value = false;
      }
    };
    
    return {
      posterUrl,
      formattedReleaseDate,
      truncatedDescription,
      isRecommending,
      handleCardClick,
      handleImageError,
      toggleRecommendation
    };
  }
};
</script>

<style scoped>
.movie-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
}

.hover-effect:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

.poster-container {
  position: relative;
  width: 100%;
  padding-top: 150%; /* 2:3 비율 (영화 포스터 표준) */
  overflow: hidden;
}

.poster-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.hover-effect:hover .poster-image {
  transform: scale(1.05);
}

.poster-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #999;
}

.placeholder-icon {
  margin-bottom: 10px;
}

.recommendation-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 20px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: bold;
}

.movie-info {
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.movie-title {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}

.movie-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 14px;
}

.movie-genre {
  color: #4a90e2;
  font-weight: 500;
}

.movie-release-date {
  color: #666;
}

.movie-description {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.reserve-button {
  display: inline-block;
  background-color: #4a90e2;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  transition: background-color 0.2s;
  margin-top: auto;
}

.reserve-button:hover {
  background-color: #3a80d2;
}

.recommend-button {
  position: absolute;
  bottom: 15px;
  right: 15px;
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: transparent;
  border: none;
  color: #999;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recommend-button:hover {
  color: #e74c3c;
  transform: scale(1.1);
}

.recommend-button.recommended {
  color: #e74c3c;
}

.recommend-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.recommend-button .heart-icon {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.recommend-button:hover .heart-icon {
  transform: scale(1.2);
}

.recommend-button.recommended .heart-icon {
  animation: heartbeat 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.recommend-button.recommending .heart-icon {
  animation: pulse 1s infinite;
}

.recommendation-count {
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(0.9);
  }
  75% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .movie-title {
    font-size: 16px;
  }
  
  .movie-meta,
  .movie-description {
    font-size: 12px;
  }
  
  .recommendation-badge {
    padding: 3px 8px;
    font-size: 12px;
  }
  
  .reserve-button {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>