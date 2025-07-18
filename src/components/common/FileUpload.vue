<template>
  <div class="file-upload" :class="{ 'has-error': error }">
    <div
      class="upload-area"
      :class="{ 'drag-over': isDragging, 'has-file': !!preview }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <div v-if="!preview" class="upload-placeholder">
        <div class="upload-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <p class="upload-text">
          {{ dragDropText }}
        </p>
        <p class="upload-hint">
          {{ acceptText }}
        </p>
        <p v-if="maxSizeText" class="upload-hint">
          {{ maxSizeText }}
        </p>
      </div>
      
      <div v-else class="preview-container">
        <img :src="preview" alt="미리보기" class="preview-image" />
        <button type="button" class="remove-button" @click.stop="removeFile">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
    
    <input
      ref="fileInput"
      type="file"
      class="file-input"
      :accept="accept"
      @change="handleFileChange"
    />
    
    <div v-if="error" class="error-message">{{ error }}</div>
    
    <div v-if="file" class="file-info">
      <div class="file-name">{{ file.name }}</div>
      <div class="file-size">{{ formattedSize }}</div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { formatFileSize, isImageFile } from '../../services/utilService';

export default {
  name: 'FileUpload',
  
  props: {
    /**
     * 허용되는 파일 타입 (MIME 타입)
     */
    accept: {
      type: String,
      default: 'image/*'
    },
    
    /**
     * 최대 파일 크기 (바이트)
     */
    maxSize: {
      type: Number,
      default: 5 * 1024 * 1024 // 5MB
    },
    
    /**
     * 드래그 앤 드롭 안내 텍스트
     */
    dragDropText: {
      type: String,
      default: '이미지를 여기에 끌어다 놓거나 클릭하여 업로드하세요'
    },
    
    /**
     * 파일 타입 안내 텍스트
     */
    acceptText: {
      type: String,
      default: '지원 형식: JPG, PNG, GIF'
    },
    
    /**
     * 최대 크기 안내 텍스트
     */
    maxSizeText: {
      type: String,
      default: '최대 5MB'
    },
    
    /**
     * 초기 이미지 URL
     */
    initialValue: {
      type: String,
      default: ''
    }
  },
  
  emits: ['update:file', 'update:url', 'error'],
  
  setup(props, { emit }) {
    const fileInput = ref(null);
    const file = ref(null);
    const preview = ref(props.initialValue || '');
    const error = ref('');
    const isDragging = ref(false);
    
    // 파일 크기 포맷팅
    const formattedSize = computed(() => {
      return file.value ? formatFileSize(file.value.size) : '';
    });
    
    // 파일 입력 트리거
    const triggerFileInput = () => {
      if (!preview.value) {
        fileInput.value.click();
      }
    };
    
    // 파일 변경 처리
    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      processFile(selectedFile);
    };
    
    // 드래그 오버 처리
    const handleDragOver = () => {
      isDragging.value = true;
    };
    
    // 드래그 리브 처리
    const handleDragLeave = () => {
      isDragging.value = false;
    };
    
    // 드롭 처리
    const handleDrop = (event) => {
      isDragging.value = false;
      if (event.dataTransfer && event.dataTransfer.files) {
        const droppedFile = event.dataTransfer.files[0];
        processFile(droppedFile);
      }
    };
    
    // 파일 처리
    const processFile = (selectedFile) => {
      error.value = '';
      
      if (!selectedFile) {
        return;
      }
      
      // 파일 타입 검증
      if (!isImageFile(selectedFile)) {
        error.value = '지원되지 않는 파일 형식입니다. 이미지 파일만 업로드 가능합니다.';
        emit('error', error.value);
        return;
      }
      
      // 파일 크기 검증
      if (selectedFile.size > props.maxSize) {
        error.value = `파일 크기가 너무 큽니다. 최대 ${formatFileSize(props.maxSize)}까지 업로드 가능합니다.`;
        emit('error', error.value);
        return;
      }
      
      // 파일 설정 및 미리보기 생성
      file.value = selectedFile;
      createPreview(selectedFile);
      
      // 부모 컴포넌트에 파일 전달
      emit('update:file', selectedFile);
    };
    
    // 미리보기 생성
    const createPreview = (file) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        preview.value = e.target.result;
        emit('update:url', preview.value);
      };
      
      reader.readAsDataURL(file);
    };
    
    // 파일 제거
    const removeFile = () => {
      file.value = null;
      preview.value = '';
      fileInput.value.value = '';
      emit('update:file', null);
      emit('update:url', '');
    };
    
    return {
      fileInput,
      file,
      preview,
      error,
      isDragging,
      formattedSize,
      triggerFileInput,
      handleFileChange,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      removeFile
    };
  }
};
</script>

<style scoped>
.file-upload {
  margin-bottom: 20px;
}

.upload-area {
  position: relative;
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #4a90e2;
  background-color: #f0f7ff;
}

.drag-over {
  border-color: #4a90e2;
  background-color: #f0f7ff;
}

.has-error .upload-area {
  border-color: #e74c3c;
  background-color: #fff0f0;
}

.upload-placeholder {
  width: 100%;
}

.upload-icon {
  margin-bottom: 15px;
  color: #666;
}

.upload-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.upload-hint {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.file-input {
  display: none;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
}

.file-info {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #f0f7ff;
  border-radius: 4px;
  font-size: 14px;
}

.file-name {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}

.file-size {
  color: #666;
}

.preview-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
  object-fit: contain;
}

.remove-button {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.remove-button:hover {
  background-color: #f8f8f8;
  transform: scale(1.1);
}

.remove-button svg {
  width: 16px;
  height: 16px;
  color: #666;
}

@media (max-width: 768px) {
  .upload-area {
    padding: 15px;
    min-height: 150px;
  }
  
  .upload-icon svg {
    width: 36px;
    height: 36px;
  }
  
  .upload-text {
    font-size: 14px;
  }
  
  .upload-hint {
    font-size: 12px;
  }
}
</style>