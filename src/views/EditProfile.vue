<template>
  <div class="wrap">
    <div class="profile-container">
      <h2>Edit Profile</h2>

      <div v-if="user">
        <form @submit.prevent="updateProfile">
          <img v-if="profilePicUrl" :src="profilePicUrl" class="profile-pic" />
          <img v-else src="../assets/newuser.jpg" alt="" />
          <input type="file" @change="uploadProfilePicture" />

          <label>Name:</label>
          <input v-model="userData.name" type="text" required />

          <label>New Password:</label>
          <input v-model="userData.password" type="password" />

          <label>Description:</label>
          <textarea v-model="userData.description"></textarea>

          <label>Interest Tags:</label>
          <input
            v-model="userData.interests"
            type="text"
            placeholder="e.g., coding, hiking, music"
          />

          <button type="submit">Update Profile</button>
        </form>
      </div>

      <div v-else>
        <p>Loading user data...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getAuth, updatePassword } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default {
  setup() {
    const auth = getAuth();
    const db = getFirestore();
    const storage = getStorage();

    const user = ref(null);
    const userData = ref({
      name: "",
      password: "",
      description: "",
      interests: "",
    });
    const profilePicUrl = ref("");

    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        user.value = currentUser;
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));

        if (userDoc.exists()) {
          userData.value = userDoc.data();
          profilePicUrl.value = userDoc.data().profilePicture || "";
        }
      }
    };

    const uploadProfilePicture = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const storageReference = storageRef(
        storage,
        `profilePictures/${user.value.uid}`
      );
      await uploadBytes(storageReference, file);
      const downloadUrl = await getDownloadURL(storageReference);

      profilePicUrl.value = downloadUrl;
    };

    const updateProfile = async () => {
      if (user.value) {
        const userRef = doc(db, "users", user.value.uid);

        await setDoc(
          userRef,
          {
            name: userData.value.name,
            profilePicture: profilePicUrl.value,
            description: userData.value.description,
            interests: userData.value.interests,
          },
          { merge: true }
        );

        if (userData.value.password) {
          await updatePassword(user.value, userData.value.password);
        }

        alert("Profile updated successfully!");
      }
    };

    onMounted(fetchUserData);

    return {
      user,
      userData,
      profilePicUrl,
      uploadProfilePicture,
      updateProfile,
    };
  },
};
</script>

<style>
.wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #10032f;
}
.profile-container {
  max-width: 600px;
  margin: auto;
  padding: 20px 100px;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  background-color: rgba(14, 14, 14, 0.781);
  color: white;
}
.profile-pic {
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin: auto;
  display: block;
  border: 5px solid #ddd;
  border-radius: 50%;
}
.profile-picture input {
  margin-top: 10px;
}
form {
  display: flex;
  flex-direction: column;
}
form label {
  margin-top: 10px;
}
form input,
form textarea {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
}
button {
  margin-top: 15px;
  padding: 10px;
  border: none;
  color: white;
  cursor: pointer;
}
</style>
