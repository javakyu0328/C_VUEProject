<template>
  <div class="admin-data-grid">
    <!-- 그리드 헤더 영역 -->
    <div class="grid-header">
      <h2>관리자 데이터 그리드</h2>
      
      <!-- 데이터 타입 선택 -->
      <div class="data-type-selector">
        <button 
          :class="{ active: dataGridStore.dataType === 'members' }" 
          @click="changeDataType('members')"
        >
          회원 데이터
        </button>
        <button 
          :class="{ active: dataGridStore.dataType === 'movies' }" 
          @click="changeDataType('movies')"
        >
          영화 데이터
        </button>
      </div>
    </div>
    
    <!-- 검색 및 필터링 영역 -->
    <div class="search-container">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="handleSearch" 
          placeholder="검색어를 입력하세요..." 
          class="search-input"
        />
        <button @click="handleSearch" class="search-button">검색</button>
      </div>
      
      <div class="grid-actions">
        <!-- 페이지당 항목 수 선택 -->
        <div class="items-per-page">
          <label for="itemsPerPage">페이지당 항목 수:</label>
          <select id="itemsPerPage" v-model="itemsPerPage" @change="handleItemsPerPageChange">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        
        <!-- 열 설정 버튼 -->
        <button @click="openColumnSettings" class="action-button">
          <span class="icon">⚙️</span> 열 설정
        </button>
        
        <!-- 엑셀 다운로드 버튼 -->
        <button @click="downloadExcel" class="action-button excel-button">
          <span class="icon">📥</span> 엑셀 다운로드
        </button>
      </div>
    </div>
    
    <!-- 로딩 상태 표시 -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>데이터를 불러오는 중...</p>
    </div>
    
    <!-- 오류 상태 표시 -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchData" class="btn">다시 시도</button>
    </div>
    
    <!-- 데이터 테이블 -->
    <div v-else class="table-container">
      <table class="data-table">
        <!-- 테이블 헤더 -->
        <thead>
          <tr>
            <th 
              v-for="field in visibleFields" 
              :key="field.key"
              @click="sortBy(field.key)"
              :class="{ sortable: true, sorted: sortField === field.key }"
            >
              {{ field.label }}
              <span v-if="sortField === field.key" class="sort-icon">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
          </tr>
        </thead>
        
        <!-- 테이블 본문 -->
        <tbody>
          <tr v-for="(item, index) in paginatedData" :key="index">
            <td v-for="field in visibleFields" :key="field.key">
              {{ item[field.key] }}
            </td>
          </tr>
        </tbody>
        
        <!-- 데이터가 없는 경우 -->
        <tbody v-if="filteredData.length === 0">
          <tr>
            <td :colspan="visibleFields.length" class="no-data">
              {{ searchQuery ? '검색 결과가 없습니다.' : '데이터가 없습니다.' }}
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- 페이지네이션 컨트롤 -->
      <div v-if="totalPages > 1" class="pagination">
        <!-- 처음 페이지로 이동 -->
        <button 
          @click="goToPage(1)" 
          :disabled="currentPage === 1"
          class="pagination-button"
          title="처음 페이지"
        >
          &laquo;
        </button>
        
        <!-- 이전 페이지로 이동 -->
        <button 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="pagination-button"
          title="이전 페이지"
        >
          &lsaquo;
        </button>
        
        <!-- 페이지 번호 -->
        <div class="page-numbers">
          <button 
            v-for="page in displayedPageNumbers" 
            :key="page"
            @click="goToPage(page)"
            :class="['pagination-button', { active: currentPage === page }]"
          >
            {{ page }}
          </button>
        </div>
        
        <!-- 다음 페이지로 이동 -->
        <button 
          @click="goToPage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          class="pagination-button"
          title="다음 페이지"
        >
          &rsaquo;
        </button>
        
        <!-- 마지막 페이지로 이동 -->
        <button 
          @click="goToPage(totalPages)" 
          :disabled="currentPage === totalPages"
          class="pagination-button"
          title="마지막 페이지"
        >
          &raquo;
        </button>
      </div>
      
      <!-- 페이지 정보 표시 -->
      <div class="pagination-info">
        {{ paginationInfo }}
      </div>
    </div>
    
    <!-- 열 설정 모달 -->
    <div v-if="showColumnSettings" class="column-settings-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>열 설정</h3>
          <button @click="closeColumnSettings" class="close-button">&times;</button>
        </div>
        
        <div class="modal-body">
          <p class="modal-description">표시할 열을 선택하세요.</p>
          
          <div 
            v-for="field in allFields" 
            :key="field.key"
            class="column-option"
          >
            <input 
              type="checkbox" 
              :id="'col-' + field.key" 
              v-model="field.visible"
              @change="saveColumnSettings"
            />
            <label :for="'col-' + field.key">{{ field.label }}</label>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="resetColumnSettings" class="secondary-button">기본값으로 재설정</button>
          <button @click="closeColumnSettings" class="primary-button">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useDataGridStore } from '../../stores/dataGrid';
