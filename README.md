
#   Vue3 프론트엔드 프로젝트

##  프로젝트 소개
Vue3 기반 프론트엔드 프로젝트입니다.  
홈페이지의 핵심 기능인 **회원 로그인 및 회원가입 기능**을 시작으로,  
향후 영화 정보 조회, 예매 기능 등을 추가하고  
**Spring Boot 백엔드(B_SpringBootProject)** 와 연결하여 데이터를 주고받는 **통합 프로젝트**로 발전할 예정입니다.

---

##  버전  
1.0V

---
##  프로젝트 개요
- **프로젝트명**: C_VUEProject
- **프레임워크**: Vue3
- **목표**:
  - 사용자 인증 기능(로그인/회원가입) 구현
  - 이후 영화관 서비스에 필요한 다양한 UI/UX 구성
  - 백엔드(Spring Boot)와 통신하여 실제 데이터를 처리하는 웹 서비스로 확장

---

##  프로젝트 구조
```
MOVIEMEMBER/
├── node_modules/
├── public/
├── src/
│   ├── assets/                    # 이미지, 스타일 등 정적 리소스
│   ├── components/                # 재사용 가능한 컴포넌트들
│   │   ├── AppFooter.vue          # 하단 푸터 컴포넌트
│   │   ├── HeaderBar.vue          # 상단 헤더 바
│   │   ├── MovieCard.vue          # 영화 카드 (상세 뷰 또는 리스트용)
│   │   ├── MovieSchedule.vue      # 영화 시간표 컴포넌트
│   │   ├── MovieSelector.vue      # 영화 선택 셀렉터
│   │   └── NavBar.vue             # 네비게이션 바
│   ├── router/
│   │   └── index.js               # Vue Router 설정
│   ├── store/                     # 상태 관리(Vuex or Pinia)
│   ├── views/                     # 페이지(라우터 연결 대상)
│   │   ├── AdminView.vue          # 관리자 페이지
│   │   ├── HomeView.vue           # 홈 화면
│   │   ├── InfoView.vue           # 영화 정보 페이지
│   │   ├── LoginView.vue          # 로그인 페이지
│   │   ├── MovieDetailView.vue    # 영화 상세 페이지
│   │   ├── MoviesView.vue         # 전체 영화 리스트
│   │   ├── ProfileView.vue        # 사용자 프로필 페이지
│   │   ├── ReserveView.vue        # 예매 페이지
│   │   └── SignupView.vue         # 회원가입 페이지
│   ├── App.vue                    # 루트 컴포넌트
│   └── main.js                    # 앱 진입점
├── package.json                   # 프로젝트 의존성 및 설정
├── README.md                      # 프로젝트 설명 파일
└── ...
```

---

##  기술 스택

- Vue 3 (Composition API)
- Vue Router
- 추후 필요 시 Pinia 예정
- 추후 axios 사용 예정
- 기본 CSS (또는 추가 라이브러리 예정)            


---

##  주요 기능

| 기능           | 설명                                     |
|----------------|------------------------------------------|
| 회원가입       | 사용자가 이메일/비밀번호 등을 입력해 계정 생성 |
| 로그인         | 등록된 사용자 정보로 로그인 처리          |
| 폼 유효성 검사 | 이메일 형식, 필수 입력 항목 등 체크 포함    |
| 페이지 이동    | Vue Router를 통한 컴포넌트 기반 라우팅     |

---

##  향후 개발 계획

- B_SpringProject(백엔드)와 연동 (Spring Boot + REST API)
- 영화 목록 조회, 상세 보기, 예매 기능 추가
- 마이페이지, 예매 내역 확인 등 사용자 중심 기능 확장
- 반응형 UI 및 사용자 경험 향상

---
## 실행 방법
- 의존성 설치<br>
npm install
- 개발 서버 실행<br>
npm run serve

---

## 접속
http://localhost:8081/

---


## 개발자 정보  
이름: 최정규  
이메일: javakyu4030@naver.com

---
## 실행 화면 예시

1. 로그인
![login](./moviemember/1. login-1.png)
2. 회원가입
![signup](./moviemember/2. signup-1.png)
3. 회원상세조회
![profile](./moviemember/3. profile-1.png)



---

## 수정 및 추가 사항

---