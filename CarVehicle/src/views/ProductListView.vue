<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import CarProduct from '../components/CarProduct.vue'
import BookingDialog from '../components/BookingDialog.vue'

const allPrices = ref([])
const loading = ref(true)
const hasError = ref(false)
const selectedCar = ref(null)
const showBooking = ref(false)

const search = ref('')
const selectedBrand = ref('')
const selectedModel = ref('')
const selectedVersion = ref('')
const maxPriceFilter = ref(2000000000)

const PAGE_SIZE = 8
const currentPage = ref(1)

const formatPrice = (value) => `${new Intl.NumberFormat('vi-VN').format(value)} đ`

onMounted(async () => {
  try {
    const response = await fetch('/api/prices')
    if (!response.ok) throw new Error('Failed.')
    const data = await response.json()
    allPrices.value = Array.isArray(data.items) ? data.items : []
    maxPriceFilter.value = Math.max(...allPrices.value.map((p) => p.price))
  } catch {
    hasError.value = true
  } finally {
    loading.value = false
  }
})

const ceilPrice = computed(() => Math.max(...allPrices.value.map((p) => p.price), 2000000000))

const brands = computed(() => [...new Set(allPrices.value.map((p) => p.brand))])

const models = computed(() => {
  const list = selectedBrand.value
    ? allPrices.value.filter((p) => p.brand === selectedBrand.value)
    : allPrices.value
  return [...new Set(list.map((p) => p.model))]
})

const versions = computed(() => {
  const list = allPrices.value.filter((p) => {
    if (selectedBrand.value && p.brand !== selectedBrand.value) return false
    if (selectedModel.value && p.model !== selectedModel.value) return false
    return true
  })
  return [...new Set(list.map((p) => p.version))]
})

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  return allPrices.value.filter((p) => {
    if (q && !`${p.brand} ${p.model} ${p.version}`.toLowerCase().includes(q)) return false
    if (selectedBrand.value && p.brand !== selectedBrand.value) return false
    if (selectedModel.value && p.model !== selectedModel.value) return false
    if (selectedVersion.value && p.version !== selectedVersion.value) return false
    if (p.price > maxPriceFilter.value) return false
    return true
  })
})

function onBrandChange() {
  selectedModel.value = ''
  selectedVersion.value = ''
}

function onModelChange() {
  selectedVersion.value = ''
}

function resetFilters() {
  search.value = ''
  selectedBrand.value = ''
  selectedModel.value = ''
  selectedVersion.value = ''
  maxPriceFilter.value = ceilPrice.value
  currentPage.value = 1
}

function selectCar(item) {
  selectedCar.value = selectedCar.value?.id === item.id ? null : item
}

function closeCar() {
  selectedCar.value = null
}

watch(filtered, () => {
  currentPage.value = 1
})

const totalPages = computed(() => Math.ceil(filtered.value.length / PAGE_SIZE))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filtered.value.slice(start, start + PAGE_SIZE)
})

const pageList = computed(() => {
  const total = totalPages.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const cur = currentPage.value
  const pages = new Set([1, total, cur, cur - 1, cur + 1].filter((p) => p >= 1 && p <= total))
  const sorted = [...pages].sort((a, b) => a - b)
  const result = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push('...')
    result.push(p)
  })
  return result
})
</script>

