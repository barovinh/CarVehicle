<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import CarProduct from '../components/CarProduct.vue'
import { fetchFeaturedProducts } from '../services/featuredProductsApi'

const featuredItems = ref([])
const loadingFeatured = ref(true)
const featuredError = ref(false)

const featuredUpdatedAt = ref('')

const formatPrice = (value) => `${new Intl.NumberFormat('vi-VN').format(value)} đ`

const featuredEmpty = computed(() => !loadingFeatured.value && !featuredError.value && !featuredItems.value.length)

onMounted(async () => {
  loadingFeatured.value = true
  featuredError.value = false

  try {
    const data = await fetchFeaturedProducts({ limit: 3 })
    featuredItems.value = Array.isArray(data.items) ? data.items : []
    featuredUpdatedAt.value = data.updatedAt || ''
  } catch {
    featuredError.value = true
  } finally {
    loadingFeatured.value = false
  }
})
</script>

<template>
  <section class="page">
    <header class="page-hero home-hero">
      <div class="hero-copy">
        <p class="eyebrow">{{ $t('home.eyebrow') }}</p>
        <h1 class="hero-title">{{ $t('home.title') }}</h1>
        <p class="lead hero-lead">{{ $t('home.lead') }}</p>
        <div class="hero-actions">
          <RouterLink class="btn primary" to="/ds-san-pham">{{ $t('home.actions.products') }}</RouterLink>
          <RouterLink class="btn ghost" to="/lien-he">{{ $t('home.actions.contact') }}</RouterLink>
        </div>

        <div class="hero-highlights">
          <div class="hero-chip">{{ $t('home.cards.highlight.title') }}</div>
          <div class="hero-chip">{{ $t('home.cards.services.title') }}</div>
          <div class="hero-chip">{{ $t('home.cards.promo.title') }}</div>
        </div>
      </div>

      <div class="hero-media">
        <img class="hero-image" src="/images/home-hero.svg" alt="CarVehicle hero" loading="lazy" />
      </div>
    </header>

    <section class="home-section">
      <header class="section-head">
        <p class="eyebrow">{{ $t('home.featured.eyebrow') }}</p>
        <h2 class="section-title">{{ $t('home.featured.title') }}</h2>
        <p class="section-lead">{{ $t('home.featured.lead') }}</p>
        <p v-if="featuredUpdatedAt" class="section-updated">
          {{ $t('home.featured.updatedAt') }}: {{ featuredUpdatedAt }}
        </p>
      </header>

      <p v-if="loadingFeatured" class="state-msg">{{ $t('home.featured.states.loading') }}</p>
      <p v-else-if="featuredError" class="state-msg error">{{ $t('home.featured.states.error') }}</p>
      <p v-else-if="featuredEmpty" class="state-msg">{{ $t('home.featured.states.empty') }}</p>

      <div v-else class="featured-list">
        <CarProduct
          v-for="item in featuredItems"
          :key="item.id"
          :item="item"
          :price="formatPrice(item.price)"
        />

        <div class="featured-footer">
          <RouterLink class="btn ghost" to="/ds-san-pham">{{ $t('home.featured.actions.all') }}</RouterLink>
        </div>
      </div>
    </section>

    <section class="home-section">
      <header class="section-head">
        <p class="eyebrow">{{ $t('home.aboutSection.eyebrow') }}</p>
        <h2 class="section-title">{{ $t('home.aboutSection.title') }}</h2>
        <p class="section-lead">{{ $t('home.aboutSection.lead') }}</p>
      </header>

      <div class="page-grid">
        <article class="card">
          <h3 class="card-title">{{ $t('home.aboutSection.cards.intro.title') }}</h3>
          <p>{{ $t('home.aboutSection.cards.intro.body') }}</p>
        </article>

        <article class="card">
          <h3 class="card-title">{{ $t('home.aboutSection.cards.services.title') }}</h3>
          <p>{{ $t('home.aboutSection.cards.services.body') }}</p>
        </article>

        <article class="card">
          <h3 class="card-title">{{ $t('home.aboutSection.cards.consulting.title') }}</h3>
          <p>{{ $t('home.aboutSection.cards.consulting.body') }}</p>
        </article>

        <article class="card">
          <h3 class="card-title">{{ $t('home.aboutSection.cards.vision.title') }}</h3>
          <p>{{ $t('home.aboutSection.cards.vision.body') }}</p>
        </article>

        <article class="card">
          <h3 class="card-title">{{ $t('home.aboutSection.cards.mission.title') }}</h3>
          <p>{{ $t('home.aboutSection.cards.mission.body') }}</p>
        </article>
      </div>
    </section>
  </section>
</template>

<style scoped>
.home-hero {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 26px;
  align-items: center;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hero-title {
  margin: 0;
  font-size: 40px;
  line-height: 1.05;
}

.hero-lead {
  margin: 0;
  color: #c2d1ea;
}

.hero-media {
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(127, 162, 214, 0.18);
  background: rgba(12, 18, 26, 0.7);
}

.hero-image {
  width: 100%;
  height: 320px;
  object-fit: cover;
  display: block;
}

.hero-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.hero-chip {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(127, 162, 214, 0.35);
  background: rgba(15, 20, 27, 0.7);
  color: #e9f1ff;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.home-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.section-head {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-title {
  margin: 0;
  font-size: 22px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.section-lead {
  margin: 0;
  color: #c2d1ea;
  max-width: 740px;
  line-height: 1.7;
}

.section-updated {
  margin: 10px 0 0;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(127, 162, 214, 0.85);
}

.state-msg {
  color: #7fa2d6;
  font-size: 15px;
}

.state-msg.error {
  color: #f87171;
}

.featured-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.featured-footer {
  display: flex;
  justify-content: flex-start;
}

.card-title {
  margin: 0 0 10px;
  font-size: 18px;
  letter-spacing: 0.04em;
}

@media (max-width: 900px) {
  .home-hero {
    grid-template-columns: 1fr;
  }

  .hero-image {
    height: 260px;
  }
}
</style>
