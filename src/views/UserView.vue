<template>
  <div class="lib-container">
    <div class="main">
      <div class="user-information">
        <div class="main-information">
          <div class="background">
            <img
              :src="profilePicture"
              alt="Profile Picture"
              class="profile-pic"
            />
          </div>
          <div class="information-text">
            <div class="follows-container">
              <article>
                <p>Followers</p>
                <p>
                  {{ followers.length }}
                </p>
              </article>
              <article>
                <p>Following</p>
                <p>
                  {{ following.length }}
                </p>
              </article>
            </div>
            <div class="ngd">
              <div>
                <p id="nickname">{{ username }}</p>
                <p id="gmail">{{ usergmail }}</p>
              </div>
              <p class="description">{{ description }}</p>
            </div>
            <div>
              <button v-if="isCurrentUser" @click="modalEditProfile">
                <p>Edit profile</p>
              </button>
              <button
                v-if="!isCurrentUser"
                @click="
                  following.includes(targetUserId)
                    ? unfollowUser()
                    : followUser()
                "
              >
                <p>
                  {{ following.includes(targetUserId) ? "Unfollow" : "Follow" }}
                </p>
              </button>
            </div>
          </div>
        </div>
        <div class="interests">
          <div class="section-header">
            <p>Interests</p>
          </div>
          <div class="interests-tags">
            <span v-for="(tag, index) in interests" :key="index" class="tag">
              <p>{{ tag }}</p>
            </span>
          </div>
        </div>
      </div>
      <div class="posts">
        <div class="user-library">
          <button @click="toggleView" class="toggle-btn">
            <img
              v-if="isGridView"
              src="../assets/icons8-grid-96.png"
              alt="Grid View"
            />
            <img v-else src="../assets/icons8-column-90.png" alt="List View" />
          </button>

          <div :class="viewClass">
            <PhotoCard
              v-for="image in filteredImages"
              :key="image.id"
              :photoId="image.id"
              :imageSrc="image.src"
              :description="image.imgDescription"
              :author="authorData"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  doc,
  arrayUnion,
  arrayRemove,
  updateDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import PhotoCard from "@/components/PhotoCard.vue";
import { db } from "@/firebase";

const auth = getAuth();

