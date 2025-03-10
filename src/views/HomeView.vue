<template>
  <div class="container">
    <section class="first-div">
      <div class="logo-container">
        <img class="logo" src="..\assets\logo.png" alt="logo" />
        <span>WebAlb</span>
      </div>
      <router-link to="/login"
        ><button class="top-button">login</button></router-link
      >
      <div class="content">
        <div class="textNgif">
          <div class="text">
            <div>
              <h1>Seamlessly web Album for everyone</h1>
              <p>
                Preserve your memories, share your moments, and relive them
                anytime.
              </p>
            </div>
            <router-link to="/library"
              ><button>Start journey</button>
            </router-link>
          </div>
          <div class="gif"></div>
        </div>
      </div>
    </section>
    <section class="carousel-section">
      <div class="carousel-container">
        <Carousel class="carousel" />
      </div>
      <h1>
        <span style="color: rgb(52 102 250)">Slide</span> your photos
        beautifully
      </h1>
    </section>
    <section class="features-section">
      <div class="text">
        <h1>Our <span style="color: rgb(52 102 250)">features</span></h1>
        <p>Your memories, beautifully preserved..</p>
      </div>
      <div class="blocks">
        <div
          class="block"
          v-for="(block, index) in blocks"
          :key="index"
          @mouseover="showText(index)"
          @mouseleave="hideText"
        >
          <img :src="blockBackgrounds[index]" alt="Block Image" />

          <h2 class="block-heading">{{ blocksH[index] }}</h2>
          <p v-if="hoveredIndex === index" class="hover-text">
            {{ block }}
          </p>
        </div>
      </div>
    </section>
    <footer class="album-footer">
      <div class="footer-content">
        <div class="footer-logo">
          <img src="../assets/logo.png" alt="Album Logo" />
          <span>© 2025 Your Album Name</span>
        </div>
        <div class="footer-links">
          <a href="#about">About</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy Policy</a>
        </div>
        <div class="footer-socials">
          <a href="https://facebook.com" target="_blank" aria-label="Facebook"
            >Facebook</a
          >
          <a href="https://instagram.com" target="_blank" aria-label="Instagram"
            >Instagram</a
          >
          <a href="https://twitter.com" target="_blank" aria-label="Twitter"
            >Twitter</a
          >
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import bookImage from "@/assets/book.png";
import likeImage from "@/assets/like.png";
import markImage from "@/assets/mark.png";
import Carousel from "@/components/CarouselComp.vue";
</script>

<script>
export default {
  name: "HomeView",
  components: { Carousel },
  data() {
    return {
      hoveredIndex: null,
      blocksH: ["Private", "Easily", "Keep"],
      blocks: [
        "Private or public folders",
        "Easily add your photos and albums",
        "Keep your memories safe",
      ],
      blockBackgrounds: [markImage, likeImage, bookImage],
    };
  },
  methods: {
    showText(index) {
      this.hoveredIndex = index;
    },
    hideText() {
      this.hoveredIndex = null;
    },
  },
};
</script>

<style lang="scss">
$dark-bg: #0c0c0c;
$white: #ffffff;
$primary-color: #06268e;
$footer-bg: #1c1c1c;
$gradient-start: #000000;
$gradient-end: #0e0371;
$text-color: rgb(213, 213, 213);
$shadow-color: rgba(0, 0, 0, 0.3);
$hover-shadow-color: rgba(112, 112, 112, 0.5);
$overlay-color: rgba(0, 0, 0, 0.59);

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Roboto", serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-variation-settings: "wdth" 100;
  background-color: #0a0a0a;
}

section {
  margin: 5vh 0;
  font-family: "Roboto", serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-variation-settings: "wdth" 100;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
}

h1,
p {
  font-family: "Roboto", serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-variation-settings: "wdth" 100;
  color: $text-color;
}
h1 {
  font-weight: 500;
  font-size: 5rem;
}

p {
  font-size: 1.5rem;
}

