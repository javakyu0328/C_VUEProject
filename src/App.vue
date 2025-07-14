<template>
 <div id="app">
    <NavBar />
    <main>
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script >
  import NavBar from './components/NavBar.vue'
  import AppFooter from './components/AppFooter.vue';

  export default {
  components: { NavBar, AppFooter }
  } 
</script>

<style>
/* 기본 스타일 유지 */
</style>