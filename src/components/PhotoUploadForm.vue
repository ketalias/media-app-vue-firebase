<template>
  <div v-if="isFormVisible" class="photo-upload-form">
    <div class="form-content">
      <button class="close-btn" @click="closeForm">×</button>
      <h2>Upload Your Photo</h2>

      <div v-if="photoPreview" class="preview-section">
        <img :src="photoPreview" alt="Preview" class="preview-image" />
      </div>

      <div class="form-fields">
        <div class="input-group">
          <input
            type="file"
            ref="fileInput"
            @change="handlePhotoUpload"
            accept="image/*, video/*"
            class="file-input"
          />
        </div>

        <div v-if="photoPreview" class="input-group">
          <label>Description</label>
          <textarea
            v-model="photoDescription"
            placeholder="Enter a description"
            rows="3"
          ></textarea>
        </div>

        <div v-if="photoPreview" class="input-group">
          <label>Tags</label>
          <input
            v-model="photoTags"
            placeholder="Enter tags (comma separated)"
          />
        </div>

        <p v-if="uploadError" class="error">{{ uploadError }}</p>
        <p v-if="uploadSuccess" class="success">{{ uploadSuccess }}</p>

        <button
          @click="handleAddPhoto"
          :disabled="isLoading || !photoPreview"
          class="upload-btn"
        >
          <span v-if="isLoading">Uploading...</span>
          <span v-else>Upload Photo</span>
        </button>
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
    const isFormVisible = ref(true);
    const photoPreview = ref("");
    const uploadError = ref("");
    const uploadSuccess = ref("");
    const photoDescription = ref("");
    const photoTags = ref("");
    const isLoading = ref(false);
    const croppedBlob = ref(null);
    const fileInput = ref(null);

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const ALLOWED_FILE_TYPES = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "video/mpeg",
      "video/webm",
    ];
    const handlePhotoUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > MAX_FILE_SIZE) {
        uploadError.value = "❌ File size exceeds the 5MB limit.";
        return;
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        uploadError.value = "❌ Please upload JPEG, PNG, or GIF only.";
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => cropImageToSquare(e.target.result, file.type);
      reader.readAsDataURL(file);
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

        canvas.toBlob((blob) => {
          croppedBlob.value = blob;
          photoPreview.value = canvas.toDataURL(fileType);
          uploadError.value = "";
        }, fileType);
      };
    };

    const handleAddPhoto = async () => {
      if (!croppedBlob.value) {
        uploadError.value = "Please select a photo first!";
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        uploadError.value = "Please log in to upload!";
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
        const authorName = userSnap.exists()
          ? userSnap.data().name || userSnap.data().displayName || "Anonymous"
          : "Anonymous";

        await setDoc(doc(db, "photos", newPhotoRef.id), {
          photoURL,
          imgDescription: photoDescription.value,
          tags: photoTags.value.split(",").map((tag) => tag.trim()),
          comments: [],
          likes: [],
          likeCount: 0,
          uploadedAt: new Date(),
          author: user.uid,
          authorName,
          authorProfilePicture: userSnap.data().profilePicture || "",
        });

        uploadSuccess.value = "✅ Photo uploaded successfully!";
        uploadError.value = "";
        setTimeout(() => closeForm(), 1000);
      } catch (error) {
        uploadError.value = "❌ Upload failed: " + error.message;
      } finally {
        isLoading.value = false;
      }
    };

    const closeForm = () => {
      isFormVisible.value = false;
      resetForm();
    };

    const resetForm = () => {
      photoPreview.value = "";
      photoDescription.value = "";
      photoTags.value = "";
      uploadError.value = "";
      uploadSuccess.value = "";
      croppedBlob.value = null;
      if (fileInput.value) fileInput.value.value = "";
    };

    return {
      isFormVisible,
      photoPreview,
      uploadError,
      uploadSuccess,
      photoDescription,
      photoTags,
      isLoading,
      fileInput,
      handlePhotoUpload,
      handleAddPhoto,
      closeForm,
    };
  },
};
</script>

<style lang="scss" scoped>
$primary-color: #1a1a2e;
$primary-hover: #101043;
$background-color: #121212;
$text-color: #e0e0e0;

.photo-upload-form {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.form-content {
  position: relative;
  background: $background-color;
  padding: 30px;
  border-radius: 15px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
  color: $text-color;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  color: $text-color;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  line-height: 24px;
  &:hover {
    color: lighten($text-color, 20%);
  }
}

h2 {
  margin: 0 0 20px;
  text-align: center;
  color: $text-color;
}

.preview-section {
  margin-bottom: 20px;
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 10px;
  border: 2px solid $primary-color;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-size: 14px;
  color: $text-color;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid $primary-color;
  border-radius: 5px;
  background: darken($background-color, 5%);
  color: $text-color;
  font-size: 14px;
  resize: vertical;
}

.file-input {
  padding: 5px;
}

.error {
  color: #ff4444;
  font-size: 14px;
  text-align: center;
}

.success {
  color: #44ff44;
  font-size: 14px;
  text-align: center;
}

.upload-btn {
  padding: 12px;
  background: $primary-hover;
  color: $text-color;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  font-size: 16px;
  &:hover:not(:disabled) {
    background: lighten($primary-hover, 10%);
  }
  &:disabled {
    background: #555;
    cursor: not-allowed;
  }
}
</style>