<template>
  <section class="page">
    <!-- FULL-WIDTH PAGE HEADER -->
    <header class="products-header">
      <div class="products-header-text">
        <p class="eyebrow">{{ $t('products.eyebrow') }}</p>
        <h1>{{ $t('products.title') }}</h1>
        <p class="lead">{{ $t('products.lead') }}</p>
      </div>
      <div class="products-header-stats">
        <div class="hstat">
          <span class="hstat-num">{{ filtered.length }}</span>
          <span class="hstat-label">xe phù hợp</span>
        </div>
        <div class="hstat">
          <span class="hstat-num">{{ allPrices.length }}</span>
          <span class="hstat-label">tổng số xe</span>
        </div>
      </div>
    </header>

    <div class="products-layout" :class="{ 'has-detail': selectedCar }">
      <!-- SIDEBAR FILTER -->
      <aside class="filter-sidebar">
        <h3 class="filter-title">Bộ lọc</h3>

        <div class="filter-group">
          <label class="filter-label">Tìm kiếm</label>
          <input
            class="filter-input"
            v-model="search"
            :placeholder="$t('products.filter.searchPlaceholder')"
          />
        </div>

        <div class="filter-group">
          <label class="filter-label">{{ $t('products.filter.brand') }}</label>
          <select class="filter-select" v-model="selectedBrand" @change="onBrandChange">
            <option value="">{{ $t('products.filter.all') }}</option>
            <option v-for="b in brands" :key="b" :value="b">{{ b }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">{{ $t('products.filter.model') }}</label>
          <select class="filter-select" v-model="selectedModel" @change="onModelChange">
            <option value="">{{ $t('products.filter.all') }}</option>
            <option v-for="m in models" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">{{ $t('products.filter.version') }}</label>
          <select class="filter-select" v-model="selectedVersion">
            <option value="">{{ $t('products.filter.all') }}</option>
            <option v-for="v in versions" :key="v" :value="v">{{ v }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">
            {{ $t('products.filter.priceMax') }}:
            <strong class="price-val">{{ formatPrice(maxPriceFilter) }}</strong>
          </label>
          <input
            type="range"
            class="filter-range"
            v-model.number="maxPriceFilter"
            :min="0"
            :max="ceilPrice"
            :step="10000000"
          />
          <div class="range-bounds">
            <span>0 đ</span>
            <span>{{ formatPrice(ceilPrice) }}</span>
          </div>
        </div>

        <button class="filter-reset" @click="resetFilters">
          {{ $t('products.filter.reset') }}
        </button>
      </aside>

      <!-- PRODUCT LIST -->
      <div class="products-content">
        <p v-if="loading" class="state-msg">{{ $t('products.prices.loading') }}</p>
        <p v-else-if="hasError" class="state-msg">{{ $t('products.prices.error') }}</p>
        <p v-else-if="!filtered.length" class="state-msg">
          {{ $t('products.filter.noResults') }}
        </p>
        <div v-else class="car-list">
          <CarProduct
            v-for="item in paginatedItems"
            :key="item.id"
            :item="item"
            :price="formatPrice(item.price)"
            :active="selectedCar?.id === item.id"
            @select="selectCar"
          />
        </div>

        <!-- PAGINATION -->
        <nav class="pagination">
          <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
            &#8592;
          </button>

          <template v-for="(p, i) in pageList" :key="i">
            <span v-if="p === '...'" class="page-ellipsis">&#8230;</span>
            <button
              v-else
              class="page-btn"
              :class="{ active: p === currentPage }"
              @click="currentPage = p"
            >
              {{ p }}
            </button>
          </template>

          <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
            &#8594;
          </button>
        </nav>
      </div>
      <!-- RIGHT: DETAIL SIDEBAR -->
      <aside class="detail-sidebar" :class="{ visible: selectedCar }">
        <template v-if="selectedCar">
          <div class="detail-header">
            <p class="detail-eyebrow">{{ selectedCar.brand }}</p>
            <button class="detail-close" @click="closeCar">&#x2715;</button>
          </div>
          <img class="detail-img" :src="selectedCar.image" :alt="selectedCar.model" />
          <h2 class="detail-title">{{ selectedCar.model }}</h2>
          <p class="detail-version">
            Phiên bản: <strong>{{ selectedCar.version }}</strong>
          </p>
          <p class="detail-price">{{ formatPrice(selectedCar.price) }}</p>
          <p class="detail-desc">{{ selectedCar.description }}</p>
          <div class="detail-specs">
            <div class="spec-row">
              <span class="spec-key">Hãng xe</span>
              <span class="spec-val">{{ selectedCar.brand }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-key">Dòng xe</span>
              <span class="spec-val">{{ selectedCar.model }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-key">Phiên bản</span>
              <span class="spec-val">{{ selectedCar.version }}</span>
            </div>
            <div class="spec-row">
              <span class="spec-key">Giá bán</span>
              <span class="spec-val price">{{ formatPrice(selectedCar.price) }}</span>
            </div>
          </div>
          <button class="detail-cta" @click="showBooking = true">Đặt lịch lái thử</button>
          <RouterLink
            class="detail-cta detail-cta-outline"
            :to="{ name: 'product-detail', params: { id: selectedCar.id } }"
            >Xem chi tiết</RouterLink
          >
        </template>
      </aside>
    </div>

    <BookingDialog v-model="showBooking" :car="selectedCar" />
  </section>
</template>

<style scoped>
/* ---- PAGE HEADER ---- */
.products-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 32px 36px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(24, 34, 50, 0.9), rgba(9, 13, 19, 0.55));
  border: 1px solid rgba(127, 162, 214, 0.25);
  box-shadow: 0 18px 45px rgba(4, 8, 14, 0.5);
}

.products-header-text h1 {
  margin: 6px 0 8px;
  font-size: 30px;
}

.products-header-text .lead {
  margin: 0;
  font-size: 15px;
  color: #c2d1ea;
}

.products-header-stats {
  display: flex;
  gap: 32px;
}

.hstat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.hstat-num {
  font-size: 32px;
  font-weight: 700;
  color: #00d4ff;
  line-height: 1;
}

.hstat-label {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #7fa2d6;
}

/* ---- GRID ---- */
.products-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;
  align-items: start;
  transition: grid-template-columns 0.3s ease;
}

.products-layout.has-detail {
  grid-template-columns: 220px 1fr 260px;
}

/* ---- SIDEBAR ---- */
.filter-sidebar {
  position: sticky;
  top: 100px;
  background: rgba(12, 18, 26, 0.7);
  border: 1px solid rgba(127, 162, 214, 0.18);
  border-radius: 18px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(127, 162, 214, 0.3) transparent;
}

.filter-title {
  margin: 0;
  font-size: 13px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #7fa2d6;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  color: #c2d1ea;
}

.price-val {
  color: #00d4ff;
}

.filter-input,
.filter-select {
  padding: 9px 12px;
  border-radius: 10px;
  border: 1px solid rgba(127, 162, 214, 0.28);
  background: rgba(15, 22, 32, 0.8);
  color: #e9f1ff;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.filter-input:focus,
.filter-select:focus {
  border-color: #1f6feb;
}

.filter-range {
  width: 100%;
  accent-color: #1f6feb;
  cursor: pointer;
}

.range-bounds {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #7fa2d6;
}

.filter-reset {
  padding: 9px;
  border-radius: 999px;
  border: 1px solid rgba(127, 162, 214, 0.35);
  background: transparent;
  color: #e9f1ff;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.filter-reset:hover {
  background: #1f6feb;
  border-color: #1f6feb;
  color: #0a0f14;
}

/* ---- CONTENT ---- */
.products-content {
  min-width: 0;
}

.car-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.state-msg {
  color: #7fa2d6;
  font-size: 15px;
}

/* ---- PAGINATION ---- */
.pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 28px;
}

.page-btn {
  min-width: 38px;
  height: 38px;
  padding: 0 10px;
  border-radius: 10px;
  border: 1px solid rgba(127, 162, 214, 0.28);
  background: rgba(15, 22, 32, 0.8);
  color: #e9f1ff;
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: #1f6feb;
  background: rgba(31, 111, 235, 0.15);
}

.page-btn.active {
  background: #1f6feb;
  border-color: #1f6feb;
  color: #fff;
  font-weight: 700;
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-ellipsis {
  color: #7fa2d6;
  font-size: 16px;
  padding: 0 4px;
}

/* ---- DETAIL SIDEBAR ---- */
.detail-sidebar {
  position: sticky;
  top: 100px;
  background: rgba(12, 18, 26, 0.7);
  border: 1px solid rgba(127, 162, 214, 0.18);
  border-radius: 18px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  /* hidden by default, becomes a real column only via has-detail */
  width: 0;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.25s ease,
    width 0.3s ease;
}

.detail-sidebar.visible {
  width: 280px;
  opacity: 1;
  pointer-events: auto;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: calc(100vh - 120px);
  scrollbar-width: thin;
  scrollbar-color: rgba(127, 162, 214, 0.3) transparent;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-eyebrow {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #7fa2d6;
}

.detail-close {
  background: none;
  border: 1px solid rgba(127, 162, 214, 0.28);
  border-radius: 8px;
  color: #e9f1ff;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.detail-close:hover {
  background: rgba(255, 255, 255, 0.08);
}

.detail-img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  display: block;
  border: 1px solid rgba(127, 162, 214, 0.14);
}

.detail-title {
  margin: 0;
  font-size: 20px;
}

.detail-version {
  margin: 0;
  font-size: 13px;
  color: #c2d1ea;
}

.detail-price {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #00d4ff;
}

.detail-desc {
  margin: 0;
  font-size: 13px;
  color: #c2d1ea;
  line-height: 1.6;
}

.detail-specs {
  display: flex;
  flex-direction: column;
  border-top: 1px solid rgba(127, 162, 214, 0.14);
  padding-top: 12px;
  gap: 0;
}

.spec-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 7px 0;
  border-bottom: 1px solid rgba(127, 162, 214, 0.08);
}

.spec-key {
  color: #7fa2d6;
}

.spec-val {
  color: #e9f1ff;
  font-weight: 600;
}

.spec-val.price {
  color: #00d4ff;
}

.detail-cta {
  padding: 11px;
  border-radius: 999px;
  border: none;
  background: #1f6feb;
  color: #fff;
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.2s;
  margin-top: 4px;
}

.detail-cta:hover {
  opacity: 0.85;
}

.detail-cta-outline {
  background: transparent;
  border: 1px solid rgba(127, 162, 214, 0.4);
  color: #e9f1ff;
  text-decoration: none;
  display: block;
  text-align: center;
}

.detail-cta-outline:hover {
  opacity: 1;
  border-color: #1f6feb;
  background: rgba(31, 111, 235, 0.12);
}

@media (max-width: 1100px) {
  .products-layout,
  .products-layout.has-detail {
    grid-template-columns: 220px 1fr;
  }
  .detail-sidebar.visible {
    display: none;
  }
}

@media (max-width: 900px) {
  .products-layout,
  .products-layout.has-detail {
    grid-template-columns: 1fr;
  }
  .filter-sidebar {
    position: static;
  }
}
</style>
