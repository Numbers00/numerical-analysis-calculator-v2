<template>
<div id='app' class='container-fluid d-flex flex-column align-items-center'>
  <main-nav/>
  <router-view/>
</div>
</template>

<script>
import MainNav from '@/components/MainNav.vue'

export default {
  components: {
    MainNav
  }
}
</script>

<style>
.outline-card {
  border: 2px solid #c3cfd9;
  background-color: #fefffe;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
}
</style>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

// nav {
//   padding: 30px;

//   a {
//     font-weight: bold;
//     color: #2c3e50;

//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>
