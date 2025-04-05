<template>
  <nav class="navbar">
    <div :class="['navbar-links', { active: isMenuOpen }]">
      <router-link to="/reels" active-class="active-link">
        <img src="../assets/reels.png" alt="Reels" />
      </router-link>
      <router-link to="/home" active-class="active-link">
        <img src="../assets/icons8-home-240.png" alt="Home" />
      </router-link>
      <router-link to="/profile" active-class="active-link">
        <img src="../assets/icons8-user-96.png" alt="User" />
      </router-link>

      <img @click="handleLogout" src="../assets/logout.png" alt="Logout" />
    </div>
  </nav>
</template>

<script>
import { doc, onSnapshot } from "firebase/firestore";
import { signOut, getAuth } from "firebase/auth";
import { db } from "@/firebase";
import Swal from "sweetalert2";

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
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to log out?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, log out",
        cancelButtonText: "No, stay logged in",
      });

      if (result.isConfirmed) {
        try {
          await signOut(auth);
          localStorage.removeItem("user");
          this.currentUser = null;

          await Swal.fire({
            title: "Logged Out",
            text: "You have been successfully logged out.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          this.$router.push("/login");
        } catch (error) {
          await Swal.fire({
            title: "Logout Failed",
            text: error.message,
            icon: "error",
            confirmButtonText: "OK",
          });
          console.error("Error logging out:", error.message);
        }
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
  position: fixed;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 10vh;
  box-sizing: border-box;
  bottom: 10px;
  z-index: 1001;
  padding: 10px 20px;
  color: white;
  .navbar-links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    list-style: none;
    background-color: #000000e6;
    padding: 10px 20px;
    border-radius: 20px;
    img {
      width: 35px;
      height: auto;
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
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100%;
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
