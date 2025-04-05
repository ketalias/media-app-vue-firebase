<template>
  <div class="photo-card">
    <div class="media-container">
      <img
        v-if="!isVideo"
        :src="imageSrc"
        class="photo-card-image"
        alt="Photo"
      />
      <video v-else controls class="photo-card-image">
        <source :src="imageSrc" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>

    <div class="photo-info">
      <div class="interactions">
        <span @click="toggleLike" class="icon-wrapper">
          <img
            :src="isLiked ? likeFilledIcon : likeIcon"
            alt="Like"
            :class="{ liked: isAnimating }"
          />
          <p>{{ localLikes.length }}</p>
        </span>
        <span @click="showComments = !showComments" class="icon-wrapper">
          <img src="../assets/comment.png" alt="Comment" />
          <p>{{ localComments.length }}</p>
        </span>
      </div>

      <div v-if="isEditingDescription">
        <textarea
          v-model="editedDescription"
          placeholder="Edit description"
        ></textarea>
        <button @click="updateDescription">Save</button>
        <button @click="isEditingDescription = false">Cancel</button>
      </div>
      <p v-else @click="startEditingDescription">
        <b>{{ authorName }}</b
        >: {{ editedDescription || description }}
      </p>

      <button v-if="userId === author" @click="deletePhoto" class="delete-btn">
        <img src="../assets/trash.png" alt="Delete" />
      </button>

      <div v-if="showComments" class="comments">
        <div
          v-for="(comment, index) in localComments"
          :key="index"
          class="comment"
        >
          <strong>{{ comment.username || "Anonymous" }}</strong
          >: {{ comment.text }}
          <button
            v-if="userId === author || comment.username === username"
            @click="deleteComment(comment)"
          >
            Delete
          </button>
        </div>
        <input
          v-model="newComment"
          type="text"
          placeholder="Add a comment..."
          @keyup.enter="addComment"
        />
        <button @click="addComment">Post</button>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  arrayRemove,
  increment,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { getAuth } from "firebase/auth";

const auth = getAuth();

export default {
  name: "PhotoCard",
  props: {
    imageSrc: { type: String, required: true },
    description: { type: String, default: "No description available." },
    photoId: { type: String, required: true },
  },
  data() {
    return {
      isLiked: false,
      isAnimating: false,
      newComment: "",
      showComments: false,
      userId: null,
      username: "Anonymous",
      localLikes: [],
      localComments: [],
      author: null,
      authorName: "none",
      isEditingDescription: false,
      editedDescription: "",
      isVideo: false,
      likeIcon: require("../assets/like.png"),
      likeFilledIcon: require("../assets/like-filled.png"),
    };
  },
  mounted() {
    const user = auth.currentUser;
    if (user) {
      this.userId = user.uid;
      this.fetchUsername(user.uid);
    }

    const photoRef = doc(db, "photos", this.photoId);
    onSnapshot(photoRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.author = data.author;
        this.authorName = data.authorName;
        this.localLikes = data.likes || [];
        this.localComments = data.comments || [];
        this.isLiked = this.userId && this.localLikes.includes(this.userId);
        this.editedDescription = data.description || this.description;
        this.isVideo = data.isVideo || false;
      } else {
        console.error(`Document with photoId ${this.photoId} does not exist.`);
      }
    });
  },
  methods: {
    async fetchUsername(uid) {
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          this.username = userData.name || userData.displayName || "Anonymous";
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    },
    async deletePhoto() {
      if (!this.userId || this.userId !== this.author) {
        alert("You can only delete your own photo.");
        return;
      }

      if (!confirm("Are you sure you want to delete this photo?")) return;

      const photoRef = doc(db, "users", this.author, "photos", this.photoId);
      const photoCopyRef = doc(db, "photos", this.photoId);
      const storage = getStorage();
      const imageRef = ref(storage, this.imageSrc);

      try {
        await deleteObject(imageRef);
        await deleteDoc(photoRef);
        await deleteDoc(photoCopyRef);
        this.$emit("photo-deleted", this.photoId);
      } catch (error) {
        console.error("Error deleting photo:", error);
      }
    },
    async toggleLike() {
      if (!this.userId) {
        alert("Please log in to like this photo.");
        return;
      }

      this.isAnimating = true;

      const photoRef = doc(db, "photos", this.photoId);
      try {
        if (this.isLiked) {
          await updateDoc(photoRef, {
            likes: arrayRemove(this.userId),
            likeCount: increment(-1),
          });
        } else {
          await updateDoc(photoRef, {
            likes: arrayUnion(this.userId),
            likeCount: increment(1),
          });
        }
      } catch (error) {
        console.error("Error toggling like:", error);
      } finally {
        setTimeout(() => {
          this.isAnimating = false;
        }, 300);
      }
    },
    async addComment() {
      if (!this.userId || !this.newComment.trim()) {
        alert("Please log in and enter a comment.");
        return;
      }

      const newCommentData = {
        username: this.username,
        text: this.newComment.trim(),
        timestamp: new Date().toISOString(),
      };

      const photoRef = doc(db, "photos", this.photoId);
      try {
        await updateDoc(photoRef, {
          comments: arrayUnion(newCommentData),
        });
        this.newComment = "";
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    },
    async deleteComment(comment) {
      if (
        !this.userId ||
        (this.userId !== this.author && comment.username !== this.username)
      ) {
        alert("You can only delete your own comments.");
        return;
      }

      const photoRef = doc(db, "photos", this.photoId);
      try {
        await updateDoc(photoRef, {
          comments: arrayRemove(comment),
        });
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    },
    async updateDescription() {
      if (!this.userId || this.userId !== this.author) {
        alert("Only the author can update the description.");
        return;
      }

      const newDescription = this.editedDescription.trim();
      if (!newDescription) {
        alert("Description cannot be empty.");
        return;
      }

      const photoRef = doc(db, "photos", this.photoId);
      try {
        await updateDoc(photoRef, {
          description: newDescription,
        });
        this.isEditingDescription = false;
      } catch (error) {
        console.error("Error updating description:", error);
      }
    },
    startEditingDescription() {
      if (this.userId === this.author) {
        this.isEditingDescription = true;
      } else {
        alert("Only the author can edit the description.");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/post-card.scss";
</style>