export default {
  name: "UserView",
  components: {
    PhotoCard,
  },
  data() {
    return {
      searchQuery: "",
      filterQuery: "",
      username: "",
      usergmail: "",
      description: "",
      followers: [],
      following: [],
      profilePicture: "",
      images: [],
      interests: [],
      isGridView: false,
      currentUser: null, // Залогінений користувач
      targetUserId: null, // ID користувача, чий профіль переглядається
    };
  },
  computed: {
    viewClass() {
      return this.isGridView
        ? "photos-grid grid-view"
        : "photos-grid list-view";
    },
    filteredImages() {
      return this.images.filter(
        (image) =>
          (!this.searchQuery ||
            (image.tags &&
              image.tags.some((tag) =>
                tag.toLowerCase().includes(this.searchQuery.toLowerCase())
              )) ||
            (image.imgDescription &&
              image.imgDescription
                .toLowerCase()
                .includes(this.searchQuery.toLowerCase()))) &&
          (!this.filterQuery ||
            (image.tags && image.tags.includes(this.filterQuery)))
      );
    },
    authorData() {
      return {
        name: this.username,
        profilePicture: this.profilePicture,
      };
    },
    isCurrentUser() {
      // Перевіряємо, чи профіль належить залогіненому користувачу
      return this.currentUser && this.targetUserId === this.currentUser.uid;
    },
  },
  watch: {
    "$route.params.userId": {
      immediate: true,
      handler(newUserId) {
        this.targetUserId =
          newUserId || (this.currentUser ? this.currentUser.uid : null);
        if (this.targetUserId) {
          this.fetchUserData(this.targetUserId);
          this.fetchImages(this.targetUserId);
        }
      },
    },
  },
  mounted() {
    const storedUser = localStorage.getItem("user");
    this.currentUser = storedUser ? JSON.parse(storedUser) : null;

    if (this.currentUser) {
      this.targetUserId = this.$route.params.userId || this.currentUser.uid;
      this.fetchUserData(this.targetUserId);
      this.fetchImages(this.targetUserId);
    } else {
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          this.currentUser = firebaseUser;
          localStorage.setItem("user", JSON.stringify(firebaseUser));
          this.targetUserId = this.$route.params.userId || this.currentUser.uid;
          this.fetchUserData(this.targetUserId);
          this.fetchImages(this.targetUserId);
        } else {
          console.error("No authenticated user found. Redirecting to login...");
          this.$router.push("/login");
        }
      });
    }
  },
  methods: {
    async followUser() {
      if (!this.currentUser || !this.targetUserId) {
        console.error(
          "Немає поточного користувача або ID цільового користувача."
        );
        return;
      }

      if (this.currentUser.uid === this.targetUserId) {
        console.error("Ви не можете слідкувати за самим собою!");
        return;
      }

      try {
        const currentUserRef = doc(db, "users", this.currentUser.uid);
        const targetUserRef = doc(db, "users", this.targetUserId);

        await updateDoc(currentUserRef, {
          following: arrayUnion(this.targetUserId),
        });

        await updateDoc(targetUserRef, {
          followers: arrayUnion(this.currentUser.uid),
        });

        if (!this.following.includes(this.targetUserId)) {
          this.following.push(this.targetUserId);
        }
        if (!this.followers.includes(this.currentUser.uid)) {
          this.followers.push(this.currentUser.uid);
        }

        console.log(
          `${this.currentUser.uid} тепер слідкує за ${this.targetUserId}`
        );
      } catch (error) {
        console.error("Помилка при спробі слідкувати за користувачем:", error);
      }
    },
    async unfollowUser() {
      try {
        const currentUserRef = doc(db, "users", this.currentUser.uid);
        const targetUserRef = doc(db, "users", this.targetUserId);

        await updateDoc(currentUserRef, {
          following: arrayRemove(this.targetUserId),
        });

        await updateDoc(targetUserRef, {
          followers: arrayRemove(this.currentUser.uid),
        });

        this.following = this.following.filter(
          (id) => id !== this.targetUserId
        );
        this.followers = this.followers.filter(
          (id) => id !== this.currentUser.uid
        );

        console.log(
          `${this.currentUser.uid} припинив слідкувати за ${this.targetUserId}`
        );
      } catch (error) {
        console.error("Помилка при відписці:", error);
      }
    },
    toggleView() {
      this.isGridView = !this.isGridView;
    },
    async fetchUserData(userId) {
      const userRef = doc(db, "users", userId);
      try {
        const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            this.username = userData.name || "No Name";
            this.usergmail = userData.email || "No Email";
            this.description = userData.description || "";
            this.interests = Array.isArray(userData.interests)
              ? userData.interests
              : (userData.interests || "").split(", ").map((tag) => tag.trim());
            this.profilePicture = userData.profilePicture || "";
            this.followers = userData.followers || [];
            this.following = userData.following || [];
          } else {
            console.log("No user document found in Firestore.");
          }
        });
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    async fetchImages(userId) {
      if (!userId) {
        console.error("No user ID provided to fetchImages.");
        return;
      }

      const userPhotosRef = collection(db, `users/${userId}/photos`);
      try {
        const unsubscribe = onSnapshot(userPhotosRef, (querySnapshot) => {
          this.images = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            src: doc.data().photoURL || "",
            imgDescription: doc.data().imgDescription || "No Description",
            tags: doc.data().tags || [],
            author: doc.data().author,
            uploadedAt: doc.data().uploadedAt || new Date(),
          }));
        });
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    },
    async handleLogout() {
      try {
        await signOut(auth);
        localStorage.removeItem("user");
        this.currentUser = null;
        this.$router.push("/login");
      } catch (error) {
        console.error("Error logging out:", error.message);
      }
    },
    modalEditProfile() {
      if (this.isCurrentUser) {
        this.$router.push("/edit-profile");
      }
    },
  },
};
</script>

<style lang="scss">
@media (max-width: 968px) {
  .main {
    flex-direction: column; // перемикаємо на колонку
    width: 100%; // ширина на весь екран
    padding: 20px; // зменшуємо відступи для телефону
    gap: 15px; // трішки менший зазор між блоками
  }
  .user-information {
    width: 100%; // займає весь простір
    height: auto; // висота адаптивна, не фіксована 90vh
  }
  .posts {
    width: 100%; // теж на всю ширину
    min-height: auto; // прибираємо фіксовану висоту
  }
  .recent-activity {
    width: 100%; // на всю ширину
    height: auto; // адаптивна висота
    margin-top: 15px; // відступ зверху для порядку
  }
  .photos-grid.grid-view {
    grid-template-columns: repeat(2, 1fr); // 2 колонки замість 3 на телефоні
  }
  .photos-grid.list-view {
    max-width: 100%; // ширина на весь екран
  }
  .publish {
    height: auto; // адаптивна висота
    padding: 15px 0; // трішки більше простору
  }
}
</style>
