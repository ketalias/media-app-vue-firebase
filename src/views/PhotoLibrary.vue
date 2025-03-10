<template>
  <div class="lib-container">
    <div class="user-header">
      <div class="user-info">
        <img src="../assets/boy.png" alt="user-avatar" />
        <h1>Jhon Doe</h1>
      </div>

      <div class="search">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by tag or description"
        />
        <input
          v-model="filterQuery"
          type="text"
          placeholder="Filter by category"
        />
      </div>
    </div>

    <div class="gallery">
      <div class="add-photo"><button>+</button></div>

      <div class="album-gallery">
        <PhotoCard
          v-for="(photo, index) in filteredImages"
          :key="index"
          :imageSrc="photo.src"
          :imageAlt="photo.alt"
          :images="images"
          :tags="photo.tags"
          :description="photo.description"
          :onCardClick="() => handleCardClick(index)"
          :onDeleteClick="handleDeleteClick"
        />
      </div>

      <button
        v-if="images.length > 7"
        @click="showAll = !showAll"
        class="show-all"
      >
        {{ showAll ? "Show Less" : "Show All" }}
      </button>

      <div class="folders-section">
        <FolderComponent />
      </div>
    </div>
  </div>
</template>

<script>
import PhotoCard from "../components/PhotoCard.vue";
import FolderComponent from "../components/FolderComponent.vue";

export default {
  name: "PhotoLibrary",
  components: {
    PhotoCard,
    FolderComponent,
  },
  data() {
    return {
      searchQuery: "",
      filterQuery: "",
      showAll: false,
      images: [
        {
          src: "https://i.pinimg.com/736x/bd/ab/29/bdab296a91a6333b1393436543b55d06.jpg",
          alt: "Sunset over the ocean",
          tags: ["Sunset", "Nature", "Sky"],
          description: "A stunning view of the sun setting over the ocean.",
        },
        {
          src: "https://i.pinimg.com/736x/68/b9/9d/68b99dce6cc1806f7423ce3081ec33c8.jpg",
          alt: "Beautiful mountain landscape",
          tags: ["Mountains", "Hiking", "Adventure"],
          description: "A breathtaking view of the mountains at sunrise.",
        },
        {
          src: "https://i.pinimg.com/736x/93/2c/d0/932cd0cff62f67b68cd61608c7d88a47.jpg",
          alt: "City skyline at night",
          tags: ["City", "Night", "Lights"],
          description: "A mesmerizing cityscape glowing under the stars.",
        },
        {
          src: "https://i.pinimg.com/736x/00/79/31/007931cdc2788c857f94cf37d68fe7ad.jpg",
          alt: "Serene forest pathway",
          tags: ["Forest", "Trees", "Greenery"],
          description: "A peaceful walk through a dense green forest.",
        },
        {
          src: "https://i.pinimg.com/736x/99/3e/e7/993ee76e8ed1a6b79261c01b552f3976.jpg",
          alt: "Calm beach waves",
          tags: ["Beach", "Ocean", "Waves"],
          description: "Gentle waves lapping onto a sandy shore at dusk.",
        },
        {
          src: "https://i.pinimg.com/736x/68/b9/9d/68b99dce6cc1806f7423ce3081ec33c8.jpg",
          alt: "Snow-covered mountains",
          tags: ["Snow", "Mountains", "Cold"],
          description: "A snow-capped mountain under a clear blue sky.",
        },
      ],
    };
  },
  methods: {
    handleCardClick(index) {
      this.currentImageIndex = index;
      this.isModalOpen = true;
    },
  },
  computed: {
    filteredImages() {
      let filtered = this.images;

      // Filter by search query (tags or description)
      if (this.searchQuery) {
        filtered = filtered.filter(
          (image) =>
            image.tags.some((tag) =>
              tag.toLowerCase().includes(this.searchQuery.toLowerCase())
            ) ||
            image.description
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase())
        );
      }

      // Filter by specific category (if needed)
      if (this.filterQuery) {
        filtered = filtered.filter((image) =>
          image.tags.includes(this.filterQuery)
        );
      }

      return this.showAll ? filtered : filtered.slice(0, 7);
    },
  },
};
</script>

<style lang="scss">
.lib-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #101011;

  .add-photo {
    display: flex;
    position: absolute;
    top: 20px;
    right: 20px;
    align-items: center;
    gap: 1rem;
    button {
      width: 50px;
      height: 50px;
      background: #fff;
      color: #000;
      border: none;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
    }
  }

  .user-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    top: 0;
    width: 100%;
    height: 15svh;
    background: linear-gradient(270deg, rgb(3, 3, 41) 0%, rgb(10, 10, 98) 100%);

    .search {
      display: flex;
      justify-content: center;
      gap: 1rem;
      padding: 20px;
      input {
        font-size: 1.5rem;
        padding: 0.2rem;
        width: 300px;
        border: none;
        color: #000;
      }
    }
    .user-info {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1rem;
      padding: 20px;
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        cursor: pointer;
      }
      h1 {
        font-size: 1.6rem;
        color: #fff;
      }
    }
  }
  .gallery {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    margin: 30px 0;
    position: relative;
    width: 100%;
    .album-gallery {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      gap: 5px;
      justify-content: center;
    }
    .show-all {
      background: none;
      width: 200px;
      height: 50px;
      cursor: pointer;
      background: url("../assets/three-dots.png") no-repeat;
      background-size: contain;
      background-position: center;
      border: none;
    }
  }
}
</style>
