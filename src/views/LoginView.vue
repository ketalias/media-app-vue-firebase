<template>
  <div class="main-container">
    <div v-if="registerError" class="error-message">
      {{ registerError }}
    </div>

    <div class="form-container">
      <transition name="slide-fade" mode="out-in">
        <div class="register-form" v-if="registerBool">
          <h2>Create Account</h2>
          <form @submit.prevent="handleRegister">
            <div class="input-container">
              <label for="name">Name</label>
              <input type="text" placeholder="Name" v-model="name" required />
              <label for="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                v-model="registerEmail"
                required
              />
              <label for="password">Password</label>
              <input
                type="password"
                placeholder="Password"
                v-model="registerPassword"
                required
              />
              <div class="buttons">
                <button type="submit">Submit</button>
                <button
                  class="toggle-button"
                  @click="toggleRegister"
                  :class="{ active: registerBool }"
                >
                  Sign In
                </button>
              </div>
            </div>
          </form>
        </div>
      </transition>
      <transition name="slide-fade" mode="out-in">
        <div class="login-container" v-if="loginBool">
          <h2>Sign In</h2>
          <form @submit.prevent="handleLogin">
            <div class="input-container">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="email" required />
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                v-model="password"
                required
              />
              <div class="buttons">
                <button type="submit">Submit</button>
                <button
                  class="toggle-button"
                  @click="toggleRegister"
                  :class="{ active: registerBool }"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </form>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import "core-js/stable";
import "regenerator-runtime/runtime";
import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      registerBool: false,
      loginBool: true,
      registerError: "",
      name: "",
      registerEmail: "",
      registerPassword: "",
      email: "",
      password: "",
    };
  },
  methods: {
    async handleRegister() {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.registerEmail,
          this.registerPassword
        );
        const user = userCredential.user;

        if (!auth.currentUser) {
          throw new Error("User is not authenticated before Firestore write.");
        }

        const userDocRef = doc(db, "users", user.uid);
        const defaultProfilePic =
          "https://firebasestorage.googleapis.com/v0/b/interactive-album.firebasestorage.app/o/profilePictures%2Fnewuser.jpg?alt=media&token=https://firebasestorage.googleapis.com/v0/b/interactive-album.firebasestorage.app/o/profilePictures%2Fnewuser.jpg?alt=media&token=0acd953f-0dca-4162-b9ff-de86bd4b03c7";
        await setDoc(userDocRef, {
          name: this.name,
          email: this.registerEmail,
          uid: user.uid,
          createdAt: new Date(),
          profilePicture: defaultProfilePic,
          description: "",
          interests: [],
          followers: [],
          following: [],
        });

        await Swal.fire({
          icon: "success",
          title: "Account Created!",
          text: `Welcome ${this.name}! Your account has been successfully created.`,
          timer: 2000,
          showConfirmButton: false,
        });

        this.name = "";
        this.registerEmail = "";
        this.registerPassword = "";
      } catch (authError) {
        await Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: authError.message,
          confirmButtonText: "Try Again",
        });

        console.error(
          "❌ Authentication error:",
          authError.code,
          authError.message
        );
      }
    },

    async handleLogin() {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );

        await Swal.fire({
          icon: "success",
          title: "Welcome Back!",
          text: "You have successfully signed in.",
          timer: 1500,
          showConfirmButton: false,
        });

        console.log("User logged in:", userCredential.user);
        auth.onAuthStateChanged((user) => {
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
          } else {
            localStorage.removeItem("user");
          }
        });

        this.$router.push("/profile");

        this.email = "";
        this.password = "";
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.message,
          confirmButtonText: "Try Again",
        });

        console.error("Login error:", error.message);
      }
    },
    toggleRegister() {
      if (this.registerBool) {
        this.registerBool = !this.registerBool;
        setTimeout(() => {
          this.loginBool = !this.loginBool;
        }, 450);
      } else {
        this.loginBool = !this.loginBool;
        setTimeout(() => {
          this.registerBool = !this.registerBool;
        }, 450);
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/login.scss";
</style>
