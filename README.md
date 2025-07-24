
#   Vue3 프론트엔드 프로젝트

##  프로젝트 소개
Vue3 기반 프론트엔드 프로젝트입니다.  
본 프로젝트는 **Vue3 + Vite 기반 Single Page Application**으로,  
Spring Boot 기반 백엔드 **E_SpringBootBackEnd**와 통합되어 동작합니다.  
회원가입, 로그인, 회원탈퇴 등 회원관리 기능 및 영화 목록 조회, 정보 등록(관리자 기능) 등을 수행합니다.

---

##  버전  
1.0V

---

##  프로젝트 개요
- **프로젝트명**: C_VUEProject
- **프레임워크**: Vue3
- **목표**:
  - 사용자 인증 기능(로그인/회원가입/정보수정/회원탈퇴) 구현
  - 페이지별 로그인 정보 공유
  - 이후 영화관 서비스에 필요한 다양한 UI/UX 구성
  - 백엔드(Spring Boot)와 통신하여 실제 데이터를 처리하는 웹 서비스로 확장

---

##  백엔드 연동 주요 기능

| 기능 | 설명 | 연동 API | Vue 페이지 / 컴포넌트 |
|------|------|----------|------------------------|
| **회원가입** | 신규 사용자 등록 | `POST /api/member/signup` | `SignUp.vue` |
| **로그인** | JWT 토큰 발급 & 세션 등록 | `POST /api/member/login` | `Login.vue`, `AuthLayout.vue` |
| **로그아웃** | 토큰 삭제 및 세션 종료 | `POST /api/member/logout` 또는 `DELETE /api/member/session` | `Header.vue` |
| **회원 탈퇴** | 본인 계정 삭제 | `DELETE /api/member/{id}` | `Profile.vue`, `Settings.vue` |
| **회원정보 조회/수정** | 프로필 표시 및 변경 | `GET/PUT /api/member/{id}` | `Profile.vue` |
| **영화 목록 조회** | 전체 영화 리스트 | `GET /api/movies` | `MovieList.vue` |
| **영화 상세조회** | 개별 영화 정보 | `GET /api/movies/{id}` | `MovieDetail.vue` |
| **영화 추천 보기** | 사용자 맞춤 추천 | `GET /api/movies/recommend` | `Recommend.vue` |
| **영화 등록 (관리자)** | 영화 데이터 추가 | `POST /api/movies` | `Admin/MovieForm.vue` |
| **영화 수정/삭제 (관리자)** | 영화 정보 수정/삭제 | `PUT/DELETE /api/movies/{id}` | `Admin/MovieForm.vue` |


---
##  기술 스택

- **프레임워크**: Vue 3 + Vite
- **상태관리**: Pinia   
- **라우팅**: Vue Router  
- **HTTP 통신**: Axios  
- **인증/인가**: JWT 토큰 헤더 저장 및 Interceptor 적용

---
## 실행 방법
- 의존성 설치<br>
npm install
- 개발 서버 실행<br>
npm run serve

---

## 접속
- http://localhost:8082/

- 백엔드(E_SpringBootBackEnd)도 http://localhost:8083/ 에서 실행되어 있어야 정상 동작

---


## 개발자 정보  
이름: 최정규  
이메일: javakyu4030@naver.com

---
## 실행 화면 예시

1. 로그인
![login](./src/assets/images/login.jpg)
2. 회원가입
![signup](./src/assets/images/signup.png)
3. 회원상세조회
![profile](./src/assets/images/profile.png)
4. 홈화면
![alt text](./src/assets/images/home.png)
5. 영화
![profile](./src/assets/images/movie.png)
6. 정보
![profile](./src/assets/images/inform.png)


---

## 수정 및 추가 사항
---

###  1. 아이디 중복(유효성) 검사 기능
회원가입 시, 중복된 아이디를 사전에 확인하여 사용자 경험을 개선하고, 서버 저장 오류를 방지합니다.

---

###  버전  
1.1V

---



###  기능요약  
| 기능           | 설명                                     |
|----------------|------------------------------------------|
| 검사 시점       | 아이디 입력 시 자동 검사 (watch()) 가능 |
| 요청 방식       | Vue에서 axios.post()를 이용한 비동기 요청          |
| 백엔드 API 경로 | POST /api/member/id-check    |
| 응답 포맷       | "ok": 사용 가능, "no": 중복 아이디     |
| 가입 제어       | 중복일 경우 가입 버튼 비활성화 또는 가입 요청 차단 (alert 출력)     |
---

### 실행 화면 예시
1. 아이디 사용 가능
![alt text](./src/assets/images/idok.png)
2. 아이디 중복
![alt text](./src/assets/images/idno.png)
3. 아이디 중복시 가입 불가
![alt text](./src/assets/images/idnoalert.png)

