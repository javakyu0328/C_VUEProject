<template>
  <nav class="navbar">
    <div class="nav-left">
      <router-link to="/">홈</router-link>
      <router-link to="/movies">영화</router-link>
      <router-link to="/info">정보</router-link>
    </div>
    <div class="nav-center">
       <span class="logo">JK MOVIE</span>
    </div>
    <div class="nav-right">
       <a href="#" @click="event">이벤트</a>
       <a href="#" @click="store">스토어</a>
      <router-link to="/login">로그인</router-link>
    </div> 
  </nav>
</template>

<script setup>
  function event(){
    alert('이벤트 페이지 기능은 아직 구현 중입니다.')
  }

    function store(){
    alert('스토어 페이지 기능은 아직 구현 중입니다.')
  }
</script>

<style scoped>
.navbar {
  justify-content: space-between;
  align-items: center;
  position: relative;
  background: #222;
  padding: 10px 20px;
  display: flex;
  gap: 20px;
  min-height: 60px; /* 네비게이션 바 높이 고정 */
}
/* 메뉴 그룹들이 너무 바깥으로 퍼지지 않도록 제한된 폭으로 배치 */
.nav-left,
.nav-right {
  display: flex;
  gap: 15px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
}

/* 왼쪽 메뉴를 왼쪽에서 조금 띄워서 중앙 근처로 */
.nav-left {
  left: 25%;
}

/* 오른쪽 메뉴를 오른쪽에서 조금 띄워서 중앙 근처로 */
.nav-right {
  right: 25%;
}
/* 이벤트, 스토어 (로고 옆에 붙는 메뉴) */
.nav-submenu {
  display: flex;
  gap: 15px;
}

.nav-left a {
  margin-right: 15px;
  color: white;
  text-decoration: none;
}
.nav-right a {
  color: white;
  text-decoration: none;
}
/* 가운데 로고 */
.nav-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.logo {
  font-weight: bold;
  font-size: 70px;
  color: #fff;
}
a {
  color: white;
  text-decoration: none;
}
a.router-link-exact-active {
  font-weight: bold;
  border-bottom: 2px solid #f90;
}
</style>