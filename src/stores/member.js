import { defineStore } from 'pinia'

// API 기본 URL 설정
// 통합된 MemberUnifiedController의 API 경로 사용
const API_URL = '/api/member'

export const useMemberStore = defineStore('member', {
  state: () => ({
    memberInfo: null,
    loading: false,
    error: null
  }),
  
  getters: {
    // 회원 정보 getter
    getMemberInfo: (state) => state.memberInfo,
    // 로딩 상태 getter
    isLoading: (state) => state.loading,
    // 에러 상태 getter
    getError: (state) => state.error
  },
  
  actions: {
    // 회원 정보 조회
    async fetchMemberInfo() {
      this.loading = true
      this.error = null
      
      try {
        // 세션 기반 인증 사용
        const response = await fetch(`${API_URL}/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' // 쿠키 포함
        })
        
        if (!response.ok) {
          try {
            const errorData = await response.json()
            throw new Error(errorData.message || '회원 정보를 불러오는데 실패했습니다.')
          } catch (e) {
            throw new Error('회원 정보를 불러오는데 실패했습니다.')
          }
        }
        
        // 응답이 텍스트인 경우 처리
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          this.memberInfo = data
          return data
        } else {
          const text = await response.text()
          this.memberInfo = { id: text }
          return { id: text }
        }
      } catch (error) {
        this.error = error.message || '회원 정보를 불러오는데 실패했습니다.'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 회원 정보 수정
    async updateMemberInfo(memberData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(`${API_URL}/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // 쿠키 포함
          body: JSON.stringify(memberData)
        })
        
        if (!response.ok) {
          try {
            const errorData = await response.json()
            throw new Error(errorData.message || '회원 정보 수정에 실패했습니다.')
          } catch (e) {
            throw new Error('회원 정보 수정에 실패했습니다.')
          }
        }
        
        // 응답이 텍스트인 경우 처리
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          if (data.member) {
            this.memberInfo = data.member
          }
          return data
        } else {
          // 텍스트 응답인 경우 (예: "updated")
          await response.text()
          // 회원 정보를 다시 가져오기
          await this.fetchMemberInfo()
          return { success: true }
        }
      } catch (error) {
        this.error = error.message || '회원 정보 수정에 실패했습니다.'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 비밀번호 변경
    async changePassword(passwordData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(`${API_URL}/change-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // 쿠키 포함
          body: JSON.stringify(passwordData)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || '비밀번호 변경에 실패했습니다.')
        }
        
        return await response.json()
      } catch (error) {
        this.error = error.message || '비밀번호 변경에 실패했습니다.'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 회원 탈퇴
    async deleteAccount(password) {
      this.loading = true
      this.error = null
      
      try {
        // memberInfo가 null이거나 id가 없는 경우 처리
        if (!this.memberInfo || !this.memberInfo.id) {
          throw new Error('회원 정보를 찾을 수 없습니다.');
        }
        
        // 회원탈퇴 API 호출
        const response = await fetch(`${API_URL}/delete/${this.memberInfo.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // 쿠키 포함
          body: JSON.stringify({ password })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '회원 탈퇴에 실패했습니다.');
        }
        
        // 회원 정보 초기화
        this.resetMemberInfo();
        
        // 응답 반환
        return { success: true, message: "회원탈퇴가 성공적으로 처리되었습니다." };
      } catch (error) {
        this.error = error.message || '회원 탈퇴에 실패했습니다.'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 에러 초기화
    clearError() {
      this.error = null
    },
    
    // 회원 정보 초기화
    resetMemberInfo() {
      this.memberInfo = null
      this.error = null
      this.loading = false
    }
  },
  
  persist: {
    key: 'member-store',
    storage: localStorage,
    paths: ['memberInfo']
  }
})