<br>

---

### 2. 관리자 전용 페이지(영화 등록)접근 제어 기능 
관리자 아이디(admin)로 로그인한 경우에만 영화 등록 페이지(/movie/register)에 접근할 수 있도록 구현하였습니다. 일반 사용자는 해당 메뉴 또는 페이지에 접근할 수 없습니다.

---

###  버전  
1.2V

---

### 구현 개요

- 로그인 시 서버에서 로그인한 사용자 ID를 받아와 Pinia 상태에 저장
- 라우터에서 해당 ID가 admin인지 확인하여 접근 권한 제어
- 메뉴 항목에서도 관리자일 때만 '영화 등록' 메뉴 노출

### 핵심 코드

- 관리자 전용 메뉴 조건부 렌더링
```
<!-- Header.vue -->
<template>
  <nav>
    <router-link to="/">홈</router-link>
    <router-link v-if="authStore.userId === 'admin'" to="/movie/register">영화 등록</router-link>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>
```

- 라우터에서 관리자만 접근 가능하게 설정
```
// router/index.js
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/movie/register',
    name: 'MovieRegister',
    component: () => import('@/views/MovieRegister.vue'),
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore()
      if (authStore.userId === 'admin') {
        next()
      } else {
        alert('접근 권한이 없습니다.')
        next('/') // 홈으로 리디렉션
      }
    }
  }
]

```

### 실행 화면 예시
1. 관리자 계정 로그인시 (admin)
![alt text](./src/assets/images/admin.png)

<br>

---

### 3. 관리자 데이터 그리드 기능
이 업데이트는 **관리자용 데이터 그리드 기능**을 추가한 내용을 설명합니다.  
관리자(admin)는 이 기능을 통해 **회원 및 영화 데이터를 효율적으로 조회, 검색, 정렬, 필터링, 다운로드**할 수 있습니다.

###  버전  
1.3V

---

### 주요 기능

1) 관리자 권한 제어
- 관리자 로그인 시에만 진입 가능한 전용 페이지
- 관리자 메뉴 조건부 표시

2) 데이터 그리드 기능
- 회원 ↔ 영화 데이터 전환 가능
- 데이터 유형에 맞는 컬럼 자동 구성
- 로딩 중 및 에러 발생 시 UI 상태 표시

3) 검색, 정렬, 페이지네이션
- 입력어 기반 필터링
- 컬럼 클릭 시 오름/내림차순 정렬
- 페이지 이동 및 페이지당 항목 수 조절

4) 열 설정 (커스터마이징)
- 표시할 열 선택 가능
- 로컬스토리지 기반 사용자 설정 저장
- 초기 설정 복원 기능

5) 엑셀 다운로드
- 현재 화면에 보이는 데이터만 다운로드
- 다운로드 시 날짜 포함된 파일명 자동 생성 (`data-export-YYYY-MM-DD.xlsx`)

---

### 기술 스택

- **Vue 3 (Composition API)**
- **Pinia** (상태 관리)
- **Vue Router**
- **Axios** (API 통신)
- **xlsx** (엑셀 다운로드)

---

### 사용 방법

- **관리자 접근**<br>
admin 계정으로 로그인 후, 네비게이션에서 "관리자" 메뉴 클릭
- **데이터 전환**<br>
"회원 데이터" / "영화 데이터" 버튼을 클릭하여 전환
- **검색**<br>
상단 검색창에 키워드 입력 → 해당 항목만 필터링
- **정렬**<br>
컬럼 헤더 클릭 → 오름차순 / 내림차순 정렬 토글
- **페이지네이션**<br>
페이지 이동 버튼 클릭 또는 페이지당 항목 수 변경
- **열 설정**<br>
"열 설정" 버튼 → 원하는 열만 선택 표시
- **엑셀 다운로드**<br>
엑셀 다운로드" 버튼 클릭 → 필터링된 현재 데이터만 다운로드

---

### 참고 사항
- 현재 백엔드가 미연결된 경우 더미 JSON 데이터로 대체됩니다.
- 백엔드 서버 주소: http://localhost:8083
- 사용 API:<br>
회원 전체 조회: /api/member/all<br>
영화 전체 조회: /api/movies

---

### 실행 화면 예시
1. 관리자 계정 로그인시 '관리자'탭 노출<br>
![alt text](./src/assets/images/adminPage.png)<br>

2. 그리드 페이지<br>
(회원목록)<br>
![alt text](./src/assets/images/gridMember.png)<br>
(영화목록)
![alt text](./src/assets/images/gridMovie.png)<br>
(열 설정)
![alt text](./src/assets/images/columnSetting.png)<br>
(엑셀파일 다운로드)
![alt text](./src/assets/images/excelDown.png)<br>