<template>
  <div>
    <div class="main">
      <div class="user-search">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search users..."
          @input="filterUsers"
          class="user-search__input"
        />
        <PostsScroll />
      </div>
      <div class="user-search-results">
        <div v-if="filteredUsers.length > 0" class="user-list">
          <div
            v-for="(user, index) in filteredUsers"
            :key="index"
            class="user-card"
            @click="viewUserProfile(user)"
          >
            <img
              :src="user.profilePicture || '../assets/default-avatar.png'"
              alt="User Avatar"
              class="user-card__avatar"
            />
            <div class="user-card__info">
              <p class="user-card__username">{{ user.name }}</p>
              <p class="user-card__email">{{ user.email }}</p>
            </div>
          </div>
        </div>
        <p v-else class="user-search-results__empty">No users found.</p>
      </div>

      <div class="photo-feed">
        <div class="feed-type">
          <button
            @click="showFollowingPhotos = false"
            :class="{ active: !showFollowingPhotos }"
            class="tab-btn"
          >
            Users
          </button>
          <button
            @click="showFollowingPhotos = true"
            :class="{ active: showFollowingPhotos }"
            class="tab-btn"
          >
            Following
          </button>
        </div>
        <div class="photo-feed-controls">
          <p>Feeds</p>
          <input
            v-model="tagQuery"
            type="text"
            placeholder="Filter by tags..."
            @input="filterPhotosByTag"
            class="photo-feed__filter-input"
          />
        </div>
        <div class="photo-feed-grid">
          <PhotoCard
            v-for="photo in displayedPhotos"
            :key="photo.id"
            :photoId="photo.id"
            :imageSrc="photo.photoURL"
            :description="photo.imgDescription"
            :author="photo.authorData"
          />
        </div>
        <p
          v-if="showFollowingPhotos && displayedPhotos.length === 0"
          class="photo-feed__empty"
        >
          No photos from followed users yet.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/firebase";
import PhotoCard from "@/components/PhotoCard.vue";
import PostsScroll from "@/components/PostComp.vue";

const auth = getAuth();

export default {
  name: "HomeView",
  components: {
    PhotoCard,
    PostsScroll,
  },
  data() {
    return {
      searchQuery: "",
      users: [],
      filteredUsers: [],
      allPhotos: [],
      randomPhotos: [],
      followingPhotos: [],
      tagQuery: "",
      showFollowingPhotos: false,
      currentUser: null,
    };
  },
  computed: {
    displayedPhotos() {
      const photos = this.showFollowingPhotos
        ? this.followingPhotos
        : this.randomPhotos;
      if (!this.tagQuery) return photos;
      return photos.filter(
        (photo) =>
          photo.tags &&
          photo.tags.some((tag) =>
            tag.toLowerCase().includes(this.tagQuery.toLowerCase())
          )
      );
    },
  },
  mounted() {
    this.checkAuthState();
  },
  methods: {
    checkAuthState() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.currentUser = user;
          this.fetchAllUsers();
          this.fetchRandomPhotos().then(() => {
            this.fetchFollowingPhotos(); // Викликаємо після завантаження всіх фото
          });
        } else {
          console.error("No authenticated user found. Redirecting to login...");
          this.$router.push("/login");
        }
      });
    },
    async fetchAllUsers() {
      try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        this.users = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.filteredUsers = this.users;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    filterUsers() {
      const query = this.searchQuery.toLowerCase().trim();
      if (!query) {
        this.filteredUsers = this.users;
      } else {
        this.filteredUsers = this.users.filter(
          (user) =>
            (user.name && user.name.toLowerCase().includes(query)) ||
            (user.email && user.email.toLowerCase().includes(query))
        );
      }
    },
    viewUserProfile(user) {
      this.$router.push({
        path: `/profile/${user.id}`,
      });
    },
    async fetchRandomPhotos() {
      try {
        const photosRef = collection(db, "photos");
        const querySnapshot = await getDocs(photosRef);
        this.allPhotos = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            photoURL: data.photoURL || "",
            imgDescription: data.imgDescription || "No Description",
            author: data.author || "Unknown",
            tags: data.tags || [],
            authorData: {
              name: data.author || "Unknown",
              profilePicture: "",
            },
            userId: data.userId || "unknown", // Додаємо значення за замовчуванням
          };
        });
        this.randomPhotos = this.getRandomItems(this.allPhotos, 5);
        console.log("Loaded all photos:", this.allPhotos); // Для дебагу
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    },
    async fetchFollowingPhotos() {
      try {
        if (!this.currentUser) return;

        const userDocRef = doc(db, "users", this.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const following = userDoc.exists()
          ? userDoc.data().following || []
          : [];
        console.log("Following list:", following);

        this.followingPhotos = this.allPhotos.filter((photo) =>
          following.includes(photo.author)
        );
        console.log("Following photos:", this.followingPhotos); // Для дебагу

        if (this.followingPhotos.length === 0) {
          console.log("No photos from followed users yet.");
        }
      } catch (error) {
        console.error("Error fetching following photos:", error);
      }
    },
    getRandomItems(array, count) {
      const shuffled = [...array].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    },
    followingView() {
      this.showFollowingPhotos = true;
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/home.scss";
</style>
