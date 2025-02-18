<template>
  <nav class="navbar">
    <div class="navbar-toggle" @click="toggleMenu">
      <span class="navbar-toggle-icon"></span>
    </div>

    <div :class="['navbar-links', { active: isMenuOpen }]">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/login">Sign In</a></li>
        <li><a href="/library">Library</a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  position: fixed;
  top: 0;
  right: 40%;
  z-index: 1001;
  justify-content: space-between;
  align-items: center;
  background-color: #0a0541ba;
  border-radius: 20px;
  padding: 10px 20px;
  color: white;
}

.navbar-logo a {
  font-size: 24px;
  text-decoration: none;
  color: white;
}

.navbar-toggle {
  display: none;
  cursor: pointer;
}

.navbar-toggle-icon {
  width: 30px;
  height: 4px;
  background-color: white;
  margin: 6px 0;
  transition: 0.4s;
}

.navbar-links {
  display: flex;
}

.navbar-links ul {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}

.navbar-links li {
  margin: 0 10px;
}

.navbar-links a {
  text-decoration: none;
  color: white;
  font-size: 18px;
}

.navbar-links a:hover {
  color: #8fa6dc;
}

@media screen and (max-width: 768px) {
  .navbar-links {
    position: absolute;
    top: 60px;
    right: 0;
    background-color: #080866;
    width: 100%;
    text-align: center;
    padding: 10px 0;
    display: none;
  }

  .navbar-links.active {
    display: block;
  }

  .navbar-toggle {
    display: block;
  }

  .navbar-links ul {
    flex-direction: column;
  }

  .navbar-links li {
    margin: 10px 0;
  }

  .navbar-toggle-icon {
    background-color: white;
  }
}
</style>
