import axios from 'axios';
import { notificationService } from './notificationService';

/**
 * 파일 업로드를 위한 기본 Axios 인스턴스
 */
const uploadClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  timeout: 30000 // 30초 타임아웃 (파일 업로드는 시간이 더 걸릴 수 있음)
});

/**
 * 파일 업로드 서비스
 * 이미지 파일을 서버에 업로드하고 URL을 반환합니다.
 */
export const fileUploadService = {
  /**
   * 이미지 파일을 업로드합니다.
   * @param {File} file - 업로드할 이미지 파일
   * @param {Object} options - 업로드 옵션
   * @param {string} options.type - 파일 타입 (예: 'poster')
   * @param {Function} options.onProgress - 업로드 진행 상태 콜백
   * @returns {Promise<string>} - 업로드된 파일의 URL
   */
  async uploadImage(file, options = {}) {
    if (!file) {
      return Promise.reject(new Error('업로드할 파일이 없습니다.'));
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    if (options.type) {
      formData.append('type', options.type);
    }
    
    try {
      const response = await uploadClient.post('/upload/image', formData, {
        onUploadProgress: (progressEvent) => {
          if (options.onProgress && progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            options.onProgress(percentCompleted);
          }
        }
      });
      
      return response.data.url;
    } catch (error) {
      const errorMessage = error.message || '이미지 업로드 중 오류가 발생했습니다.';
      notificationService.error(errorMessage);
      throw error;
    }
  },
  
  /**
   * 이미지 URL이 유효한지 확인합니다.
   * @param {string} url - 확인할 이미지 URL
   * @returns {Promise<boolean>} - URL 유효성 여부
   */
  async validateImageUrl(url) {
    if (!url) {
      return false;
    }
    
    // 내부 URL인 경우 (서버에서 제공하는 이미지)
    if (url.startsWith('/') || url.startsWith(window.location.origin)) {
      return true;
    }
    
    // 외부 URL인 경우 - 백엔드에 검증 API가 없으므로 항상 true 반환
    // 실제로는 이미지 로드 시 오류가 발생하면 기본 이미지로 대체됨
    return true;
  },
  
  /**
   * 기본 이미지 URL을 반환합니다.
   * @param {string} type - 이미지 타입 (예: 'poster')
   * @returns {string} - 기본 이미지 URL
   */
  getDefaultImageUrl(type = 'poster') {
    const defaultImages = {
      poster: '/assets/images/movie.png',
      avatar: '/assets/images/profile.png',
      thumbnail: '/assets/images/movie.png'
    };
    
    return defaultImages[type] || defaultImages.poster;
  }
};

export default fileUploadService;