// xlsx 라이브러리 임포트
import * as XLSX from 'xlsx';

export default {
  name: 'AdminDataGrid',
  
  setup() {
    // 스토어 초기화
    const dataGridStore = useDataGridStore();
    
    // 상태 변수
    const loading = ref(false);
    const error = ref(null);
    const searchQuery = ref('');
    const sortField = ref('id');
    const sortDirection = ref('asc');
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    
    // 회원 데이터용 필드 정의 (기본값)
    const defaultMemberFields = [
      { key: 'id', label: 'ID', visible: true },
      { key: 'name', label: '이름', visible: true },
      { key: 'email', label: '이메일', visible: true },
      { key: 'birth', label: '생년월일', visible: true }
    ];
    
    // 영화 데이터용 필드 정의 (기본값)
    const defaultMovieFields = [
      { key: 'id', label: '영화 ID', visible: true },
      { key: 'title', label: '제목', visible: true },
      { key: 'director', label: '감독', visible: true },
      { key: 'genre', label: '장르', visible: true }
    ];
    
    // 현재 사용 중인 필드 (사용자 설정 반영)
    const allFields = ref([]);
    
    // 열 설정 모달 표시 여부
    const showColumnSettings = ref(false);
    
    // 현재 데이터 타입에 따른 필드 정의 (기본값)
    const getDefaultFields = (type) => {
      return type === 'members' ? defaultMemberFields : defaultMovieFields;
    };
    
    // 보이는 필드만 필터링
    const visibleFields = computed(() => {
      return allFields.value.filter(field => field.visible);
    });
    
    /**
     * 검색어에 따라 필터링된 데이터
     * 검색어가 없으면 모든 데이터 반환, 있으면 검색어를 포함하는 데이터만 반환
     */
    const filteredData = computed(() => {
      // 검색어가 없으면 모든 데이터 반환
      if (!searchQuery.value) return dataGridStore.data;
      
      // 검색어가 있으면 필터링
      const query = searchQuery.value.toLowerCase();
      return dataGridStore.data.filter(item => {
        // 모든 필드에서 검색어 포함 여부 확인
        return Object.entries(item).some(([key, value]) => {
          // 현재 필드가 표시 중인 필드인지 확인
          const isDisplayField = allFields.value.some(field => field.key === key);
          // 값이 존재하고 문자열로 변환 가능하며 검색어를 포함하는지 확인
          return isDisplayField && value && String(value).toLowerCase().includes(query);
        });
      });
    });
    
    /**
     * 정렬된 데이터
     * 현재 정렬 기준 필드와 방향에 따라 데이터 정렬
     */
    const sortedData = computed(() => {
      return [...filteredData.value].sort((a, b) => {
        const aValue = a[sortField.value];
        const bValue = b[sortField.value];
        
        // 값이 같으면 정렬 변경 없음
        if (aValue === bValue) return 0;
        
        // 값 비교 후 정렬 방향에 따라 결과 반환
        const result = aValue < bValue ? -1 : 1;
        return sortDirection.value === 'asc' ? result : -result;
      });
    });
    
    /**
     * 총 페이지 수
     * 필터링된 데이터 수와 페이지당 항목 수에 따라 계산
     */
    const totalPages = computed(() => {
      return Math.ceil(sortedData.value.length / itemsPerPage.value) || 1;
    });
    
    /**
     * 페이지네이션된 데이터
     * 현재 페이지와 페이지당 항목 수에 따라 데이터 슬라이싱
     */
    const paginatedData = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage.value;
      const endIndex = startIndex + itemsPerPage.value;
      return sortedData.value.slice(startIndex, endIndex);
    });
    
    /**
     * 표시할 페이지 번호 목록
     * 현재 페이지 주변의 페이지 번호만 표시
     */
    const displayedPageNumbers = computed(() => {
      const totalPagesCount = totalPages.value;
      const current = currentPage.value;
      const delta = 2; // 현재 페이지 양쪽에 표시할 페이지 수
      
      // 표시할 페이지 번호 범위 계산
      let start = Math.max(1, current - delta);
      let end = Math.min(totalPagesCount, current + delta);
      
      // 시작 페이지가 1보다 크게 조정된 경우, 끝 페이지를 더 늘려줌
      if (start > 1) {
        end = Math.min(totalPagesCount, end + (1 - start));
      }
      
      // 끝 페이지가 총 페이지 수보다 작게 조정된 경우, 시작 페이지를 더 줄여줌
      if (end < totalPagesCount) {
        start = Math.max(1, start - (totalPagesCount - end));
      }
      
      // 페이지 번호 배열 생성
      const pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    });
    
    /**
     * 페이지네이션 정보 텍스트
     * 현재 표시 중인 항목 범위와 전체 항목 수 표시
     */
    const paginationInfo = computed(() => {
      const total = sortedData.value.length;
      if (total === 0) return '표시할 항목이 없습니다.';
      
      const start = (currentPage.value - 1) * itemsPerPage.value + 1;
      const end = Math.min(start + itemsPerPage.value - 1, total);
      
      return `전체 ${total}개 항목 중 ${start}-${end}번 항목 표시 중`;
    });
    
    /**
     * 데이터 가져오기
     * 데이터 그리드 스토어의 fetchData 메서드 호출
     */
    const fetchData = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        // 데이터 그리드 스토어에서 데이터 가져오기
        await dataGridStore.fetchData();
        
        // 데이터 로딩 후 첫 페이지로 이동
        currentPage.value = 1;
      } catch (err) {
        // 오류 처리
        console.error('데이터 로딩 중 오류:', err);
        error.value = '데이터를 불러오는 중 오류가 발생했습니다';
      } finally {
        // 로딩 상태 종료
        loading.value = false;
      }
    };
    
    /**
     * 데이터 타입 변경
     * 회원 데이터와 영화 데이터 간 전환
     * 
     * @param {string} type - 데이터 타입 ('members' 또는 'movies')
     */
    const changeDataType = (type) => {
      // 데이터 타입 변경
      dataGridStore.setDataType(type);
      
      // 검색어 초기화
      searchQuery.value = '';
      
      // 정렬 초기화
      sortField.value = 'id';
      sortDirection.value = 'asc';
      
      // 페이지 초기화
      currentPage.value = 1;
      
      // 필드 설정 로드
      loadColumnSettings(type);
    };
    
    /**
     * 열 설정 모달 열기
     */
    const openColumnSettings = () => {
      showColumnSettings.value = true;
    };
    
    /**
     * 열 설정 모달 닫기
     */
    const closeColumnSettings = () => {
      showColumnSettings.value = false;
    };
    
    /**
     * 열 설정 저장
     * 현재 열 설정을 로컬 스토리지에 저장
     */
    const saveColumnSettings = () => {
      // 데이터 타입별로 다른 키 사용
      const storageKey = `dataGridColumns_${dataGridStore.dataType}`;
      localStorage.setItem(storageKey, JSON.stringify(allFields.value));
      if (process.env.NODE_ENV !== 'production') {
        console.log('열 설정 저장됨:', allFields.value);
      }
    };
    
    /**
     * 열 설정 초기화
     * 모든 열을 보이도록 설정
     */
    const resetColumnSettings = () => {
      // 기본 필드 설정 가져오기
      const defaultFields = getDefaultFields(dataGridStore.dataType);
      
      // 모든 필드 표시 설정
      allFields.value = JSON.parse(JSON.stringify(defaultFields));
      
      // 설정 저장
      saveColumnSettings();
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('열 설정 초기화됨');
      }
    };
    
    /**
     * 열 설정 불러오기
     * 로컬 스토리지에서 저장된 열 설정 불러오기
     * 
     * @param {string} type - 데이터 타입 ('members' 또는 'movies')
     */
    const loadColumnSettings = (type) => {
      // 데이터 타입별로 다른 키 사용
      const storageKey = `dataGridColumns_${type}`;
      const savedColumns = localStorage.getItem(storageKey);
      
      // 기본 필드 설정 가져오기
      const defaultFields = getDefaultFields(type);
      
      if (savedColumns) {
        // 저장된 설정이 있으면 적용
        try {
          const parsedColumns = JSON.parse(savedColumns);
          allFields.value = parsedColumns;
          if (process.env.NODE_ENV !== 'production') {
            console.log('저장된 열 설정 로드됨:', type);
          }
        } catch (error) {
          // JSON 파싱 오류 시 기본값 사용
          console.error('열 설정 로드 중 오류 발생:', error);
          allFields.value = JSON.parse(JSON.stringify(defaultFields));
        }
      } else {
        // 저장된 설정이 없으면 기본값 사용
        allFields.value = JSON.parse(JSON.stringify(defaultFields));
        if (process.env.NODE_ENV !== 'production') {
          console.log('기본 열 설정 사용:', type);
        }
      }
    };
    
    /**
     * 정렬 처리
     * 클릭한 컬럼을 기준으로 정렬
     * 
     * @param {string} field - 정렬 기준 필드
     */
    const sortBy = (field) => {
      // 같은 필드를 다시 클릭하면 정렬 방향 전환
      if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
      } else {
        // 다른 필드를 클릭하면 해당 필드로 정렬 기준 변경 및 오름차순 설정
        sortField.value = field;
        sortDirection.value = 'asc';
      }
      
      // 정렬 후 첫 페이지로 이동
      currentPage.value = 1;
      
      if (process.env.NODE_ENV !== 'production') {
        console.log(`정렬: ${field} (${sortDirection.value})`);
      }
    };
    
    /**
     * 검색 처리
     * 검색어에 따라 데이터 필터링
     */
    const handleSearch = () => {
      // 검색 시 첫 페이지로 이동
      currentPage.value = 1;
      if (process.env.NODE_ENV !== 'production') {
        console.log('검색어:', searchQuery.value);
      }
    };
    
    /**
     * 페이지 이동
     * 
     * @param {number} page - 이동할 페이지 번호
     */
    const goToPage = (page) => {
      // 유효한 페이지 번호인지 확인
      if (page < 1 || page > totalPages.value) return;
      
      // 페이지 이동
      currentPage.value = page;
      if (process.env.NODE_ENV !== 'production') {
        console.log('페이지 이동:', page);
      }
    };
    
    /**
     * 페이지당 항목 수 변경 처리
     */
    const handleItemsPerPageChange = () => {
      // 페이지당 항목 수 변경 시 첫 페이지로 이동
      currentPage.value = 1;
      if (process.env.NODE_ENV !== 'production') {
        console.log('페이지당 항목 수 변경:', itemsPerPage.value);
      }
    };
    
    /**
     * 엑셀 다운로드 기능
     * 현재 필터링된 데이터를 엑셀 파일로 다운로드
     */
    const downloadExcel = () => {
      try {
        // 1. 다운로드할 데이터 준비
        const dataToExport = sortedData.value;
        
        if (dataToExport.length === 0) {
          alert('다운로드할 데이터가 없습니다.');
          return;
        }
        
        // 2. 보이는 컬럼만 추출
        const visibleFieldsInfo = visibleFields.value;
        
        // 3. 엑셀 데이터 형식으로 변환
        const excelData = dataToExport.map(item => {
          const row = {};
          // 보이는 필드만 포함
          visibleFieldsInfo.forEach(field => {
            row[field.label] = item[field.key];
          });
          return row;
        });
        
        // 4. 워크시트 생성
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        
        // 5. 워크북 생성 및 워크시트 추가
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, dataGridStore.dataType === 'members' ? '회원 데이터' : '영화 데이터');
        
        // 6. 현재 날짜로 파일명 생성
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식
        const fileName = `data-export-${dataGridStore.dataType}-${dateStr}.xlsx`;
        
        // 7. 파일 다운로드
        XLSX.writeFile(workbook, fileName);
        
        if (process.env.NODE_ENV !== 'production') {
          console.log('엑셀 파일 다운로드 완료:', fileName);
        }
      } catch (error) {
        console.error('엑셀 다운로드 중 오류 발생:', error);
        alert('엑셀 파일 생성 중 오류가 발생했습니다.');
      }
    };
    
    // 컴포넌트 마운트 시 실행
    onMounted(async () => {
      // 열 설정 로드
      loadColumnSettings(dataGridStore.dataType);
      
      // 데이터 가져오기
      await fetchData();
    });
    
    // 데이터 타입 변경 감시
    watch(() => dataGridStore.dataType, () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('데이터 타입 변경 감지:', dataGridStore.dataType);
      }
    });
    
    // 필요한 상태와 메서드 반환
    return {
      dataGridStore,
      loading,
      error,
      searchQuery,
      sortField,
      sortDirection,
      currentPage,
      itemsPerPage,
      allFields,
      visibleFields,
      showColumnSettings,
      filteredData,
      paginatedData,
      totalPages,
      displayedPageNumbers,
      paginationInfo,
      fetchData,
      changeDataType,
      sortBy,
      handleSearch,
      goToPage,
      handleItemsPerPageChange,
      openColumnSettings,
      closeColumnSettings,
      saveColumnSettings,
      resetColumnSettings,
      downloadExcel
    };
  }
};
</script>

