<template>
  <div class="movie-list-container">
    <!-- 검색 및 필터링 영역 -->
    <div class="filters-container">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="영화 제목 검색..." 
          @input="handleSearch"
        />
        <button class="search-button" @click="handleSearch">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
      
      <div class="filter-options">
        <div class="genre-filter">
          <select v-model="selectedGenre" @change="handleFilters">
            <option value="">모든 장르</option>
            <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
          </select>
        </div>
        
        <div class="sort-options">
          <select v-model="sortOption" @change="handleFilters">
            <option value="latest">최신순</option>
            <option value="recommended">추천순</option>
            <option value="title">제목순</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- 영화 목록 그리드 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>영화 목록을 불러오는 중...</p>
    </div>
    
    <div v-else-if="filteredMovies.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
        <line x1="7" y1="2" x2="7" y2="22"></line>
        <line x1="17" y1="2" x2="17" y2="22"></line>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <line x1="2" y1="7" x2="7" y2="7"></line>
        <line x1="2" y1="17" x2="7" y2="17"></line>
        <line x1="17" y1="17" x2="22" y2="17"></line>
        <line x1="17" y1="7" x2="22" y2="7"></line>
      </svg>
      <p v-if="searchQuery || selectedGenre">검색 결과가 없습니다.</p>
      <p v-else>등록된 영화가 없습니다.</p>
    </div>
    
    <div v-else class="movie-grid">
      <MovieCard 
        v-for="movie in paginatedMovies" 
        :key="movie.id" 
        :movie="movie"
        @click="handleMovieClick"
        @recommend="handleRecommend"
      />
    </div>
    
    <!-- 페이지네이션 -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        class="pagination-button" 
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        이전
      </button>
      
      <div class="page-numbers">
        <button 
          v-for="page in displayedPages" 
          :key="page" 
          class="page-number" 
          :class="{ active: currentPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        class="pagination-button" 
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        다음
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMovieStore } from '../../stores/movie';
import MovieCard from './MovieCard.vue';
import { notificationService } from '../../services';

