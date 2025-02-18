<template>
  <div class="main-container">
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

export default {
  data() {
    return {
      email: "",
      password: "",
      name: "",
      registerEmail: "",
      registerPassword: "",
      registerBool: false,
      loginBool: true,
    };
  },
  methods: {
    handleLogin() {
      console.log("Logging in with", this.email, this.password);
    },
    handleRegister() {
      console.log(
        "Registering with",
        this.name,
        this.registerEmail,
        this.registerPassword
      );
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

<style lang="scss" scoped>
$dark-bg: #0c0c0c;
$white: #ffffff;
$primary-color: #06268e;
$footer-bg: #1c1c1c;
$gradient-start: #1d1a27;
$gradient-end: #0e064f;
$text-color: rgb(213, 213, 213);
$shadow-color: rgba(0, 0, 0, 0.3);
$hover-shadow-color: rgba(112, 112, 112, 0.5);
$overlay-color: rgba(0, 0, 0, 0.59);

.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(270deg, $gradient-start 0%, $gradient-end 100%);
}

.form-container {
  display: flex;
  width: 900px;
  height: 500px;
  background-color: $white;
  box-shadow: 0 0 10px 0 $shadow-color;
}

.logo {
  position: relative;
  width: 150px;
}

input {
  background-color: #ced4e0;
  width: 200px;
  padding: 10px;
  border-radius: 5px;
  border: none;
  margin-bottom: 10px;
}

.forms {
  display: flex;
  width: 40%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.login-container {
  z-index: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  height: 100%;
  width: 100%;
  color: $white;
  color: $dark-bg;
  .input-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 200px;
    justify-content: space-around;
  }
  button {
    background-color: $primary-color;
    color: $white;
    padding: 5px 30px;
    border-radius: 30px;
    border: none;
    cursor: pointer;
  }
}

.register-form {
  z-index: 2;
  background-color: $white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 100%;

  h2 {
    margin-bottom: 20px;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 250px;
  }

  button {
    background-color: $primary-color;
    color: $white;
    padding: 5px 30px;
    border-radius: 30px;
    border: none;
    cursor: pointer;
  }
}

.toggle-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(270deg, #1a35b8 0%, #0c1541 100%);
  padding: 20px;
  height: 100%;
  width: 60%;
  min-width: 400px;
  color: rgb(255, 255, 255);

  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 40%;
  }
  h1 {
    font-size: 60px;
    color: rgb(255, 255, 255);
  }
  p {
    font-size: 15px;
    color: rgb(255, 255, 255);
  }
  button {
    background-color: white;
    color: #16267a;
    padding: 5px 30px;
    border-radius: 30px;
    border: none;
    cursor: pointer;
    margin: 0px;
  }
}

button {
  width: 150px;
  transition: all 0.3s ease-in-out;
  &:hover {
    width: 200px;
  }
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.7s ease-in-out;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(100%);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
