<template>
  <nav class="navbar">
    <div class="logo-wrap">
      <img class="logo" src="../assets/logo.png" alt="" />
      <h1>WebFlow</h1>
    </div>

    <div :class="['navbar-links', { active: isMenuOpen }]">
      <ul>
        <li>
          <router-link to="/home" active-class="active-link">
            <img src="../assets/icons8-home-240.png" alt="Home" />
          </router-link>
        </li>
        <li>
          <router-link to="/profile" active-class="active-link">
            <img src="../assets/icons8-user-96.png" alt="User" />
          </router-link>
        </li>
      </ul>
    </div>

    <div class="logout">
      <button @click="handleLogout">Log out</button>
      <img :src="profilePicture" alt="Profile Picture" class="profile-pic" />
    </div>
  </nav>
</template>

<script>
import { doc, onSnapshot } from "firebase/firestore";
import { signOut, getAuth } from "firebase/auth";
import { db } from "@/firebase";

const auth = getAuth();

export default {
  data() {
    return {
      isMenuOpen: false,
      profilePicture: "",
    };
  },
  mounted() {
    const storedUser = localStorage.getItem("user");
    let user = storedUser ? JSON.parse(storedUser) : null;

    if (user) {
      this.fetchUserData(user);
    }
  },
  methods: {
    async handleLogout() {
      try {
        await signOut(auth); // Виконуємо вихід із Firebase Authentication
        localStorage.removeItem("user"); // Видаляємо дані користувача з localStorage
        this.currentUser = null; // Очищаємо стан залогіненого користувача
        this.$router.push("/login"); // Перенаправляємо на сторінку логіну
      } catch (error) {
        console.error("Error logging out:", error.message);
        // Опціонально: можна додати повідомлення для користувача про помилку
      }
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    async fetchUserData(user) {
      const userRef = doc(db, "users", user.uid);
      try {
        const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            this.profilePicture = userData.profilePicture || "";
          } else {
            console.log("No user document found in Firestore.");
          }
        });
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
  },
  computed: {
    authorData() {
      return {
        name: this.username,
        profilePicture: this.profilePicture,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  position: sticky;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 10vh;
  box-sizing: border-box;
  top: 0;
  z-index: 1001;
  padding: 10px 20px;
  color: white;
  background-color: #000000;
  .navbar-links {
    width: auto;
    list-style: none;
    ul {
      display: flex;
      justify-content: center;
      align-items: center;
      width: auto;
      list-style: none;
      gap: 10px;
      li {
        outline: none;
        text-decoration: none;
        list-style: none;
        img {
          width: 30px;
          height: auto;
        }
      }
    }
  }
  .logo-wrap {
    display: flex;
    align-items: center;
    .logo {
      width: 80px;
      height: 80px;
      margin: 0 10px;
    }
    h1 {
      width: 100%;
      border: none;
      border-radius: 5px;
      font-size: 20px;
      color: white;
      font-weight: bold;
      &:focus {
        outline: none;
      }
    }
  }
  .logout {
    display: flex;
    flex-direction: column-reverse;
    img {
      width: 50px;
    }
    button {
      width: auto;
      background: none;
      color: white;
      cursor: pointer;
      border: none;
    }
  }
}
.active-link {
  border-bottom: 0.2rem solid #4627d1;
}

.navbar-links a:hover {
  color: #4627d1;
}
</style>
