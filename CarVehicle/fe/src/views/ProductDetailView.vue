<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookingDialog from '../components/BookingDialog.vue'
import CarViewer3D from '../components/CarViewer3D.vue'

const route = useRoute()
const router = useRouter()

const car = ref(null)
const loading = ref(true)
const hasError = ref(false)
const showBooking = ref(false)
const viewMode = ref('image')

const formatPrice = (value) => `${new Intl.NumberFormat('vi-VN').format(value)} đ`

onMounted(async () => {
  try {
    const res = await fetch(`/api/prices/${route.params.id}`)
    if (!res.ok) throw new Error('Not found')
    const data = await res.json()
    car.value = data.item
  } catch {
    hasError.value = true
  } finally {
    loading.value = false
  }
})

const specs = [
  { key: 'Hãng xe', field: 'brand' },
  { key: 'Dòng xe', field: 'model' },
  { key: 'Phiên bản', field: 'version' },
]
</script>

<template>
  <section class="page">
    <!-- Loading / Error -->
    <p v-if="loading" class="state-msg">Đang tải dữ liệu...</p>
    <p v-else-if="hasError" class="state-msg error">Không tìm thấy sản phẩm này.</p>

    <template v-else-if="car">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <RouterLink to="/ds-san-pham">Danh sách xe</RouterLink>
        <span class="sep">›</span>
        <span>{{ car.brand }} {{ car.model }} {{ car.version }}</span>
      </nav>

      <!-- Hero -->
      <div class="detail-hero">
        <div class="detail-gallery">
          <div class="gallery-tabs">
            <button
              class="gallery-tab"
              :class="{ active: viewMode === 'image' }"
              @click="viewMode = 'image'"
            >
              🖼 Hình ảnh
            </button>
            <button
              class="gallery-tab"
              :class="{ active: viewMode === '3d' }"
              @click="viewMode = '3d'"
            >
              ✦ Xem 3D
            </button>
          </div>
          <img
            v-if="viewMode === 'image'"
            class="gallery-main"
            :src="car.image"
            :alt="`${car.brand} ${car.model}`"
          />
          <CarViewer3D v-else :car="car" />
        </div>
        <div class="detail-summary">
          <p class="detail-eyebrow">{{ car.brand }}</p>
          <h1 class="detail-name">{{ car.model }}</h1>
          <p class="detail-version-badge">Phiên bản {{ car.version }}</p>
          <p class="detail-description">{{ car.description }}</p>
          <div class="detail-price-block">
            <span class="price-label">Giá tham khảo</span>
            <span class="price-value">{{ formatPrice(car.price) }}</span>
          </div>
          <div class="detail-actions">
            <button class="cta-primary" @click="showBooking = true">Đặt lịch lái thử</button>
            <button class="cta-ghost">Báo giá chính thức</button>
          </div>
        </div>
      </div>

      <!-- Specs -->
      <div class="detail-body">
        <div class="specs-card">
          <h2 class="section-title">Thông số kỹ thuật</h2>
          <table class="specs-table">
            <tbody>
              <tr v-for="s in specs" :key="s.key">
                <th>{{ s.key }}</th>
                <td>{{ car[s.field] }}</td>
              </tr>
              <tr>
                <th>Giá bán</th>
                <td class="price-cell">{{ formatPrice(car.price) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="info-cards">
          <div class="info-tile">
            <span class="tile-icon">🔧</span>
            <h3>Bảo dưỡng chính hãng</h3>
            <p>Lịch bảo dưỡng định kỳ 5.000 km / 6 tháng, sử dụng phụ tùng chính hãng Honda.</p>
          </div>
          <div class="info-tile">
            <span class="tile-icon">🛡️</span>
            <h3>Bảo hành</h3>
            <p>Bảo hành chính hãng 3 năm hoặc 100.000 km, áp dụng toàn quốc.</p>
          </div>
          <div class="info-tile">
            <span class="tile-icon">💳</span>
            <h3>Hỗ trợ trả góp</h3>
            <p>Từ 80% giá trị xe, lãi suất ưu đãi, thủ tục nhanh chóng trong 24h.</p>
          </div>
          <div class="info-tile">
            <span class="tile-icon">🚗</span>
            <h3>Lái thử miễn phí</h3>
            <p>Đặt lịch lái thử tại showroom, chúng tôi hỗ trợ giao xe tận nhà.</p>
          </div>
        </div>
      </div>

      <!-- Back -->
      <div class="detail-back">
        <button class="cta-ghost" @click="router.back()">← Quay lại</button>
      </div>
    </template>
  </section>

  <BookingDialog v-model="showBooking" :car="car" />
</template>

<style scoped>
.state-msg {
  color: var(--subtle);
  font-size: 16px;
}

.state-msg.error {
  color: var(--danger);
}

/* ---- BREADCRUMB ---- */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--subtle);
}

