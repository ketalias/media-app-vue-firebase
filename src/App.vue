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

body {
  font-family: "Roboto", serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-variation-settings: "wdth" 100;
  background: linear-gradient(90deg, #0b0b0b, #080477);
}

section {
  margin: 5vh 0;
  font-family: "Roboto", serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-variation-settings: "wdth" 100;
}

h1,
p {
  font-family: "Roboto", serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-variation-settings: "wdth" 100;
  color: white;
}
h1 {
  font-weight: 500;
  font-size: 5rem;
}

p {
  font-size: 1.5rem;
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

@media screen and (max-width: 768px) {
  /* Mobile-specific styles, if needed */
  nav {
    padding: 15px 20px;
  }
}
</style>
