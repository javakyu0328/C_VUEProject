import { defineStore } from 'pinia';
import { movieApi } from '../services/movieApi';

/**
 * 영화 관리를 위한 Pinia Store
 * 영화 목록, 로딩 상태, 에러 상태 관리 및 영화 관련 API 액션을 제공합니다.
 */
export const useMovieStore = defineStore('movie', {
  /**
   * 상태 정의
   */
  state: () => ({
    // 영화 목록
    movies: [],
    // 추천 영화 목록
    recommendedMovies: [],
    // 현재 선택된 영화
    currentMovie: null,
    // 로딩 상태
    loading: false,
    // 에러 상태
    error: null,
    // 페이지네이션 정보
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10
    },
    // 필터 및 정렬 옵션
    filters: {
      search: '',
      genre: '',
      sortBy: 'createdAt', // 'createdAt' 또는 'recommendationCount'
      sortDirection: 'desc'
    }
  }),

  /**
   * 게터 정의
   */
  getters: {
    /**
     * 로딩 중인지 여부를 반환합니다.
     */
    isLoading: (state) => state.loading,

    /**
     * 에러가 있는지 여부를 반환합니다.
     */
    hasError: (state) => state.error !== null,

    /**
     * 영화 목록이 비어있는지 여부를 반환합니다.
     */
    isEmpty: (state) => state.movies.length === 0,

    /**
     * 추천 영화 목록이 비어있는지 여부를 반환합니다.
     */
    isRecommendedEmpty: (state) => state.recommendedMovies.length === 0,

    /**
     * 현재 필터 및 정렬 옵션을 반환합니다.
     */
    currentFilters: (state) => state.filters
  },

  /**
   * 액션 정의
   */
  actions: {
    /**
     * 모든 영화 목록을 조회합니다.
     * 필터 및 정렬 옵션을 적용할 수 있습니다.
     */
    async fetchMovies() {
      this.loading = true;
      this.error = null;

      try {
        const response = await movieApi.getMovies({
          page: this.pagination.currentPage - 1, // 백엔드는 0부터 시작하는 페이지 인덱스 사용
          size: this.pagination.itemsPerPage,
          search: this.filters.search,
          genre: this.filters.genre,
          sortBy: this.filters.sortBy,
          sortDirection: this.filters.sortDirection
        });

        this.movies = response.data.content || response.data;
        
        // 페이지네이션 정보 업데이트 (백엔드가 페이지네이션 정보를 제공하는 경우)
        if (response.data.totalElements !== undefined) {
          this.pagination.totalItems = response.data.totalElements;
          this.pagination.totalPages = response.data.totalPages;
        }
      } catch (error) {
        this.error = error.response?.data?.message || '영화 목록을 불러오는 중 오류가 발생했습니다.';
        console.error('영화 목록 조회 실패:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * 추천 수가 높은 영화 목록을 조회합니다.
     * @param {number} limit - 조회할 영화 수 (기본값: 6)
     */
    async fetchRecommendedMovies(limit = 6) {
      this.loading = true;
      this.error = null;

      try {
        const response = await movieApi.getRecommendedMovies(limit);
        this.recommendedMovies = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || '추천 영화 목록을 불러오는 중 오류가 발생했습니다.';
        console.error('추천 영화 조회 실패:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * 새로운 영화를 등록합니다.
     * @param {Object} movieData - 등록할 영화 데이터
     * @returns {Promise<Object>} - 등록된 영화 데이터
     */
    async createMovie(movieData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await movieApi.createMovie(movieData);
        // 영화 목록에 새로운 영화 추가
        this.movies.unshift(response.data);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || '영화 등록 중 오류가 발생했습니다.';
        console.error('영화 등록 실패:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 영화 추천 상태를 토글합니다.
     * @param {number} movieId - 추천할 영화 ID
     * @returns {Promise<Object>} - 업데이트된 추천 정보
     */
    async toggleRecommendation(movieId) {
      this.loading = true;
      this.error = null;

      try {
        // 현재 영화의 추천 상태 확인
        const movie = this.movies.find(m => m.id === movieId);
        const isRecommended = movie?.recommendedByCurrentUser || false;

        // 추천 상태에 따라 API 호출
        const response = isRecommended
          ? await movieApi.unrecommendMovie(movieId)
          : await movieApi.recommendMovie(movieId);

        // 영화 목록에서 해당 영화의 추천 정보 업데이트
        this.updateMovieRecommendation(movieId, response.data);

        // 추천 영화 목록에서도 업데이트
        this.updateRecommendedMovieList(movieId, response.data);

        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || '영화 추천 중 오류가 발생했습니다.';
        console.error('영화 추천 실패:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 영화 목록에서 특정 영화의 추천 정보를 업데이트합니다.
     * @param {number} movieId - 영화 ID
     * @param {Object} recommendationData - 추천 정보
     */
    updateMovieRecommendation(movieId, recommendationData) {
      const movieIndex = this.movies.findIndex(m => m.id === movieId);
      if (movieIndex !== -1) {
        const updatedMovie = { ...this.movies[movieIndex] };
        updatedMovie.recommendationCount = recommendationData.recommendationCount;
        updatedMovie.recommendedByCurrentUser = recommendationData.recommended;
        this.movies[movieIndex] = updatedMovie;
      }
    },

    /**
     * 추천 영화 목록을 업데이트합니다.
     * @param {number} movieId - 영화 ID
     * @param {Object} recommendationData - 추천 정보
     */
    updateRecommendedMovieList(movieId, recommendationData) {
      const movieIndex = this.recommendedMovies.findIndex(m => m.id === movieId);
      
      // 추천 영화 목록에 있는 경우 업데이트
      if (movieIndex !== -1) {
        const updatedMovie = { ...this.recommendedMovies[movieIndex] };
        updatedMovie.recommendationCount = recommendationData.recommendationCount;
        updatedMovie.recommendedByCurrentUser = recommendationData.recommended;
        this.recommendedMovies[movieIndex] = updatedMovie;
      }
      
      // 추천 영화 목록 재정렬 (추천 수 기준)
      this.recommendedMovies.sort((a, b) => {
        if (b.recommendationCount !== a.recommendationCount) {
          return b.recommendationCount - a.recommendationCount;
        }
        // 추천 수가 같으면 최신순으로 정렬
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    },

    /**
     * 페이지 변경 시 호출됩니다.
     * @param {number} page - 새로운 페이지 번호
     */
    setPage(page) {
      this.pagination.currentPage = page;
      this.fetchMovies();
    },

    /**
     * 필터 옵션을 변경합니다.
     * @param {Object} filters - 새로운 필터 옵션
     */
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
      this.pagination.currentPage = 1; // 필터 변경 시 첫 페이지로 이동
      this.fetchMovies();
    },

    /**
     * 에러 상태를 초기화합니다.
     */
    clearError() {
      this.error = null;
    }
  }
});