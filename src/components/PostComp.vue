<template>
  <div class="publish">
    <div class="publish-text">
      <p>
        Publish your
        <span style="color: #105ae4">creativity</span>!
      </p>
    </div>
    <button @click="toggleUploadForm">Publish</button>
    <div v-if="uploadForm"><PhotoUploadForm /></div>
  </div>
</template>

<script>
import PhotoUploadForm from "@/components/PhotoUploadForm.vue";
export default {
  name: "PostsScroll",

  data() {
    return {
      uploadForm: false,
      file: null,
      description: "",
      tags: "",
      images: [],
    };
  },
  components: {
    PhotoUploadForm,
  },

  methods: {
    toggleUploadForm() {
      this.uploadForm = !this.uploadForm;
    },
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    upload() {
      if (this.file && this.description) {
        console.log("Uploading:", this.file, this.description, this.tags);
        // Handle file upload logic here
      } else {
        alert("Please provide a file and description");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/userview.scss";
</style>