export default {
  name: 'MovieList',
  
  components: {
    MovieCard
  },
  
  props: {
    /**
     * 초기 영화 목록 (선택적)
     */
    initialMovies: {
      type: Array,
      default: () => []
    },
    
    /**
     * 페이지당 영화 수
     */
    moviesPerPage: {
      type: Number,
      default: 12
    },
    
    /**
     * 자동으로 영화 목록을 불러올지 여부
     */
    autoFetch: {
      type: Boolean,
      default: true
    },
    
    /**
     * 추천 영화만 표시할지 여부
     */
    recommendedOnly: {
      type: Boolean,
      default: false
    },
    
    /**
     * 최대 표시할 영화 수 (0이면 제한 없음)
     */
    maxMovies: {
      type: Number,
      default: 0
    }
  },
  
  emits: ['movie-click', 'recommend'],
  
  setup(props, { emit }) {
    const router = useRouter();
    const movieStore = useMovieStore();
    
    // 상태 변수
    const movies = ref(props.initialMovies || []);
    const loading = ref(false);
    const error = ref(null);
    const searchQuery = ref('');
    const selectedGenre = ref('');
    const sortOption = ref('latest');
    const currentPage = ref(1);
    
    // 영화 목록 불러오기
    const fetchMovies = async () => {
      if (!props.autoFetch && !props.initialMovies.length) return;
      
      loading.value = true;
      error.value = null;
      
      try {
        if (props.recommendedOnly) {
          await movieStore.fetchRecommendedMovies();
          movies.value = movieStore.recommendedMovies;
        } else {
          await movieStore.fetchMovies();
          movies.value = movieStore.movies;
        }
        
        // 최대 표시 영화 수 제한
        if (props.maxMovies > 0 && movies.value.length > props.maxMovies) {
          movies.value = movies.value.slice(0, props.maxMovies);
        }
      } catch (err) {
        error.value = '영화 목록을 불러오는데 실패했습니다.';
        notificationService.error(error.value);
        console.error('영화 목록 로드 오류:', err);
      } finally {
        loading.value = false;
      }
    };
    
    // 장르 목록 계산
    const genres = computed(() => {
      const genreSet = new Set();
      movies.value.forEach(movie => {
        if (movie.genre) {
          genreSet.add(movie.genre);
        }
      });
      return Array.from(genreSet).sort();
    });
    
    // 필터링된 영화 목록
    const filteredMovies = computed(() => {
      let result = [...movies.value];
      
      // 검색어로 필터링
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(movie => 
          movie.title.toLowerCase().includes(query)
        );
      }
      
      // 장르로 필터링
      if (selectedGenre.value) {
        result = result.filter(movie => 
          movie.genre === selectedGenre.value
        );
      }
      
      // 정렬
      switch (sortOption.value) {
        case 'recommended':
          result.sort((a, b) => (b.recommendationCount || 0) - (a.recommendationCount || 0));
          break;
        case 'title':
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'latest':
        default:
          // 최신순 (ID 기준 내림차순)
          result.sort((a, b) => b.id - a.id);
          break;
      }
      
      return result;
    });
    
    // 페이지네이션 관련 계산
    const totalPages = computed(() => {
      return Math.ceil(filteredMovies.value.length / props.moviesPerPage);
    });
    
    const paginatedMovies = computed(() => {
      const startIndex = (currentPage.value - 1) * props.moviesPerPage;
      const endIndex = startIndex + props.moviesPerPage;
      return filteredMovies.value.slice(startIndex, endIndex);
    });
    
    const displayedPages = computed(() => {
      const pages = [];
      const maxPagesToShow = 5;
      
      if (totalPages.value <= maxPagesToShow) {
        // 전체 페이지가 5개 이하면 모든 페이지 표시
        for (let i = 1; i <= totalPages.value; i++) {
          pages.push(i);
        }
      } else {
        // 현재 페이지 주변의 페이지만 표시
        let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
        let endPage = startPage + maxPagesToShow - 1;
        
        if (endPage > totalPages.value) {
          endPage = totalPages.value;
          startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
      }
      
      return pages;
    });
    
    // 페이지 이동
    const goToPage = (page) => {
      currentPage.value = page;
      // 페이지 상단으로 스크롤
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    // 검색 처리
    const handleSearch = () => {
      currentPage.value = 1; // 검색 시 첫 페이지로 이동
    };
    
    // 필터 처리
    const handleFilters = () => {
      currentPage.value = 1; // 필터 변경 시 첫 페이지로 이동
    };
    
    // 영화 클릭 처리
    const handleMovieClick = (movie) => {
      emit('movie-click', movie);
      router.push(`/movies/${movie.id}`);
    };
    
    // 추천 처리
    const handleRecommend = (data) => {
      emit('recommend', data);
    };
    
    // 필터 초기화
    const resetFilters = () => {
      searchQuery.value = '';
      selectedGenre.value = '';
      sortOption.value = 'latest';
      currentPage.value = 1;
    };
    
    // 컴포넌트 마운트 시 영화 목록 불러오기
    onMounted(() => {
      fetchMovies();
    });
    
    // props.initialMovies가 변경되면 movies 업데이트
    watch(() => props.initialMovies, (newMovies) => {
      if (newMovies && newMovies.length > 0) {
        movies.value = newMovies;
      }
    }, { deep: true });
    
    return {
      movies,
      loading,
      error,
      searchQuery,
      selectedGenre,
      sortOption,
      currentPage,
      genres,
      filteredMovies,
      paginatedMovies,
      totalPages,
      displayedPages,
      fetchMovies,
      goToPage,
      handleSearch,
      handleFilters,
      handleMovieClick,
      handleRecommend,
      resetFilters
    };
  }
};
</script>

<style scoped>
.movie-list-container {
  padding: 20px 0;
}

.filters-container {
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
  justify-content: space-between;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

.search-box input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  border: 1px solid #ddd;
  border-radius: 30px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.search-box input:focus {
  border-color: #4a90e2;
}

.search-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 5px;
}

.search-button:hover {
  color: #4a90e2;
}

.filter-options {
  display: flex;
  gap: 15px;
  align-items: center;
}

.genre-filter select,
.sort-options select {
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.3s;
}

.genre-filter select:focus,
.sort-options select:focus {
  border-color: #4a90e2;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #4a90e2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  color: #666;
  text-align: center;
}

.empty-state svg {
  margin-bottom: 20px;
  color: #ddd;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 10px;
}

.pagination-button {
  padding: 8px 15px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #e9e9e9;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.page-number:hover {
  background-color: #f5f5f5;
}

.page-number.active {
  background-color: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: none;
  }
  
  .filter-options {
    width: 100%;
    justify-content: space-between;
  }
  
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
}
</style>