<style scoped>
.admin-data-grid {
  padding: 20px;
  max-width: 100%;
}

.grid-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.data-type-selector {
  display: flex;
  gap: 10px;
}

.data-type-selector button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
  cursor: pointer;
  border-radius: 4px;
}

.data-type-selector button.active {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

/* 검색 영역 스타일 */
.search-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.search-box {
  display: flex;
  max-width: 500px;
  flex: 1;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
}

.search-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: 1px solid #4CAF50;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.search-button:hover {
  background-color: #45a049;
}

/* 그리드 액션 버튼 영역 */
.grid-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* 페이지당 항목 수 선택 스타일 */
.items-per-page {
  display: flex;
  align-items: center;
  gap: 8px;
}

.items-per-page select {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.data-table th, .data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.data-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

/* 정렬 가능한 헤더 스타일 */
.data-table th.sortable {
  cursor: pointer;
  position: relative;
  padding-right: 20px; /* 정렬 아이콘 공간 확보 */
}

.data-table th.sortable:hover {
  background-color: #e6e6e6;
}

.data-table th.sorted {
  background-color: #e6e6e6;
}

.sort-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
}

.data-table tbody tr:hover {
  background-color: #f5f5f5;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #666;
}

/* 페이지네이션 스타일 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 5px;
}

.pagination-button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  border-radius: 4px;
  min-width: 36px;
  text-align: center;
}

.pagination-button:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.pagination-button.active {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.pagination-button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.pagination-info {
  text-align: center;
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: 20px;
  color: #d9534f;
}

.btn {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #45a049;
}

/* 액션 버튼 스타일 */
.action-button {
  padding: 8px 16px;
  background-color: #f8f8f8;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.action-button:hover {
  background-color: #e6e6e6;
}

.icon {
  font-size: 16px;
}

/* 엑셀 다운로드 버튼 스타일 */
.excel-button {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.excel-button:hover {
  background-color: #45a049;
}

/* 열 설정 모달 스타일 */
.column-settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.modal-description {
  margin-top: 0;
  margin-bottom: 15px;
  color: #666;
}

.column-option {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.column-option input[type="checkbox"] {
  margin-right: 10px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.primary-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.primary-button:hover {
  background-color: #45a049;
}

.secondary-button {
  padding: 8px 16px;
  background-color: #f1f1f1;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.secondary-button:hover {
  background-color: #e6e6e6;
}
</style>