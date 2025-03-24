<template>
  <div class="main-container">
    <div v-if="registerError" class="error-message">
      {{ registerError }}
    </div>

    <div class="form-container">
      <div class="forms">
        <transition name="slide-fade" mode="out-in">
          <div class="register-form" v-if="registerBool">
            <h2>Create Account</h2>
            <form @submit.prevent="handleRegister">
              <div class="input-container">
                <input type="text" placeholder="Name" v-model="name" required />
                <input
                  type="email"
                  placeholder="Email"
                  v-model="registerEmail"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  v-model="registerPassword"
                  required
                />
                <button type="submit">Sign Up</button>
              </div>
            </form>
          </div>
        </transition>
        <transition name="slide-fade" mode="out-in">
          <div class="login-container" v-if="loginBool">
            <h2>Sign In</h2>
            <form @submit.prevent="handleLogin">
              <div class="input-container">
                <input type="email" id="email" v-model="email" required />
                <input
                  type="password"
                  id="password"
                  v-model="password"
                  required
                />
                <button type="submit">Login</button>
              </div>
            </form>
          </div>
        </transition>
      </div>
      <transition name="slide-fade" mode="out-in">
        <div class="toggle-block">
          <div class="content">
            <div class="text">
              <h1>Hello, friend!</h1>
              <p>Start work with us and blast your creativity</p>
            </div>
            <button
              class="toggle-button"
              @click="toggleRegister"
              :class="{ active: registerBool }"
            >
              {{ registerBool ? "Sign In" : "Register" }}
            </button>
          </div>
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
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";

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

        console.log("✅ User registered:", user.uid);

        if (!auth.currentUser) {
          throw new Error("User is not authenticated before Firestore write.");
        }

        // Reference to the user's document
        const userDocRef = doc(db, "users", user.uid);

        // Firestore user creation
        try {
          await setDoc(userDocRef, {
            name: this.name,
            email: this.registerEmail,
            uid: user.uid,
            createdAt: new Date(),
            profilePicture: "",
            description: "",
            interests: [],
            followers: [],
            following: [],
          });

          console.log("✅ User document added to Firestore!");

          // ✅ Create an empty "photos" subcollection for this user
          const photosCollectionRef = collection(userDocRef, "photos");

          await setDoc(doc(photosCollectionRef, "init"), {
            message: "Photo collection initialized",
            createdAt: new Date(),
          });

          console.log("✅ 'photos' subcollection created for user:", user.uid);
        } catch (firestoreError) {
          console.error(
            "❌ Firestore error:",
            firestoreError.code,
            firestoreError.message
          );
        }
      } catch (authError) {
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
        console.log("User logged in:", userCredential.user);
        // При успішному вході користувача
        auth.onAuthStateChanged((user) => {
          if (user) {
            localStorage.setItem("user", JSON.stringify(user)); // зберігаємо користувача в localStorage
          } else {
            localStorage.removeItem("user"); // видаляємо користувача з localStorage, якщо він вийшов
          }
        });
        this.$router.push("/profile");
      } catch (error) {
        console.error("Login error:", error.message);
      }
    },
    toggleRegister() {
      if (this.registerBool) {
        this.registerBool = !this.registerBool;

        setTimeout(() => {
          this.loginBool = !this.loginBool;
        }, 850);
      } else {
        this.loginBool = !this.loginBool;
        setTimeout(() => {
          this.registerBool = !this.registerBool;
        }, 850);
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/login.scss";
</style>
