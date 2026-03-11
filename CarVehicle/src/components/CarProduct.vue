<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select'])
</script>

<template>
  <article class="car-product" :class="{ 'is-active': active }" @click="emit('select', item)">
    <div class="car-media">
      <img
        :src="props.item.image"
        :alt="`${props.item.brand} ${props.item.model} ${props.item.version}`"
      />
    </div>
    <div class="car-info">
      <p class="car-label">{{ props.item.brand }}</p>
      <h3 class="car-title">{{ props.item.model }} - {{ props.item.version }}</h3>
      <p class="car-description">{{ props.item.description }}</p>
      <div class="car-footer">
        <div class="car-price">{{ price }}</div>
        <RouterLink
          class="btn-detail"
          :to="{ name: 'product-detail', params: { id: item.id } }"
          @click.stop
          >Xem chi tiết</RouterLink
        >
      </div>
    </div>
  </article>
</template>

<style scoped>
.car-product {
  display: grid;
  grid-template-columns: minmax(220px, 280px) 1fr;
  gap: 20px;
  padding: 20px;
  border-radius: 18px;
  border: 1px solid rgba(127, 162, 214, 0.18);
  background: rgba(12, 18, 26, 0.7);
  box-shadow: 0 10px 20px rgba(4, 8, 14, 0.45);
  align-items: center;
  min-height: 220px;
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.car-product:hover {
  border-color: rgba(31, 111, 235, 0.5);
}

.car-product.is-active {
  border-color: #1f6feb;
  box-shadow:
    0 0 0 2px rgba(31, 111, 235, 0.3),
    0 10px 20px rgba(4, 8, 14, 0.45);
}

.car-media {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(15, 22, 32, 0.7);
  border: 1px solid rgba(127, 162, 214, 0.18);
}

.car-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.car-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.car-label {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #7fa2d6;
}

.car-title {
  margin: 0;
  font-size: 22px;
}

.car-description {
  margin: 0;
  color: #c2d1ea;
}

.car-price {
  font-size: 18px;
  font-weight: 600;
  color: #00d4ff;
}

.car-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-detail {
  padding: 7px 16px;
  border-radius: 999px;
  border: 1px solid rgba(127, 162, 214, 0.4);
  background: transparent;
  color: #e9f1ff;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  font-family: inherit;
  white-space: nowrap;
  transition:
    background 0.2s,
    border-color 0.2s;
}

.btn-detail:hover {
  background: #1f6feb;
  border-color: #1f6feb;
  color: #fff;
}

@media (max-width: 720px) {
  .car-product {
    grid-template-columns: 1fr;
  }

  .car-media {
    min-height: 180px;
  }
}
</style>
