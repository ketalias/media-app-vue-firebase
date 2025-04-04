<template>
  <div class="photo-upload">
    <h2>Upload a Photo</h2>

    <p v-if="uploadError" class="error">{{ uploadError }}</p>
    <p v-if="uploadSuccess" class="success">{{ uploadSuccess }}</p>

    <input type="file" @change="handlePhotoUpload" accept="image/*" />
    <button @click="handleAddPhoto" :disabled="isLoading">
      <span v-if="isLoading">Uploading...</span>
      <span v-else>Upload Photo</span>
    </button>

    <!-- Modal for previewing the image -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>Preview Your Photo</h3>
        <img :src="photoPreview" alt="Preview" class="preview-image" />

        <label>Description:</label>
        <textarea
          v-model="photoDescription"
          placeholder="Enter a description"
        ></textarea>

        <label>Tags:</label>
        <input v-model="photoTags" placeholder="Enter tags (comma separated)" />

        <div class="modal-buttons">
          <button @click="handleAddPhoto" :disabled="isLoading">
            <span v-if="isLoading">Uploading...</span>
            <span v-else>Confirm Upload</span>
          </button>
          <button @click="showModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { auth, db, storage } from "@/firebase";
import { collection, addDoc, getDoc, setDoc, doc } from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default {
  setup() {
    const photoFile = ref(null);
    const photoPreview = ref("");
    const uploadError = ref("");
    const uploadSuccess = ref("");
    const photoDescription = ref("");
    const photoTags = ref("");
    const isLoading = ref(false);
    const showModal = ref(false);
    const croppedBlob = ref(null);

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];

    const handlePhotoUpload = (event) => {
      const file = event.target.files[0];

      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          uploadError.value = `❌ File size exceeds the 5MB limit.`;
          return;
        }

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          uploadError.value = `❌ Invalid file type. Please upload an image (JPEG, PNG, GIF).`;
          return;
        }

        // Read and crop the image
        const reader = new FileReader();
        reader.onload = (e) => {
          cropImageToSquare(e.target.result, file.type);
        };
        reader.readAsDataURL(file);
      }
    };

    const cropImageToSquare = (imageSrc, fileType) => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;
        ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);

        // Convert to blob for upload
        canvas.toBlob((blob) => {
          croppedBlob.value = blob;
          photoPreview.value = canvas.toDataURL(fileType);
          showModal.value = true;
        }, fileType);
      };
    };

    const handleAddPhoto = async () => {
      if (!croppedBlob.value) {
        uploadError.value = "Please select a photo!";
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        uploadError.value = "You must be logged in!";
        return;
      }

      try {
        isLoading.value = true;

        const uniqueFileName = `photo_${Date.now()}.jpg`;
        const photoStorageRef = storageRef(
          storage,
          `/firebase/users/${user.uid}/photos/${uniqueFileName}`
        );

        await uploadBytes(photoStorageRef, croppedBlob.value);
        const photoURL = await getDownloadURL(photoStorageRef);

        const photoDocRef = collection(db, "users", user.uid, "photos");
        const newPhotoRef = await addDoc(photoDocRef, {
          photoURL,
          imgDescription: photoDescription.value,
          tags: photoTags.value.split(",").map((tag) => tag.trim()),
          comments: [],
          likes: [],
          likeCount: 0,
          uploadedAt: new Date(),
        });

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        let authorName = "Anonymous"; // дефолт
        if (userSnap.exists()) {
          const userData = userSnap.data();
          authorName = userData.name || userData.displayName || "Anonymous";
        }

        const photoId = newPhotoRef.id;
        await setDoc(doc(db, "photos", photoId), {
          photoURL,
          imgDescription: photoDescription.value,
          tags: photoTags.value.split(",").map((tag) => tag.trim()),
          comments: [],
          likes: [],
          likeCount: 0,
          uploadedAt: new Date(),
          author: user.uid,
          authorName,
        });

        uploadSuccess.value = "✅ Photo uploaded successfully!";
        uploadError.value = "";
        showModal.value = false;
      } catch (error) {
        uploadError.value = "❌ Error uploading photo: " + error.message;
        uploadSuccess.value = "";
      } finally {
        isLoading.value = false;
      }
    };

    return {
      photoFile,
      photoPreview,
      uploadError,
      uploadSuccess,
      photoDescription,
      photoTags,
      isLoading,
      showModal,
      handlePhotoUpload,
      handleAddPhoto,
    };
  },
};
</script>

<style lang="scss" scoped>
$primary-color: #1a1a2e;
$primary-hover: #101043;
$border-color: #2e2e2e;
$box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.3);
$text-color: #e0e0e0;
$background-color: #121212;

.photo-upload {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  color: white;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background-color: $background-color;
  padding: 20px;
  border-radius: 10px;
  box-shadow: $box-shadow;
  z-index: 10000;
}

.error {
  color: red;
}

.success {
  color: green;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  border-radius: 10px;
}
.modal-content {
  background: black;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  color: $text-color;
  box-shadow: $box-shadow;
}

.preview-image {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 15px;
  border: 3px solid rgb(34, 34, 34);
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

button {
  margin-top: 10px;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  background: $primary-hover;
  color: $text-color;
  border-radius: 5px;
  transition: background 0.3s ease;

  &:hover {
    background: lighten($primary-hover, 10%);
  }

  &:disabled {
    background: gray;
    cursor: not-allowed;
  }
}
</style>
