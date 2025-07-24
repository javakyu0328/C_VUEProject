import apiClient from './apiClient';

/**
 * 데이터 서비스
 * 백엔드 API를 호출하여 데이터를 가져오는 서비스 모듈입니다.
 * 기존 API를 활용하여 회원 및 영화 데이터를 조회합니다.
 */
export const dataService = {
  /**
   * 회원 목록 조회
   * 기존 API를 활용하여 모든 회원 정보를 가져옵니다.
   * 백엔드 API가 구현되지 않은 경우 더미 데이터를 반환합니다.
   * 
   * @returns {Promise<Array>} 회원 목록 데이터
   */
  async getMembers() {
    try {
      // 실제 API 호출 시도
      try {
        // MemberController의 API 경로에 맞게 수정
        const response = await apiClient.get('/member/all');
        console.log('회원 데이터 조회 성공:', response.data);
        return response.data;
      } catch (apiError) {
        // API 호출 실패 시 더미 데이터 사용
        console.error('회원 데이터 API 호출 실패:', apiError);
        console.log('백엔드 API 연결 실패 - 개발용 더미 데이터를 사용합니다');
        
        // 더미 데이터 생성
        const dummyMembers = [
          { id: 'admin', name: '관리자', email: 'admin@example.com', birth: '2000-01-01' },
          { id: 'user1', name: '사용자1', email: 'user1@example.com', birth: '1990-05-15' },
          { id: 'user2', name: '사용자2', email: 'user2@example.com', birth: '1985-11-22' },
          { id: 'user3', name: '사용자3', email: 'user3@example.com', birth: '1995-08-30' },
          { id: 'user4', name: '사용자4', email: 'user4@example.com', birth: '1988-03-17' },
          { id: 'user5', name: '사용자5', email: 'user5@example.com', birth: '1992-07-08' },
          { id: 'user6', name: '사용자6', email: 'user6@example.com', birth: '1998-12-25' },
          { id: 'user7', name: '사용자7', email: 'user7@example.com', birth: '1987-04-19' },
          { id: 'user8', name: '사용자8', email: 'user8@example.com', birth: '1993-09-11' },
          { id: 'user9', name: '사용자9', email: 'user9@example.com', birth: '1997-02-28' },
          { id: 'user10', name: '사용자10', email: 'user10@example.com', birth: '1991-06-14' }
        ];
        
        return dummyMembers;
      }
    } catch (error) {
      // 예상치 못한 오류 발생 시
      console.error('회원 목록 처리 중 오류 발생:', error);
      throw new Error('회원 목록을 불러오는 중 오류가 발생했습니다.');
    }
  },
  
  /**
   * 영화 목록 조회
   * 기존 API를 활용하여 모든 영화 정보를 가져옵니다.
   * 백엔드 API가 구현되지 않은 경우 더미 데이터를 반환합니다.
   * 
   * @returns {Promise<Array>} 영화 목록 데이터
   */
  async getMovies() {
    try {
      // 영화 목록 API 호출 - 경로 수정
      const response = await apiClient.get('/movies');
      console.log('영화 데이터 조회 성공:', response.data);
      
      // API 응답 구조에 따라 데이터 추출
      // 페이지네이션 응답인 경우 content 필드에서 데이터 추출
      const movies = response.data.content || response.data;
      return movies;
    } catch (error) {
      // API 호출 실패 시 상세 오류 로깅
      console.error('영화 데이터 API 호출 실패:', error);
      console.log('백엔드 API 연결 실패 - 개발용 더미 데이터를 사용합니다');
      
      // 더미 데이터 생성
      const dummyMovies = [
        { id: 1, title: '영화1', director: '감독1', genre: '액션', releaseDate: '2023-01-15' },
        { id: 2, title: '영화2', director: '감독2', genre: '코미디', releaseDate: '2023-02-20' },
        { id: 3, title: '영화3', director: '감독3', genre: '드라마', releaseDate: '2023-03-10' },
        { id: 4, title: '영화4', director: '감독4', genre: '공포', releaseDate: '2023-04-05' },
        { id: 5, title: '영화5', director: '감독5', genre: '로맨스', releaseDate: '2023-05-25' },
        { id: 6, title: '영화6', director: '감독6', genre: '액션', releaseDate: '2023-06-30' },
        { id: 7, title: '영화7', director: '감독7', genre: '판타지', releaseDate: '2023-07-12' },
        { id: 8, title: '영화8', director: '감독8', genre: 'SF', releaseDate: '2023-08-18' },
        { id: 9, title: '영화9', director: '감독9', genre: '애니메이션', releaseDate: '2023-09-22' },
        { id: 10, title: '영화10', director: '감독10', genre: '다큐멘터리', releaseDate: '2023-10-08' }
      ];
      
      return dummyMovies;
    }
  },
  
  /**
   * 오류 처리 유틸리티 함수
   * API 호출 중 발생한 오류를 처리합니다.
   * 
   * @param {Error} error - 발생한 오류
   * @returns {Object} 처리된 오류 객체
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

export default dataService;