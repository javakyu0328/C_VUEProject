import { defineStore } from 'pinia';
import { dataService } from '../services/dataService';

/**
 * 데이터 그리드 상태 관리를 위한 Pinia 스토어
 * 데이터 로딩, 에러 처리, 데이터 타입 전환 등을 관리합니다.
 */
export const useDataGridStore = defineStore('dataGrid', {
  // 상태 정의
  state: () => ({
    data: [],                // 그리드에 표시할 데이터 배열
    dataType: 'members',     // 현재 데이터 타입 ('members' 또는 'movies')
    loading: false,          // 로딩 상태
    error: null,             // 오류 메시지
    lastUpdated: null,       // 마지막 데이터 업데이트 시간
  }),
  
  // 게터 정의
  getters: {
    /**
     * 데이터가 로딩 중인지 여부를 반환합니다.
     * @returns {boolean} 로딩 중 여부
     */
    isLoading: (state) => state.loading,
    
    /**
     * 오류가 발생했는지 여부를 반환합니다.
     * @returns {boolean} 오류 발생 여부
     */
    hasError: (state) => state.error !== null,
    
    /**
     * 데이터가 비어있는지 여부를 반환합니다.
     * @returns {boolean} 데이터 비어있음 여부
     */
    isEmpty: (state) => state.data.length === 0,
    
    /**
     * 현재 데이터 타입을 반환합니다.
     * @returns {string} 데이터 타입 ('members' 또는 'movies')
     */
    currentDataType: (state) => state.dataType,
    
    /**
     * 마지막 데이터 업데이트 시간을 반환합니다.
     * @returns {Date|null} 마지막 업데이트 시간
     */
    getLastUpdated: (state) => state.lastUpdated,
  },
  
  // 액션 정의
  actions: {
    /**
     * 데이터를 가져오는 메서드
     * 현재 설정된 dataType에 따라 회원 또는 영화 데이터를 가져옵니다.
     */
    async fetchData() {
      // 1. 로딩 상태 설정
      this.loading = true;
      this.error = null;
      
      try {
        // 2. 데이터 타입에 따라 적절한 서비스 메서드 호출
        if (this.dataType === 'members') {
          // 2-1. 회원 데이터 가져오기
          const response = await dataService.getMembers();
          this.data = response;
        } else {
          // 2-2. 영화 데이터 가져오기
          const response = await dataService.getMovies();
          this.data = response;
        }
        
        // 3. 마지막 업데이트 시간 기록
        this.lastUpdated = new Date();
        if (process.env.NODE_ENV !== 'production') {
          console.log(`${this.dataType} 데이터 로딩 완료:`, this.data.length, '개 항목');
        }
      } catch (error) {
        // 4. 오류 처리
        console.error('데이터 로딩 중 오류 발생:', error);
        this.error = error.message || '데이터를 불러오는 중 오류가 발생했습니다';
        throw error;
      } finally {
        // 5. 로딩 상태 종료
        this.loading = false;
      }
    },
    
    /**
     * 데이터 타입을 변경하는 메서드
     * 회원 데이터와 영화 데이터 간 전환 시 사용합니다.
     * 
     * @param {string} type - 데이터 타입 ('members' 또는 'movies')
     */
    setDataType(type) {
      // 1. 데이터 타입이 유효한지 확인
      if (type !== 'members' && type !== 'movies') {
        console.error('유효하지 않은 데이터 타입:', type);
        return;
      }
      
      // 2. 데이터 타입이 변경된 경우에만 처리
      if (this.dataType !== type) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('데이터 타입 변경:', this.dataType, '->', type);
        }
        
        // 3. 데이터 타입 변경
        this.dataType = type;
        
        // 4. 데이터 초기화
        this.data = [];
        
        // 5. 새로운 데이터 타입에 맞는 데이터 가져오기
        this.fetchData();
      }
    },
    
    /**
     * 오류 상태를 초기화하는 메서드
     */
    clearError() {
      this.error = null;
    },
    
    /**
     * 데이터를 새로고침하는 메서드
     */
    refreshData() {
      return this.fetchData();
    }
  },
  
  // 상태 지속성 설정 (브라우저 새로고침 시에도 상태 유지)
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'data-grid-store',
        storage: sessionStorage, // 세션 스토리지 사용 (브라우저 닫으면 초기화)
        paths: ['dataType'] // 데이터 타입만 저장
      }
    ]
  }
});