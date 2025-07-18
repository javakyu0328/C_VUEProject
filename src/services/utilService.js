/**
 * 유틸리티 서비스
 * 애플리케이션 전반에서 사용되는 유틸리티 함수들을 제공합니다.
 */

/**
 * 날짜 문자열을 포맷팅합니다.
 * @param {string} dateString - 날짜 문자열 (ISO 형식)
 * @param {Object} options - Intl.DateTimeFormat 옵션
 * @returns {string} - 포맷팅된 날짜 문자열
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', mergedOptions).format(date);
  } catch (error) {
    console.error('날짜 포맷팅 오류:', error);
    return dateString;
  }
};

/**
 * 텍스트를 지정된 길이로 자릅니다.
 * @param {string} text - 원본 텍스트
 * @param {number} maxLength - 최대 길이
 * @param {string} suffix - 생략 부호 (기본값: '...')
 * @returns {string} - 잘린 텍스트
 */
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + suffix;
};

/**
 * 객체에서 빈 값(null, undefined, 빈 문자열)을 제거합니다.
 * @param {Object} obj - 원본 객체
 * @returns {Object} - 빈 값이 제거된 객체
 */
export const removeEmptyValues = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});
};

/**
 * 쿼리 파라미터 객체를 URL 쿼리 문자열로 변환합니다.
 * @param {Object} params - 쿼리 파라미터 객체
 * @returns {string} - URL 쿼리 문자열
 */
export const buildQueryString = (params) => {
  const cleanParams = removeEmptyValues(params);
  const searchParams = new URLSearchParams();
  
  Object.entries(cleanParams).forEach(([key, value]) => {
    searchParams.append(key, value);
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * 파일 크기를 사람이 읽기 쉬운 형식으로 변환합니다.
 * @param {number} bytes - 바이트 단위 파일 크기
 * @param {number} decimals - 소수점 자릿수 (기본값: 2)
 * @returns {string} - 변환된 파일 크기 문자열
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * 이미지 파일인지 확인합니다.
 * @param {File} file - 확인할 파일
 * @returns {boolean} - 이미지 파일 여부
 */
export const isImageFile = (file) => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  return file && imageTypes.includes(file.type);
};

/**
 * 파일 확장자를 추출합니다.
 * @param {string} filename - 파일명
 * @returns {string} - 파일 확장자
 */
export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

export default {
  formatDate,
  truncateText,
  removeEmptyValues,
  buildQueryString,
  formatFileSize,
  isImageFile,
  getFileExtension
};