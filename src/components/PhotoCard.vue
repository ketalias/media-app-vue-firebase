<template>
  <div :draggable="true" @dragstart="onDragStart" @dragend="onDragEnd">
    <div class="photo-card" @click="openModal">
      <img :src="imageSrc" :alt="imageAlt" class="photo-card-image" />
    </div>

    <div v-if="isModalOpen" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="actions">
          <!-- Like Button -->
          <button class="like-button" @click.stop="handleLikeClick">
            <img src="../assets/circle-heart.png" alt="like" />
          </button>

          <!-- Move to Folder -->
          <button class="move-folder-button" @click.stop="handleMoveToFolder">
            <img src="../assets/move-to-folder.png" alt="move to folder" />
          </button>

          <!-- Hide Image -->
          <button class="hide-button" @click.stop="handleHideImage">
            <img src="../assets/eye-crossed.png" alt="hide image" />
          </button>

          <!-- Delete Button -->
          <button class="delete-button" @click.stop="handleDeleteClick">
            <img src="../assets/trash.png" alt="delete" />
          </button>

          <!-- Download Image -->
          <button class="download-button" @click.stop="handleDownload">
            <img src="../assets/trash.png" alt="download" />
          </button>

          <!-- Share Image -->
          <button class="share-button" @click.stop="handleShare">
            <img src="../assets/trash.png" alt="share" />
          </button>

          <!-- Edit Image -->
          <button class="edit-button" @click.stop="handleEdit">
            <img src="../assets/trash.png" alt="edit" />
          </button>

          <!-- AI Caption Generator -->
          <button class="caption-button" @click.stop="generateAICaption">
            <img src="../assets/trash.png" alt="AI caption" />
          </button>

          <!-- Slideshow -->
          <button class="slideshow-button" @click.stop="startSlideshow">
            <img src="../assets/trash.png" alt="slideshow" />
          </button>
        </div>

        <img
          :src="images[currentImageIndex].src"
          :alt="images[currentImageIndex].alt"
          class="modal-image"
          :key="currentImageIndex"
        />

        <p class="ai-description">
          {{ images[currentImageIndex].description }}
        </p>
        <div class="arrows">
          <button class="prev-button" @click="prevImage">
            <img src="../assets/left-arrow.png" alt="" />
          </button>
          <button class="next-button" @click="nextImage">
            <img src="../assets/right-arrow.png" alt="" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PhotoCard",
  props: {
    imageSrc: { type: String, required: true },
    imageAlt: { type: String, required: true },
    tags: { type: Array, required: false, default: () => [] }, // New prop for tags
    description: { type: String, required: false, default: "" }, // New prop for AI description
    images: { type: Array, required: true },
  },
  data() {
    return {
      isModalOpen: false,
      currentImageIndex: 0,
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
      this.currentImageIndex = this.images.findIndex(
        (image) => image.src === this.imageSrc
      );
    },
    closeModal() {
      this.isModalOpen = false;
    },
    prevImage() {
      this.currentImageIndex =
        this.currentImageIndex > 0
          ? this.currentImageIndex - 1
          : this.images.length - 1;
    },
    nextImage() {
      this.currentImageIndex =
        this.currentImageIndex < this.images.length - 1
          ? this.currentImageIndex + 1
          : 0;
    },
    handleLikeClick() {
      alert("You liked this photo! ❤️");
    },
    handleMoveToFolder() {
      alert("Move this photo to another folder.");
    },
    handleHideImage() {
      alert("This photo has been hidden.");
    },
    handleDeleteClick() {
      alert("Are you sure you want to delete this photo?");
    },
    handleDownload() {
      const link = document.createElement("a");
      link.href = this.images[this.currentImageIndex].src;
      link.download = "photo.jpg";
      link.click();
    },
    handleShare() {
      navigator.clipboard.writeText(this.images[this.currentImageIndex].src);
      alert("Photo link copied to clipboard! 📋");
    },
    handleEdit() {
      alert("Photo Editor coming soon! ✏️");
    },
    generateAICaption() {
      alert("AI says: 'A breathtaking view! 🌄'");
    },
    startSlideshow() {
      alert("Starting slideshow mode! 🎥");
    },
  },
};
</script>

<style lang="scss" scoped>
.ai-description {
  font-size: 24px;
  color: #ffffff;
}
.photo-card {
  background: #fff;
  position: relative;
  width: 20vw;
  max-width: 250px;
  height: 20vw;
  max-height: 250px;
  box-sizing: border-box;
  height: 20vw;
  overflow: hidden;
  z-index: 1;
  border: 3px solid blue;
  transition: transform 0.3s ease-in-out, z-index 0s;
  &:hover {
    cursor: pointer;
    transform: scale(1.03);
    z-index: 2;
    transition: transform 0.3s ease-in-out, z-index 0s;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease-in-out;
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 999;

  .modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    position: relative;
    width: 90vw;
    max-width: 900px;
    height: 90vh;
    background: linear-gradient(270deg, rgb(3, 3, 41) 0%, rgb(10, 10, 98) 100%);

    .modal-image {
      height: 90%;
      width: auto;
      object-fit: contain;
    }
    .close-modal {
      position: absolute;
      width: auto;
      top: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      cursor: pointer;
      &:hover {
        background: red;
      }
    }
  }
  .actions {
    display: flex;
    flex-direction: row;
    width: auto;
    height: auto;
    position: absolute;
    top: 0;
    button {
      background: #f8f8f8af;
      color: white;
      border: none;
      width: auto;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.3s ease;
      z-index: 0;
      img {
        width: 20px;
      }
    }
    .delete-button:hover {
      background: red;
    }
    .like-button:hover {
      background: #e908de;
    }
    .move-folder-button:hover {
      background: #2b0cc5;
    }
    .hide-button:hover {
      background: #858382;
    }
  }
}

.arrows {
  display: flex;
  justify-content: space-between;
  position: absolute;
  width: 90%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.prev-button,
.next-button {
  background: none;
  width: auto;
  height: auto;
  background-color: none;
  border: none;
  cursor: pointer;
  img {
    opacity: 10%;
    width: 150px;
    &:hover {
      opacity: 100%;
    }
  }
}

.prev-button {
  left: 10px;
}

.next-button {
  right: 10px;
}
</style>
