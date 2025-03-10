<template>
  <div class="album-tabs">
    <div v-if="!selectedAlbum" class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="['tab-button', { active: activeTab === tab.value }]"
        @click="switchTab(tab.value)"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <div v-if="selectedAlbum" class="album-photos">
      <button class="back-button" @click="selectedAlbum = null">
        🔙 Назад
      </button>
      <h3>{{ selectedAlbum.name }}</h3>
      <div v-if="selectedAlbum.photos.length > 0" class="photo-grid">
        <PhotoCard
          v-for="(image, index) in selectedAlbum.photos"
          :key="index"
          :imageSrc="image.src"
          :imageAlt="image.alt"
          :images="selectedAlbum.photos"
          :onLikeClick="likePhoto"
          :onMoveClick="movePhoto"
          :onHideClick="hidePhoto"
          :onDeleteClick="deletePhoto"
        />
      </div>
      <p v-else>Альбом поки що порожній 📭</p>
    </div>

    <div v-else class="tab-content">
      <div v-if="activeTab === 'private'" class="album-list">
        <h3>Особисті альбоми</h3>
        <ul>
          <li
            v-for="album in privateAlbums"
            :key="album.id"
            @click="openAlbum(album)"
            class="drop-zone"
            @dragover.prevent
            @drop="onDrop"
          >
            <img
              :src="album.thumbnail"
              alt="Album Folder"
              class="folder-image"
            />
            <span class="album-name">{{ album.name }}</span>
          </li>
        </ul>
      </div>

      <div v-if="activeTab === 'shared'" class="album-list">
        <h3>Спільні альбоми</h3>
        <ul>
          <li
            v-for="album in sharedAlbums"
            :key="album.id"
            @click="openAlbum(album)"
            class="drop-zone"
            @dragover.prevent
            @drop="onDrop"
          >
            <img
              :src="album.thumbnail"
              alt="Album Folder"
              class="folder-image"
            />
            <span class="album-name">{{ album.name }}</span>
          </li>
        </ul>
      </div>

      <div v-if="activeTab === 'favorites'" class="album-list">
        <h3>Вибрані альбоми</h3>
        <ul>
          <li
            v-for="album in favoriteAlbums"
            :key="album.id"
            @click="openAlbum(album)"
            class="drop-zone"
            @dragover.prevent
            @drop="onDrop"
          >
            <img
              :src="album.thumbnail"
              alt="Album Folder"
              class="folder-image"
            />
            <span class="album-name">{{ album.name }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="!selectedAlbum" class="create-album">
      <button @click="openModal">➕ Створити</button>
    </div>
    <div v-if="AlbumModal">
      <div class="create-album-form">
        <h2>Create Album</h2>

        <!-- Form to create album -->
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="albumName">Album Name:</label>
            <input
              id="albumName"
              v-model="albumName"
              type="text"
              placeholder="Enter album name"
              required
            />
          </div>

          <div class="form-group">
            <label for="albumTabs">Select Tab:</label>
            <select v-model="selectedTab" required>
              <option v-for="tab in tabs" :key="tab.value" :value="tab.value">
                {{ tab.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="albumColor">Choose Color:</label>
            <input id="albumColor" v-model="albumColor" type="color" required />
          </div>

          <button type="submit">Create Album</button>
          <button @click="closeModal">Create Album</button>
        </form>

        <!-- Display the result -->
        <div v-if="albumCreated" class="album-details">
          <h3>Album Created Successfully!</h3>
          <p><strong>Name:</strong> {{ albumName }}</p>
          <p><strong>Tab:</strong> {{ selectedTab }}</p>
          <p>
            <strong>Color:</strong>
            <span :style="{ backgroundColor: albumColor }">{{
              albumColor
            }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PhotoCard from "./PhotoCard.vue";
export default {
  components: {
    PhotoCard,
  },
  data() {
    return {
      activeTab: "private",
      selectedAlbum: null,
      albumName: "",
      AlbumModal: false,

      tabs: [
        { label: "Мої альбоми", value: "private", icon: "📂" },
        { label: "Спільні альбоми", value: "shared", icon: "👥" },
        { label: "Вибране", value: "favorites", icon: "⭐" },
      ],

      privateAlbums: [
        {
          id: 1,
          name: "Літній відпочинок",
          thumbnail: "https://freesvg.org/img/Folder-1.png",
          photos: [
            {
              src: "https://i.pinimg.com/736x/68/b9/9d/68b99dce6cc1806f7423ce3081ec33c8.jpg",
              alt: "Photo",
            },
            {
              src: "https://i.pinimg.com/736x/93/2c/d0/932cd0cff62f67b68cd61608c7d88a47.jpg",
              alt: "Photo",
            },
            {
              src: "https://i.pinimg.com/736x/68/b9/9d/68b99dce6cc1806f7423ce3081ec33c8.jpg",
              alt: "Photo",
            },
            {
              src: "https://i.pinimg.com/736x/93/2c/d0/932cd0cff62f67b68cd61608c7d88a47.jpg",
              alt: "Photo",
            },
            {
              src: "https://i.pinimg.com/736x/68/b9/9d/68b99dce6cc1806f7423ce3081ec33c8.jpg",
              alt: "Photo",
            },
            {
              src: "https://i.pinimg.com/736x/93/2c/d0/932cd0cff62f67b68cd61608c7d88a47.jpg",
              alt: "Photo",
            },
            {
              src: "https://i.pinimg.com/736x/68/b9/9d/68b99dce6cc1806f7423ce3081ec33c8.jpg",
              alt: "Photo",
            },

            {
              src: "https://i.pinimg.com/736x/93/2c/d0/932cd0cff62f67b68cd61608c7d88a47.jpg",
              alt: "Photo",
            },
            {
              src: "https://i.pinimg.com/736x/93/2c/d0/932cd0cff62f67b68cd61608c7d88a47.jpg",
              alt: "Photo",
            },
            {
              src: "https://i.pinimg.com/736x/bd/ab/29/bdab296a91a6333b1393436543b55d06.jpg",
              alt: "Photo",
            },
            {
              src: "https://i.pinimg.com/736x/68/b9/9d/68b99dce6cc1806f7423ce3081ec33c8.jpg",
              alt: "Photo",
            },
            {
              src: "https://i.pinimg.com/736x/93/2c/d0/932cd0cff62f67b68cd61608c7d88a47.jpg",
              alt: "Photo",
            },
            {
              src: "https://i.pinimg.com/736x/00/79/31/007931cdc2788c857f94cf37d68fe7ad.jpg",
              alt: "Photo",
            },
          ],
        },
        {
          id: 2,
          name: "Робочі моменти",
          thumbnail: "https://freesvg.org/img/Folder-1.png",
          photos: [],
        },
      ],
      sharedAlbums: [
        {
          id: 1,
          name: "Вечірка",
          thumbnail: "https://freesvg.org/img/Folder-1.png",
          photos: [
            {
              src: "https://thumbs.dreamstime.com/b/%D0%BC%D0%BE-%D0%BE-%D0%B0%D1%8F-%D0%BF%D0%B0%D1%80%D1%82%D0%B8%D1%8F-31137048.jpg",
            },
          ],
        },
        {
          id: 2,
          name: "Поїздка в Карпати",
          thumbnail: "https://freesvg.org/img/Folder-1.png",
          photos: [
            {
              src: "https://7cars.com.ua/wp-content/uploads/2019/03/Carpathian-mountains.jpg",
            },
          ],
        },
      ],
      favoriteAlbums: [],
    };
  },
  methods: {
    openModal() {
      this.AlbumModal = true;
    },
    closeModal() {
      this.AlbumModal = false;
    },
    switchTab(tab) {
      this.activeTab = tab;
    },
    createAlbum() {},
    openAlbum(album) {
      this.selectedAlbum = album;
    },
    onDrop(event) {
      const droppedImageSrc = event.dataTransfer.getData("text/plain");
      console.log(`Dropped image: ${droppedImageSrc}`);

      // Handle the dropped image data (you can remove the image from one array and add it to another)
      // You can call a function here to update the image collection
      // Example: this.handleImageDrop(droppedImageSrc);
    },
  },
};
</script>

<style lang="scss">
button {
  border-radius: 0px;
}
.album-tabs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100vw;
  background-color: rgb(17, 17, 18);
  padding: 1rem;
  .tabs {
    display: flex;
    width: 100%;
    justify-content: center;
    gap: 1rem;
    button {
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      background-color: rgb(15, 15, 16);
      cursor: pointer;
      font-weight: 600;
      font-size: 24px;
      &.active {
        background-color: rgb(15, 14, 88);
      }
    }
  }
  .tab-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: white;
    h3 {
      font-size: 90px;
      color: gray;
      margin: 10px 0;
    }
    ul {
      display: flex;
      gap: 20px;
      list-style: none;
      padding: 0;
      li {
        display: flex;
        align-items: center;
        flex-direction: column;
        color: white;
        font-size: 22px;
        font-weight: bold;
        img {
          width: 200px;
        }
      }
    }
  }
  .create-album {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 15px;
    button {
      padding: 0.5rem 1rem;
      font-size: 18px;
      border: none;
      background-color: rgb(16, 9, 61);
      color: white;
      cursor: pointer;
    }
  }
  .album-photos {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    color: white;
    h3 {
      font-size: 70px;
      color: gray;
      margin: 10px 0;
    }
    .photo-grid {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      gap: 5px;
      justify-content: center;
    }
    p {
      font-size: 24px;
      color: gray;
    }
    .back-button {
      padding: 0.5rem 1rem;
      font-size: 18px;
      border: none;
      background-color: rgb(16, 9, 61);
      color: white;
      cursor: pointer;
    }
  }
}
</style>
