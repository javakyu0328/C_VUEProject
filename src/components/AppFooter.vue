<!-- src/components/AppFooter.vue -->
<template>
  <footer class="footer">
    <p>© 2025 JK Movie Site. All rights reserved.</p>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60px;
  text-align: center;
  padding: 20px 0;
  background-color: #222;
  color: white;
  margin-top: 50px;
}
</style>