.first-div {
  margin: 30px 0;
  height: 90vh;
  width: 95%;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(270deg, $gradient-start 0%, $gradient-end 100%);
  box-shadow: 0 0 20px $primary-color, 0 0 40px $primary-color,
    0 0 60px $primary-color, 0 0 80px $primary-color;
  border: 1px solid $primary-color;
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $overlay-color;
    z-index: 1;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
    justify-content: space-evenly;
  }

  .textNgif {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .text {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: flex-start;
    width: 35%;
    height: 80%;
  }

  .gif {
    z-index: 2;
    width: 30%;
    height: 70%;
    background: url("../assets/folder.png");
    background-position: center;
    transition: all 0.3s ease-in-out;
    -webkit-filter: drop-shadow(5px 5px 5px #222);
    filter: drop-shadow(65px 65px 65px #232a95);
    &:hover {
      rotate: -20deg;
    }
  }

  h1,
  p {
    position: relative;
    z-index: 2;
    color: white;
    text-align: left;
  }

  .top-button {
    position: absolute;
    top: 20px;
    right: 40px;
    width: 100px;
  }

  .logo-container {
    position: absolute;
    display: flex;
    align-items: center;
    top: 20px;
    left: 20px;
    width: 100px;
    height: 100px;
    z-index: 2;
    color: rgb(255, 255, 255);
    .logo {
      width: 100px;
      height: 100px;
    }
    span {
      font-size: 1.5rem;
      font-weight: 700;
    }
  }
}

button {
  padding: 10px;
  width: 300px;
  font-size: 1rem;
  color: $dark-bg;
  background: $white;
  border: 3px solid $dark-bg;
  border-radius: 10px;
  transition: 0.3s ease-in-out;
  z-index: 3;
  font-weight: 800;

  &:hover {
    color: $white;
    border: 3px solid $white;
    background: rgba($primary-color, 0.26);
  }
}

a {
  z-index: 100;
}

.features-section {
  height: 100vh;
  width: 95%;
  border-radius: 20px;
  box-shadow: 0 0 20px $primary-color, 0 0 40px $primary-color,
    0 0 60px $primary-color, 0 0 80px $primary-color;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: $dark-bg;

  .text {
    height: auto;
    width: 100%;
    h1 {
      font-size: 5rem;
      font-weight: 500;
    }
    p {
      font-size: 2rem;
      font-weight: 300;
    }
  }
}

.blocks {
  display: flex;
  width: 90%;
  height: 70%;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 50px;
}

.block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 25%;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 4px 10px $shadow-color;
  transition: all 0.3s ease-in-out;
  filter: saturate(0.2);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform: scale(1);
  padding: 20px;

  &:hover {
    transform: scale(1.2);
    height: auto;
    filter: saturate(1);
    box-shadow: 0 0 20px $primary-color, 0 0 40px $primary-color,
      0 0 60px $primary-color, 0 0 10px $primary-color;
    z-index: 10;
  }

  &:not(:hover) {
    transform: scale(0.8);
    opacity: 0.7;
  }

  img {
    width: 60%;
    height: auto;
    border: none;
    outline: none;
    box-shadow: none;
    background: transparent;
  }

  h2 {
    font-size: 3.5rem;
    font-weight: 500;
    color: $white;
    margin-top: 10px;
  }

  .hover-text {
    transition: all 5s ease-in-out;
    z-index: 10;
    color: $white;
    padding: 5px;
    border-radius: 5px;
    font-size: 2rem;
    font-weight: 300;
    width: 90%;
  }
}

.carousel-section {
  display: flex;
  flex-direction: column-reverse;
  height: 100svh;
  width: 100svw;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
  padding: 5rem 0rem;
  background-color: $dark-bg;
  position: relative;
  overflow: hidden;

  .carousel-container {
    display: flex;
    align-items: center;
    width: 100%;
    height: 80%;
    background-color: #080634;
  }

  .carousel {
    width: 100%;
    height: 100%;
  }

  h1 {
    font-size: 6rem;
    font-weight: 500;
  }
}

.album-footer {
  background-color: #05011d;
  color: #fff;
  text-align: center;
  padding: 2rem 0;
  width: 100%;
  margin-top: 5vh;

  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.2rem;
      img {
        width: 50px;
        height: auto;
      }
    }

    .footer-links {
      display: flex;
      gap: 1.5rem;

      a {
        color: #aaa;
        text-decoration: none;
        transition: color 0.3s;
        &:hover {
          color: #fff;
        }
      }
    }

    .footer-socials {
      display: flex;
      gap: 1rem;

      a {
        color: #aaa;
        text-decoration: none;
        font-size: 1.2rem;
        transition: color 0.3s;
        &:hover {
          color: #fff;
        }
      }
    }
  }
}
</style>