.breadcrumb a {
  color: var(--subtle);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb a:hover {
  color: var(--text);
}

.sep {
  color: rgba(127, 162, 214, 0.4);
}

/* ---- HERO ---- */
.detail-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
  padding: 32px;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(24, 34, 50, 0.9), rgba(9, 13, 19, 0.55));
  border: 1px solid var(--border);
  box-shadow: 0 20px 50px rgba(4, 8, 14, 0.5);
}

.gallery-main {
  width: 100%;
  border-radius: 16px;
  object-fit: cover;
  display: block;
  border: 1px solid rgba(127, 162, 214, 0.14);
}

.detail-eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--subtle);
}

.detail-name {
  margin: 0 0 8px;
  font-size: 36px;
  line-height: 1.1;
}

.detail-version-badge {
  display: inline-block;
  margin: 0 0 16px;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(31, 111, 235, 0.18);
  border: 1px solid rgba(31, 111, 235, 0.4);
  font-size: 12px;
  letter-spacing: 0.1em;
  color: #93c5fd;
}

.detail-description {
  margin: 0 0 24px;
  font-size: 15px;
  color: var(--muted);
  line-height: 1.7;
}

.detail-price-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 24px;
  padding: 16px 20px;
  border-radius: 14px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  background: rgba(0, 212, 255, 0.06);
}

.price-label {
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--subtle);
}

.price-value {
  font-size: 30px;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
}

.detail-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.cta-primary {
  padding: 12px 24px;
  border-radius: 999px;
  border: none;
  background: #1f6feb;
  color: #fff;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.2s;
}

.cta-primary:hover {
  opacity: 0.85;
}

.cta-ghost {
  padding: 12px 24px;
  border-radius: 999px;
  border: 1px solid rgba(127, 162, 214, 0.4);
  background: transparent;
  color: #e9f1ff;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.2s;
}

.cta-ghost:hover {
  border-color: #e9f1ff;
}

/* ---- BODY ---- */
.detail-body {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  align-items: start;
}

/* ---- SPECS ---- */
.specs-card {
  padding: 28px 24px;
  border-radius: 18px;
  background: rgba(12, 18, 26, 0.7);
  border: 1px solid rgba(127, 162, 214, 0.18);
}

.section-title {
  margin: 0 0 18px;
  font-size: 14px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #7fa2d6;
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
}

.specs-table th,
.specs-table td {
  padding: 10px 0;
  font-size: 14px;
  border-bottom: 1px solid rgba(127, 162, 214, 0.1);
  text-align: left;
}

.specs-table th {
  color: #7fa2d6;
  font-weight: 400;
  width: 45%;
}

.specs-table td {
  color: #e9f1ff;
  font-weight: 600;
}

.specs-table tr:last-child th,
.specs-table tr:last-child td {
  border-bottom: none;
}

.price-cell {
  color: #00d4ff !important;
}

/* ---- INFO TILES ---- */
.info-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-tile {
  padding: 22px 20px;
  border-radius: 16px;
  background: rgba(12, 18, 26, 0.7);
  border: 1px solid rgba(127, 162, 214, 0.18);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tile-icon {
  font-size: 22px;
}

.info-tile h3 {
  margin: 0;
  font-size: 15px;
}

.info-tile p {
  margin: 0;
  font-size: 13px;
  color: #c2d1ea;
  line-height: 1.6;
}

/* ---- BACK ---- */
.detail-back {
  display: flex;
}

/* ---- GALLERY TABS ---- */
.gallery-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.gallery-tab {
  padding: 7px 16px;
  border-radius: 999px;
  border: 1px solid rgba(127, 162, 214, 0.25);
  background: transparent;
  color: #7fa2d6;
  font-size: 13px;
  letter-spacing: 0.06em;
  cursor: pointer;
  font-family: inherit;
  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.gallery-tab.active {
  background: rgba(31, 111, 235, 0.18);
  border-color: rgba(31, 111, 235, 0.7);
  color: #e9f1ff;
}

.gallery-tab:not(.active):hover {
  border-color: rgba(127, 162, 214, 0.5);
  color: #c2d1ea;
}

/* ---- RESPONSIVE ---- */
@media (max-width: 900px) {
  .detail-hero {
    grid-template-columns: 1fr;
  }

  .detail-body {
    grid-template-columns: 1fr;
  }

  .info-cards {
    grid-template-columns: 1fr;
  }
}
</style>
