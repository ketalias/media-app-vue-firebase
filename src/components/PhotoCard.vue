<template>
  <div class="photo-card" @click="onCardClick">
    <div class="photo-card-image-wrapper">
      <img :src="imageSrc" :alt="imageAlt" class="photo-card-image" />
    </div>
    <div class="photo-card-details">
      <h3 class="photo-card-title">{{ title }}</h3>
      <p class="photo-card-description">{{ description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "PhotoCard",
  props: {
    imageSrc: {
      type: String,
      required: true,
    },
    imageAlt: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    onCardClick: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style scoped>
.photo-card {
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  max-width: 300px;
}

.photo-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.photo-card-image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
}

.photo-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-card-details {
  padding: 15px;
  background-color: #fff;
}

.photo-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.photo-card-description {
  font-size: 0.95rem;
  color: #666;
  margin-top: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
