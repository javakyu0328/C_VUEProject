<template>
  <div class="movie-registration">
    <h2 class="title">영화 등록</h2>
    
    <form @submit.prevent="submitForm" class="movie-form">
      <!-- 제목 입력 필드 -->
      <div class="form-group" :class="{ 'has-error': errors.title }">
        <label for="title">영화 제목 *</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          class="form-control"
          placeholder="영화 제목을 입력하세요"
          @blur="validateField('title')"
        />
        <div v-if="errors.title" class="error-message">{{ errors.title }}</div>
      </div>
      
      <!-- 장르 선택 필드 -->
      <div class="form-group" :class="{ 'has-error': errors.genre }">
        <label for="genre">장르</label>
        <select
          id="genre"
          v-model="form.genre"
          class="form-control"
          @blur="validateField('genre')"
        >
          <option value="">장르 선택</option>
          <option v-for="genre in genres" :key="genre" :value="genre">
            {{ genre }}
          </option>
        </select>
        <div v-if="errors.genre" class="error-message">{{ errors.genre }}</div>
      </div>
      
      <!-- 개봉일 입력 필드 -->
      <div class="form-group" :class="{ 'has-error': errors.releaseDate }">
        <label for="releaseDate">개봉일</label>
        <input
          id="releaseDate"
          v-model="form.releaseDate"
          type="date"
          class="form-control"
          @blur="validateField('releaseDate')"
        />
        <div v-if="errors.releaseDate" class="error-message">{{ errors.releaseDate }}</div>
      </div>
      
      <!-- 설명 입력 필드 -->
      <div class="form-group" :class="{ 'has-error': errors.description }">
        <label for="description">영화 설명</label>
        <textarea
          id="description"
          v-model="form.description"
          class="form-control"
          rows="4"
          placeholder="영화에 대한 설명을 입력하세요"
          @blur="validateField('description')"
        ></textarea>
        <div class="character-count" :class="{ 'limit-reached': isDescriptionLimitReached }">
          {{ form.description.length }} / {{ maxDescriptionLength }}
        </div>
        <div v-if="errors.description" class="error-message">{{ errors.description }}</div>
      </div>
      
      <!-- 포스터 URL 입력 필드 -->
      <div class="form-group" :class="{ 'has-error': errors.posterUrl }">
        <label for="posterUrl">포스터 이미지 URL</label>
        <input
          id="posterUrl"
          v-model="form.posterUrl"
          type="text"
          class="form-control"
          placeholder="포스터 이미지 URL을 입력하세요"
          @blur="validateField('posterUrl')"
        />
        
        <div class="url-info">
          <p>※ 이미지 URL은 다음 형식을 권장합니다:</p>
          <ul>
            <li>상대 경로: <code>/images/movie-poster.jpg</code></li>
            <li>절대 경로: <code>https://example.com/images/movie-poster.jpg</code> (CORS 정책에 따라 제한될 수 있음)</li>
            <li>이미지 호스팅 서비스: <code>https://i.imgur.com/abcdef.jpg</code></li>
          </ul>
        </div>
        
        <!-- 포스터 미리보기 -->
        <div v-if="form.posterUrl" class="poster-preview">
          <img
            :src="processImageUrl(form.posterUrl)"
            alt="포스터 미리보기"
            @error="handleImageError"
          />
        </div>
        
        <div v-if="errors.posterUrl" class="error-message">{{ errors.posterUrl }}</div>
      </div>
      
      <!-- 제출 버튼 -->
      <div class="form-actions">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isSubmitting || !isFormValid"
        >
          {{ isSubmitting ? '등록 중...' : '영화 등록' }}
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          @click="resetForm"
        >
          초기화
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { useMovieStore } from '../../stores/movie';
import { notificationService } from '../../services';

