<template>
  <div class="swipe-container">
    <transition-group name="swipe" tag="div">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="swipe-card"
        :style="{
          zIndex: cards.length - index,
          backgroundImage: `url(${card.url})`,
        }"
        v-touch:swipe.left="() => swipe(index, 'left')"
        v-touch:swipe.right="() => swipe(index, 'right')"
        v-touch-options="{ passive: false }"
      >
        <div class="card-content"></div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { ref } from "vue";
import "vue3-touch-events";

export default {
  setup() {
    const cards = ref([
      {
        id: 1,
        title: "Card 1",
        description: "This is the first card.",
        url: "https://miro.medium.com/v2/resize:fit:1200/1*L3WKlqI4W7hQwX4AzWUJJA.jpeg",
      },
      {
        id: 2,
        title: "Card 2",
        description: "This is the second card.",
        url: "https://img.redbull.com/images/c_crop,w_6967,h_3484,x_0,y_0/c_auto,w_1200,h_600/f_auto,q_auto/redbullcom/2018/10/17/c8944b85-004a-41dc-a373-d0dbfec2d06d/cyberpunk-2077-science-fiction-dystopia",
      },

      {
        id: 3,
        title: "Card 3",
        description: "This is the third card.",
        url: "https://st.overclockers.ru/images/soft/2020/11/27/cyber2.jpg",
      },
    ]);

    const swipe = (index, direction) => {
      if (index < 0 || index >= cards.value.length) return;

      const card = document.querySelectorAll(".swipe-card")[index];
      if (!card) return;

      card.style.transition = "transform 0.5s ease-out, opacity 0.5s ease-out";
      card.style.transform =
        direction === "left"
          ? "translateX(-150%) rotate(-20deg)"
          : "translateX(150%) rotate(20deg)";
      card.style.opacity = "0";

      setTimeout(() => {
        cards.value.splice(index, 1);
      }, 500);
    };

    return { cards, swipe };
  },
};
</script>

<style scoped>
.swipe-container {
  position: relative;
  width: 500px;
  height: 600px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 10px;
}

.swipe-card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.5s ease-out, opacity 0.5s ease-out;
}

.card-content {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.swipe-enter-active,
.swipe-leave-active {
  transition: all 0.5s ease;
}

.swipe-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.swipe-leave-to {
  opacity: 0;
  transform: scale(1.2);
}
</style>
