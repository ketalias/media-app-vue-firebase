<template>
  <div class="lib-container">
    <div class="user-header" :style="{ backgroundColor: headerColor }">
      <div class="color-picker">
        <label for="header-color">Change bg</label>
        <input type="color" id="header-color" v-model="headerColor" />
      </div>
    </div>
    <div class="user-information">
      <div class="user-pfp"></div>
      <div class="nickname">
        <h1>Username</h1>
      </div>
    </div>
    <div class="gallery">
      <div class="album-gallery">
        <PhotoCard
          v-for="(photo, index) in photos"
          :key="index"
          :imageSrc="photo.src"
          :imageAlt="photo.alt"
          :title="photo.title"
          :description="photo.description"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import PhotoCard from "../components/PhotoCard.vue";

const headerColor = ref("#210c5a");
</script>

<script>
export default {
  name: "PhotoLibrary",
  components: {
    PhotoCard,
  },
  data() {
    return {
      photos: [
        {
          src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGSlsKIzeABu_1K_Pa5V872ZWkx4GCFiHTKg&s",
          alt: "Beach sunset",
          title: "Beach Sunset",
          description: "A beautiful sunset over the ocean.",
        },
        {
          src: "https://hips.hearstapps.com/hmg-prod/images/snow-capped-mountain-peak-surrounded-by-clouds-on-royalty-free-image-1623254319.jpg",
          alt: "Mountain View",
          title: "Mountain View",
          description: "A stunning mountain landscape.",
        },
        {
          src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGSlsKIzeABu_1K_Pa5V872ZWkx4GCFiHTKg&s",
          alt: "Beach sunset",
          title: "Beach Sunset",
          description: "A beautiful sunset over the ocean.",
        },
        {
          src: "https://hips.hearstapps.com/hmg-prod/images/snow-capped-mountain-peak-surrounded-by-clouds-on-royalty-free-image-1623254319.jpg",
          alt: "Mountain View",
          title: "Mountain View",
          description: "A stunning mountain landscape.",
        },
        {
          src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGSlsKIzeABu_1K_Pa5V872ZWkx4GCFiHTKg&s",
          alt: "Beach sunset",
          title: "Beach Sunset",
          description: "A beautiful sunset over the ocean.",
        },
        {
          src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGSlsKIzeABu_1K_Pa5V872ZWkx4GCFiHTKg&s",
          alt: "Beach sunset",
          title: "Beach Sunset",
          description: "A beautiful sunset over the ocean.",
        },
        {
          src: "https://hips.hearstapps.com/hmg-prod/images/snow-capped-mountain-peak-surrounded-by-clouds-on-royalty-free-image-1623254319.jpg",
          alt: "Mountain View",
          title: "Mountain View",
          description: "A stunning mountain landscape.",
        },
        {
          src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGSlsKIzeABu_1K_Pa5V872ZWkx4GCFiHTKg&s",
          alt: "Beach sunset",
          title: "Beach Sunset",
          description: "A beautiful sunset over the ocean.",
        },
        {
          src: "https://hips.hearstapps.com/hmg-prod/images/snow-capped-mountain-peak-surrounded-by-clouds-on-royalty-free-image-1623254319.jpg",
          alt: "Mountain View",
          title: "Mountain View",
          description: "A stunning mountain landscape.",
        },
        {
          src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGSlsKIzeABu_1K_Pa5V872ZWkx4GCFiHTKg&s",
          alt: "Beach sunset",
          title: "Beach Sunset",
          description: "A beautiful sunset over the ocean.",
        },
      ],
      isModalOpen: false,
      selectedPhoto: null,
    };
  },
};
</script>

<style lang="scss">
.lib-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: auto;
  background-color: #0e0e0e;

  .user-header {
    top: 0;
    width: 100%;
    height: 25svh;
    background-color: #210c5a;
  }

  .user-information {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    position: relative;
    top: -10vh;
    left: 5vw;
    .user-pfp {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: #1a0243;
      top: 10vh;
      left: 5vw;
    }
    .nickname {
      color: white;
      font-size: 2rem;
      h1 {
        font-size: 2rem;
      }
      p {
        font-size: 1.5rem;
      }
    }
  }
  .gallery {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    position: relative;
    width: 100%;
    .album-gallery {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
    }
  }
  .color-picker {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    label {
      font-size: 1rem;
      color: grey;
    }
    input[type="color"] {
      border: none;
      width: 40px;
      height: 40px;
      cursor: pointer;
    }
  }
}
</style>