export default {
  name: 'MovieRegistration',
  
  setup() {
    const movieStore = useMovieStore();
    
    // 폼 데이터
    const form = reactive({
      title: '',
      genre: '',
      releaseDate: '',
      description: '',
      posterUrl: ''
    });
    
    // 유효성 검사 오류
    const errors = reactive({
      title: '',
      genre: '',
      releaseDate: '',
      description: '',
      posterUrl: ''
    });
    
    // 상태 변수
    const isSubmitting = ref(false);
    const posterPreviewError = ref(false);
    const maxDescriptionLength = 1000;
    
    // 장르 목록
    const genres = [
      '액션',
      '모험',
      '애니메이션',
      '코미디',
      '범죄',
      '다큐멘터리',
      '드라마',
      '가족',
      '판타지',
      '역사',
      '공포',
      '음악',
      '미스터리',
      '로맨스',
      'SF',
      '스릴러',
      '전쟁',
      '서부'
    ];
    
    // 설명 글자 수 제한 도달 여부
    const isDescriptionLimitReached = computed(() => {
      return form.description.length >= maxDescriptionLength;
    });
    
    // 폼 유효성 여부
    const isFormValid = computed(() => {
      return !!form.title && !Object.values(errors).some(error => !!error);
    });
    
    // 필드별 유효성 검사
    const validateField = (field) => {
      errors[field] = '';
      
      switch (field) {
        case 'title':
          if (!form.title) {
            errors.title = '영화 제목은 필수입니다.';
          } else if (form.title.length > 100) {
            errors.title = '영화 제목은 100자를 초과할 수 없습니다.';
          }
          break;
          
        case 'description':
          if (form.description.length > maxDescriptionLength) {
            errors.description = `영화 설명은 ${maxDescriptionLength}자를 초과할 수 없습니다.`;
          }
          break;
          
        case 'releaseDate':
          if (form.releaseDate) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(form.releaseDate)) {
              errors.releaseDate = '올바른 날짜 형식이 아닙니다. (YYYY-MM-DD)';
            }
          }
          break;
          
        case 'posterUrl':
          if (form.posterUrl) {
            try {
              new URL(form.posterUrl);
            } catch (e) {
              errors.posterUrl = '올바른 URL 형식이 아닙니다.';
            }
          }
          break;
      }
    };
    
    // 모든 필드 유효성 검사
    const validateForm = () => {
      validateField('title');
      validateField('genre');
      validateField('releaseDate');
      validateField('description');
      validateField('posterUrl');
      
      return !Object.values(errors).some(error => !!error);
    };
    
    // 이미지 로드 오류 처리
    const handleImageError = () => {
      posterPreviewError.value = true;
      errors.posterUrl = '이미지를 불러올 수 없습니다. URL을 확인해주세요.';
    };
    
    // 이미지 URL 처리 함수
    const processImageUrl = (url) => {
      if (!url) return '';
      
      // 상대 경로인 경우 그대로 사용
      if (url.startsWith('/')) {
        return url;
      }
      
      // 절대 URL인 경우 그대로 사용
      try {
        new URL(url);
        return url;
      } catch (e) {
        // 유효한 URL이 아닌 경우 상대 경로로 간주
        return `/images/${url}`;
      }
    };
    
    // 이 부분은 파일 업로드 기능을 제거하고 URL 입력 방식만 사용하도록 수정했습니다
    
    // 폼 제출 처리
    const submitForm = async () => {
      if (!validateForm()) {
        return;
      }
      
      isSubmitting.value = true;
      
      try {
        // 영화 등록
        await movieStore.createMovie({ ...form });
        notificationService.success('영화가 성공적으로 등록되었습니다.');
        resetForm();
      } catch (error) {
        notificationService.error(error.message || '영화 등록 중 오류가 발생했습니다.');
      } finally {
        isSubmitting.value = false;
      }
    };
    
    // 폼 초기화
    const resetForm = () => {
      Object.keys(form).forEach(key => {
        form[key] = '';
      });
      
      Object.keys(errors).forEach(key => {
        errors[key] = '';
      });
      
      posterPreviewError.value = false;
    };
    
    return {
      form,
      errors,
      genres,
      isSubmitting,
      posterPreviewError,
      maxDescriptionLength,
      isDescriptionLimitReached,
      isFormValid,
      validateField,
      submitForm,
      resetForm,
      handleImageError,
      processImageUrl
    };
  }
};
</script>

<style scoped>
.movie-registration {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.movie-form {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-control:focus {
  border-color: #4a90e2;
  outline: none;
}

.has-error .form-control {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
}

.character-count {
  text-align: right;
  font-size: 12px;
  color: #777;
  margin-top: 5px;
}

.limit-reached {
  color: #e74c3c;
  font-weight: bold;
}

.url-info {
  margin-top: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #4a90e2;
  font-size: 13px;
}

.url-info p {
  margin: 0 0 5px 0;
  color: #555;
  font-weight: 500;
}

.url-info ul {
  margin: 0;
  padding-left: 20px;
}

.url-info li {
  margin-bottom: 3px;
}

.url-info code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
  color: #e74c3c;
}

.poster-upload-options {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.upload-option {
  display: flex;
  align-items: center;
  gap: 5px;
}

.upload-option input[type="radio"] {
  margin: 0;
}

.upload-option label {
  margin: 0;
  cursor: pointer;
}

.poster-upload-container,
.poster-url-container {
  margin-bottom: 10px;
}

.upload-progress {
  margin-top: 10px;
}

.progress-bar {
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4a90e2;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  text-align: center;
}

.poster-preview {
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  max-width: 200px;
}

.poster-preview img {
  width: 100%;
  height: auto;
  border-radius: 2px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #4a90e2;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #3a80d2;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e5e5e5;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .movie-registration {
    padding: 10px;
  }
  
  .movie-form {
    padding: 15px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>