<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from "@/components/NavBar.vue";

export default {
  components: {
    Navbar,
  },
};
</script>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
}

::-webkit-scrollbar {
  display: none; /* If you want to hide the scrollbar */
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  overflow-x: hidden;

  font-family: "Roboto", sans-serif; /* Ensuring the correct font is used */
  font-optical-sizing: auto;
  font-style: normal;
}

nav {
  padding: 20px 30px; /* Adjust padding as needed */
}

a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none; /* Removes the default underline */

  &.router-link-exact-active {
    color: #42b983;
  }
}

@media screen and (max-width: 768px) {
  /* Mobile-specific styles, if needed */
  nav {
    padding: 15px 20px;
  }
}
</style>
