<template>
  <div class="photos-view">
    <div class="photos-container" ref="photosContainer" @scroll="handleScroll">
      <div
        v-for="(photo, index) in displayedPhotos"
        :key="photo.id"
        class="photo-item"
        :class="{ active: currentPhoto === index }"
        :ref="`photo-${index}`"
      >
        <div class="image-container">
          <img :src="photo.photoURL" class="photo-image" alt="User photo" />

          <div class="image-overlay">
            <div class="user-info">
              <img
                :src="
                  photo.authorData.profilePicture ||
                  '../assets/default-avatar.png'
                "
                class="user-avatar"
                alt="User avatar"
              />
              <span class="username">{{ photo.authorData.name }}</span>
            </div>
          </div>

          <div class="description-overlay">
            <p class="photo-description">{{ photo.imgDescription }}</p>
          </div>
        </div>

        <transition name="slide">
          <div v-if="selectedPhoto === photo.id" class="comments-section">
            <div class="comments-header">
              <h3>Comments</h3>
              <button @click="hideComments" class="close-btn">×</button>
            </div>
            <div class="comments-list">
              <div
                v-for="comment in photo.comments"
                :key="comment.id"
                class="comment"
              >
                <span class="comment-user">{{ comment.user }}</span>
                <span class="comment-text">{{ comment.text }}</span>
              </div>
            </div>
            <div class="comment-input">
              <input
                v-model="newComment"
                @keyup.enter="addComment(photo)"
                placeholder="Add a comment..."
                class="comment-input-field"
              />
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/firebase";

const auth = getAuth();

export default {
  name: "PhotosView",
  data() {
    return {
      photos: [],
      currentUser: null,
      currentPhoto: 0,
      selectedPhoto: null,
      newComment: "",
    };
  },
  computed: {
    displayedPhotos() {
      return this.photos.map((photo) => ({
        ...photo,
        liked: photo.liked || false,
        comments: photo.comments || [],
      }));
    },
  },
  mounted() {
    this.checkAuthState();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    checkAuthState() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.currentUser = user;
          this.fetchPhotos();
        } else {
          this.$router.push("/login");
        }
      });
    },
    async fetchPhotos() {
      try {
        const photosRef = collection(db, "photos");
        const querySnapshot = await getDocs(photosRef);
        this.photos = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            photoURL: data.photoURL || "",
            imgDescription: data.imgDescription || "No Description",
            authorData: {
              name: data.authorName || "Unknown",
              profilePicture: data.authorProfilePicture || "",
            },
            likes: data.likes || 0,
            comments: data.comments || [],
            userId: data.userId || "unknown",
          };
        });
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    },
    handleScroll() {
      const container = this.$refs.photosContainer;
      const photoHeight = window.innerHeight;
      const newIndex = Math.round(container.scrollTop / photoHeight);

      if (newIndex !== this.currentPhoto) {
        this.currentPhoto = newIndex;
      }
    },
    toggleLike(photo) {
      photo.liked = !photo.liked;
      photo.likes += photo.liked ? 1 : -1;
    },
    showComments(photo) {
      this.selectedPhoto = photo.id;
    },
    hideComments() {
      this.selectedPhoto = null;
    },
    addComment(photo) {
      if (this.newComment.trim() && this.currentUser) {
        const comment = {
          id: Date.now(),
          user: this.currentUser.displayName || "User",
          text: this.newComment,
        };
        photo.comments.push(comment);
        this.newComment = "";
      }
    },
    handleResize() {
      this.$refs.photosContainer.scrollTop =
        this.currentPhoto * window.innerHeight;
    },
  },
};
</script>

<style lang="scss" scoped>
.photos-view {
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.photos-container {
  height: 100%;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
}

.photo-item {
  height: 100vh;
  width: 100%;
  position: relative;
  scroll-snap-align: start;
}

.image-container {
  height: 100%;
  width: 100%;
  position: relative;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-weight: bold;
}

.interaction-bar {
  display: flex;
  gap: 20px;
  align-items: center;
}

.like-btn,
.comment-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.like-count {
  font-size: 16px;
}

.description-overlay {
  position: absolute;
  bottom: 80px;
  left: 20px;
  right: 20px;
  color: white;
}

.photo-description {
  background: rgba(0, 0, 0, 0.5);
  padding: 8px;
  border-radius: 4px;
}

.comments-section {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  max-height: 50vh;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  overflow-y: auto;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.comments-list {
  padding: 10px;
}

.comment {
  margin-bottom: 10px;
}

.comment-user {
  font-weight: bold;
  margin-right: 5px;
}

.comment-input {
  padding: 10px;
}

.comment-input-field {
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(100%);
}
</style>
