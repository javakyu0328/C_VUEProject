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
    return config;
  },
  error => {
    // 요청 에러 처리
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
apiClient.interceptors.response.use(
  response => {
    // 응답 데이터 처리
    return response;
  },
  error => {
    // 응답 에러 처리
    if (error.response && error.response.status === 403) {
      console.error('CORS 또는 권한 오류:', error);
    }
    return Promise.reject(error);
  }
);

export default apiClient;