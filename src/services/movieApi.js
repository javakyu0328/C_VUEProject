import axios from 'axios';

/**
 * 영화 API와 통신하기 위한 기본 Axios 인스턴스
 */
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10초 타임아웃
});

/**
 * 영화 관련 API 서비스
 * 백엔드 API와 통신하여 영화 데이터를 관리합니다.
 */
export const movieApi = {
  /**
   * 영화 목록을 조회합니다.
   * @param {Object} params - 조회 파라미터
   * @param {number} params.page - 페이지 번호 (0부터 시작)
   * @param {number} params.size - 페이지당 항목 수
   * @param {string} params.search - 검색어
   * @param {string} params.genre - 장르 필터
   * @param {string} params.sortBy - 정렬 기준 필드
   * @param {string} params.sortDirection - 정렬 방향 ('asc' 또는 'desc')
   * @returns {Promise<Object>} - 영화 목록 응답
   */
  getMovies(params = {}) {
    return apiClient.get('/movies', { params });
  },

  /**
   * 추천 수가 높은 영화 목록을 조회합니다.
   * @param {number} limit - 조회할 영화 수
   * @returns {Promise<Object>} - 추천 영화 목록 응답
   */
  getRecommendedMovies(limit = 6) {
    return apiClient.get('/movies/top-recommended', { params: { limit } });
  },

  /**
   * 영화 상세 정보를 조회합니다.
   * @param {number} id - 영화 ID
   * @returns {Promise<Object>} - 영화 상세 정보 응답
   */
  getMovie(id) {
    return apiClient.get(`/movies/${id}`);
  },

  /**
   * 새로운 영화를 등록합니다.
   * @param {Object} movieData - 등록할 영화 데이터
   * @returns {Promise<Object>} - 등록된 영화 응답
   */
  createMovie(movieData) {
    return apiClient.post('/movies', movieData);
  },

  /**
   * 영화를 추천합니다.
   * @param {number} id - 영화 ID
   * @param {string} memberId - 회원 ID (현재 로그인한 사용자)
   * @returns {Promise<Object>} - 추천 결과 응답
   */
  recommendMovie(id, memberId = 'anonymous') {
    return apiClient.post(`/movies/${id}/recommend`, null, {
      params: { memberId }
    });
  },

  /**
   * 영화 추천을 취소합니다. (백엔드에서는 토글 방식으로 구현되어 있으므로 동일한 API 호출)
   * @param {number} id - 영화 ID
   * @param {string} memberId - 회원 ID (현재 로그인한 사용자)
   * @returns {Promise<Object>} - 추천 취소 결과 응답
   */
  unrecommendMovie(id, memberId = 'anonymous') {
    return apiClient.post(`/movies/${id}/recommend`, null, {
      params: { memberId }
    });
  },

  /**
   * API 요청 중 발생한 에러를 처리합니다.
   * @param {Error} error - 발생한 에러
   * @returns {Object} - 처리된 에러 객체
   */
  handleError(error) {
    let errorMessage = '알 수 없는 오류가 발생했습니다.';
    
    if (error.response) {
      // 서버가 응답을 반환한 경우
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = data.message || '잘못된 요청입니다.';
          break;
        case 401:
          errorMessage = '인증이 필요합니다.';
          break;
        case 403:
          errorMessage = '접근 권한이 없습니다.';
          break;
        case 404:
          errorMessage = data.message || '요청한 리소스를 찾을 수 없습니다.';
          break;
        case 409:
          errorMessage = data.message || '요청이 충돌했습니다.';
          break;
        case 500:
          errorMessage = '서버 오류가 발생했습니다.';
          break;
        default:
          errorMessage = data.message || `오류가 발생했습니다. (${status})`;
      }
    } else if (error.request) {
      // 요청이 전송되었으나 응답을 받지 못한 경우
      errorMessage = '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.';
    }
    
    return {
      message: errorMessage,
      originalError: error
    };
  }
};

// 요청 인터셉터 설정
apiClient.interceptors.request.use(
  config => {
    // 요청 전에 수행할 작업
    // 예: 인증 토큰 추가
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
apiClient.interceptors.response.use(
  response => {
    // 응답 데이터 가공 등의 작업
    return response;
  },
  error => {
    // 에러 응답 처리
    const processedError = movieApi.handleError(error);
    return Promise.reject(processedError);
  }
);

export default movieApi;