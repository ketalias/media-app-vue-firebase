<template>
  <swiper
    :modules="[Navigation, Pagination]"
    :slides-per-view="1"
    :space-between="50"
    :navigation="false"
    :pagination="{ clickable: true }"
    class="container"
  >
    <swiper-slide v-for="(image, index) in images" :key="index">
      <img :src="image" alt="Slide Image" class="carousel-image" />
    </swiper-slide>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

export default {
  components: { Swiper, SwiperSlide },
  setup() {
    const images = [
      "https://lookw.net/14/1436/1638365280-1001.jpg",
      "https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg",
      "https://wallpapercave.com/wp/wp9573414.jpg",
    ];

    return { images, Navigation, Pagination };
  },
};
</script>

<style lang="scss">
.container {
  width: 50%;
  height: 100%;
}
.carousel-image {
  width: 100%;
  height: 100%;
  background-position: center;
  object-fit: cover;
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}
</style>
