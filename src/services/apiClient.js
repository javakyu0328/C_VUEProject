import axios from 'axios';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  config => {
    // 요청 전에 수행할 작업
    console.log('API 요청:', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => {
    // 요청 에러 처리
    console.error('API 요청 오류:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
apiClient.interceptors.response.use(
  response => {
    // 응답 데이터 처리
    console.log('API 응답 성공:', response.config.url);
    return response;
  },
  error => {
    // 응답 에러 처리
    if (error.response) {
      console.error(`API 오류 (${error.response.status}):`, error.config.url, error.response.data);
      
      if (error.response.status === 403) {
        console.error('CORS 또는 권한 오류가 발생했습니다.');
      } else if (error.response.status === 404) {
        console.error('요청한 리소스를 찾을 수 없습니다.');
      } else if (error.response.status === 500) {
        console.error('서버 내부 오류가 발생했습니다.');
      }
    } else if (error.request) {
      console.error('서버로부터 응답이 없습니다:', error.config.url);
    } else {
      console.error('요청 설정 중 오류가 발생했습니다:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;