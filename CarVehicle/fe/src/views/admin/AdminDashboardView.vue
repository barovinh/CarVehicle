<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { clearAdminCredentials } from '../../services/adminAuth'
import { adminDelete, adminGet, adminPost, adminPut } from '../../services/adminApi'

const router = useRouter()

const tabs = [
  { key: 'cars', label: 'Sản phẩm' },
  { key: 'events', label: 'Sự kiện' },
  { key: 'featured', label: 'Sản phẩm nổi bật' },
]

const activeTab = ref('cars')

const loading = ref(false)
const error = ref('')

const cars = ref([])
const events = ref([])
const featured = ref([])

function logout() {
  clearAdminCredentials()
  router.replace('/quanly/login')
}

function jsonParse(value, fallback) {
  if (value === '' || value === null || value === undefined) return fallback
  try {
    return JSON.parse(value)
  } catch {
    throw new Error('JSON không hợp lệ')
  }
}

function toJsonString(value) {
  if (value === null || value === undefined) return ''
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return ''
  }
}

async function refreshAll() {
  loading.value = true
  error.value = ''
  try {
    const [carsRes, eventsRes, featuredRes] = await Promise.all([
      adminGet('/api/admin/cars'),
      adminGet('/api/admin/events'),
      adminGet('/api/admin/featured-products'),
    ])
    cars.value = Array.isArray(carsRes.items) ? carsRes.items : []
    events.value = Array.isArray(eventsRes.items) ? eventsRes.items : []
    featured.value = Array.isArray(featuredRes.items) ? featuredRes.items : []
  } catch (e) {
    error.value = e?.message || 'Không tải được dữ liệu'
    if (e?.status === 401) logout()
  } finally {
    loading.value = false
  }
}

onMounted(refreshAll)

// Cars form
const carFormMode = ref('create')
const carForm = ref({
  id: '',
  brand: 'Honda',
  model: '',
  version: '',
  price: 0,
  image: '',
  description: '',
  interiorImagesText: '',
  hoodImage: '',
  trunkImage: '',
})

function resetCarForm() {
  carFormMode.value = 'create'
  carForm.value = {
    id: '',
    brand: 'Honda',
    model: '',
    version: '',
    price: 0,
    image: '',
    description: '',
    interiorImagesText: '',
    hoodImage: '',
    trunkImage: '',
  }
}

function editCar(item) {
  carFormMode.value = 'edit'
  carForm.value = {
    id: item.id,
    brand: item.brand ?? '',
    model: item.model ?? '',
    version: item.version ?? '',
    price: Number(item.price ?? 0),
    image: item.image ?? '',
    description: item.description ?? '',
    interiorImagesText: toJsonString(item.interiorImages ?? null),
    hoodImage: item.hoodImage ?? '',
    trunkImage: item.trunkImage ?? '',
  }
}

async function submitCar() {
  error.value = ''
  try {
    const payload = {
      ...(carFormMode.value === 'create' ? { id: carForm.value.id.trim() } : {}),
      brand: carForm.value.brand.trim(),
      model: carForm.value.model.trim(),
      version: carForm.value.version.trim(),
      price: Number(carForm.value.price || 0),
      image: carForm.value.image.trim(),
      description: carForm.value.description,
      interiorImages: jsonParse(carForm.value.interiorImagesText, null),
      hoodImage: carForm.value.hoodImage.trim() || null,
      trunkImage: carForm.value.trunkImage.trim() || null,
    }

    if (carFormMode.value === 'create') {
      await adminPost('/api/admin/cars', payload)
    } else {
      await adminPut(`/api/admin/cars/${encodeURIComponent(carForm.value.id)}`, payload)
    }

    await refreshAll()
    resetCarForm()
  } catch (e) {
    error.value = e?.message || 'Lưu sản phẩm thất bại'
  }
}

async function deleteCar(id) {
  if (!confirm('Xoá sản phẩm này?')) return
  try {
    await adminDelete(`/api/admin/cars/${encodeURIComponent(id)}`)
    await refreshAll()
    if (carFormMode.value === 'edit' && carForm.value.id === id) resetCarForm()
  } catch (e) {
    error.value = e?.message || 'Xoá thất bại'
  }
}

const carIdOptions = computed(() => cars.value.map((c) => ({ id: c.id, label: `${c.brand} ${c.model} ${c.version}` })))

// Events form
const eventFormMode = ref('create')
const eventForm = ref({
  id: '',
  title: '',
  summary: '',
  startAt: '',
  endAt: '',
  location: '',
  highlight: '',
  coverText: '',
  seoText: '',
  bodyText: '',
  ctaText: '',
})

function resetEventForm() {
  eventFormMode.value = 'create'
  eventForm.value = {
    id: '',
    title: '',
    summary: '',
    startAt: '',
    endAt: '',
    location: '',
    highlight: '',
    coverText: '',
    seoText: '',
    bodyText: '',
    ctaText: '',
  }
}

function editEvent(item) {
  eventFormMode.value = 'edit'
  eventForm.value = {
    id: item.id,
    title: item.title ?? '',
    summary: item.summary ?? '',
    startAt: item.startAt ?? '',
    endAt: item.endAt ?? '',
    location: item.location ?? '',
    highlight: item.highlight ?? '',
    coverText: toJsonString(item.cover ?? null),
    seoText: toJsonString(item.seo ?? null),
    bodyText: toJsonString(item.body ?? null),
    ctaText: toJsonString(item.cta ?? null),
  }
}

async function submitEvent() {
  error.value = ''
  try {
    const payload = {
      ...(eventFormMode.value === 'create' ? { id: eventForm.value.id.trim() } : {}),
      title: eventForm.value.title.trim(),
      summary: eventForm.value.summary,
      startAt: eventForm.value.startAt,
      endAt: eventForm.value.endAt || null,
      location: eventForm.value.location.trim() || null,
      highlight: eventForm.value.highlight || null,
      cover: jsonParse(eventForm.value.coverText, null),
      seo: jsonParse(eventForm.value.seoText, null),
      body: jsonParse(eventForm.value.bodyText, null),
      cta: jsonParse(eventForm.value.ctaText, null),
    }

    if (eventFormMode.value === 'create') {
      await adminPost('/api/admin/events', payload)
    } else {
      await adminPut(`/api/admin/events/${encodeURIComponent(eventForm.value.id)}`, payload)
    }

    await refreshAll()
    resetEventForm()
  } catch (e) {
    error.value = e?.message || 'Lưu sự kiện thất bại'
  }
}

async function deleteEvent(id) {
  if (!confirm('Xoá sự kiện này?')) return
  try {
    await adminDelete(`/api/admin/events/${encodeURIComponent(id)}`)
    await refreshAll()
    if (eventFormMode.value === 'edit' && eventForm.value.id === id) resetEventForm()
  } catch (e) {
    error.value = e?.message || 'Xoá thất bại'
  }
}

// Featured form
const featuredFormMode = ref('create')
const featuredForm = ref({
  id: null,
  carId: '',
  position: 0,
  isActive: true,
  startsAt: '',
  endsAt: '',
})

function resetFeaturedForm() {
  featuredFormMode.value = 'create'
  featuredForm.value = { id: null, carId: '', position: 0, isActive: true, startsAt: '', endsAt: '' }
}

function editFeatured(item) {
  featuredFormMode.value = 'edit'
  featuredForm.value = {
    id: item.id,
    carId: item.carId,
    position: Number(item.position ?? 0),
    isActive: Boolean(item.isActive),
    startsAt: item.startsAt ?? '',
    endsAt: item.endsAt ?? '',
  }
}

async function submitFeatured() {
  error.value = ''
  try {
    const payload = {
      carId: featuredForm.value.carId,
      position: Number(featuredForm.value.position || 0),
      isActive: Boolean(featuredForm.value.isActive),
      startsAt: featuredForm.value.startsAt || null,
      endsAt: featuredForm.value.endsAt || null,
    }

    if (featuredFormMode.value === 'create') {
      await adminPost('/api/admin/featured-products', payload)
    } else {
      await adminPut(`/api/admin/featured-products/${featuredForm.value.id}`, payload)
    }

    await refreshAll()
    resetFeaturedForm()
  } catch (e) {
    error.value = e?.message || 'Lưu nổi bật thất bại'
  }
}

async function deleteFeatured(id) {
  if (!confirm('Xoá mục nổi bật này?')) return
  try {
    await adminDelete(`/api/admin/featured-products/${id}`)
    await refreshAll()
    if (featuredFormMode.value === 'edit' && featuredForm.value.id === id) resetFeaturedForm()
  } catch (e) {
    error.value = e?.message || 'Xoá thất bại'
  }
}
</script>

<template>
  <section class="admin-page">
    <header class="topbar">
      <div>
        <h1 class="title">Trang quản lý</h1>
        <p class="subtitle">Quản lý sản phẩm, sự kiện và danh sách nổi bật.</p>
      </div>
      <button class="btn-ghost" @click="logout">Đăng xuất</button>
    </header>

    <nav class="tabs">
      <button
        v-for="t in tabs"
        :key="t.key"
        class="tab"
        :class="{ active: activeTab === t.key }"
        @click="activeTab = t.key"
      >
        {{ t.label }}
      </button>
    </nav>

    <p v-if="loading" class="state">Đang tải dữ liệu...</p>
    <p v-else-if="error" class="state error">{{ error }}</p>

    <!-- Cars -->
    <div v-if="!loading && activeTab === 'cars'" class="grid">
      <div class="panel">
        <h2 class="panel-title">Danh sách sản phẩm</h2>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Model</th>
                <th>Version</th>
                <th>Giá</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in cars" :key="c.id">
                <td class="mono">{{ c.id }}</td>
                <td>{{ c.model }}</td>
                <td>{{ c.version }}</td>
                <td>{{ new Intl.NumberFormat('vi-VN').format(c.price) }} đ</td>
                <td class="actions">
                  <button class="btn-mini" @click="editCar(c)">Sửa</button>
                  <button class="btn-mini danger" @click="deleteCar(c.id)">Xoá</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <h2 class="panel-title">{{ carFormMode === 'create' ? 'Thêm sản phẩm' : 'Cập nhật sản phẩm' }}</h2>
          <button class="btn-mini" @click="resetCarForm">Làm mới</button>
        </div>

        <form class="form" @submit.prevent="submitCar">
          <label class="field">
            <span class="label">ID (slug)</span>
            <input v-model="carForm.id" class="input" :disabled="carFormMode !== 'create'" placeholder="city-rs" />
          </label>

          <div class="row">
            <label class="field">
              <span class="label">Hãng</span>
              <input v-model="carForm.brand" class="input" />
            </label>
            <label class="field">
              <span class="label">Model</span>
              <input v-model="carForm.model" class="input" />
            </label>
          </div>

          <div class="row">
            <label class="field">
              <span class="label">Phiên bản</span>
              <input v-model="carForm.version" class="input" />
            </label>
            <label class="field">
              <span class="label">Giá</span>
              <input v-model.number="carForm.price" class="input" type="number" min="0" />
            </label>
          </div>

          <label class="field">
            <span class="label">Ảnh (URL)</span>
            <input v-model="carForm.image" class="input" />
          </label>

          <label class="field">
            <span class="label">Mô tả</span>
            <textarea v-model="carForm.description" class="textarea" rows="3"></textarea>
          </label>

          <label class="field">
            <span class="label">interiorImages (JSON array)</span>
            <textarea v-model="carForm.interiorImagesText" class="textarea" rows="4" placeholder='["url1","url2"]'></textarea>
          </label>

          <label class="field">
            <span class="label">hoodImage (URL)</span>
            <input v-model="carForm.hoodImage" class="input" />
          </label>

          <label class="field">
            <span class="label">trunkImage (URL)</span>
            <input v-model="carForm.trunkImage" class="input" />
          </label>

          <button class="btn" type="submit">Lưu</button>
        </form>
      </div>
    </div>

    <!-- Events -->
    <div v-if="!loading && activeTab === 'events'" class="grid">
      <div class="panel">
        <h2 class="panel-title">Danh sách sự kiện</h2>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tiêu đề</th>
                <th>Ngày</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ev in events" :key="ev.id">
                <td class="mono">{{ ev.id }}</td>
                <td>{{ ev.title }}</td>
                <td>{{ ev.startAt ? ev.startAt.slice(0, 10) : '' }}</td>
                <td class="actions">
                  <button class="btn-mini" @click="editEvent(ev)">Sửa</button>
                  <button class="btn-mini danger" @click="deleteEvent(ev.id)">Xoá</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <h2 class="panel-title">{{ eventFormMode === 'create' ? 'Thêm sự kiện' : 'Cập nhật sự kiện' }}</h2>
          <button class="btn-mini" @click="resetEventForm">Làm mới</button>
        </div>

        <form class="form" @submit.prevent="submitEvent">
          <label class="field">
            <span class="label">ID (slug)</span>
            <input v-model="eventForm.id" class="input" :disabled="eventFormMode !== 'create'" placeholder="launch-march-2026-city" />
          </label>

          <label class="field">
            <span class="label">Tiêu đề</span>
            <input v-model="eventForm.title" class="input" />
          </label>

          <label class="field">
            <span class="label">Tóm tắt</span>
            <textarea v-model="eventForm.summary" class="textarea" rows="3"></textarea>
          </label>

          <div class="row">
            <label class="field">
              <span class="label">startAt (ISO)</span>
              <input v-model="eventForm.startAt" class="input" placeholder="2026-03-20T08:30:00+07:00" />
            </label>
            <label class="field">
              <span class="label">endAt (ISO, optional)</span>
              <input v-model="eventForm.endAt" class="input" placeholder="2026-03-20T17:30:00+07:00" />
            </label>
          </div>

          <label class="field">
            <span class="label">Địa điểm</span>
            <input v-model="eventForm.location" class="input" />
          </label>

          <label class="field">
            <span class="label">Highlight</span>
            <textarea v-model="eventForm.highlight" class="textarea" rows="2"></textarea>
          </label>

          <label class="field">
            <span class="label">cover (JSON)</span>
            <textarea v-model="eventForm.coverText" class="textarea" rows="3" placeholder='{"src":"/images/event-cover.svg","alt":"..."}'></textarea>
          </label>

          <label class="field">
            <span class="label">seo (JSON)</span>
            <textarea v-model="eventForm.seoText" class="textarea" rows="3" placeholder='{"title":"...","description":"..."}'></textarea>
          </label>

          <label class="field">
            <span class="label">body (JSON array)</span>
            <textarea v-model="eventForm.bodyText" class="textarea" rows="6"></textarea>
          </label>

          <label class="field">
            <span class="label">cta (JSON)</span>
            <textarea v-model="eventForm.ctaText" class="textarea" rows="2" placeholder='{"label":"...","to":"/ds-san-pham"}'></textarea>
          </label>

          <button class="btn" type="submit">Lưu</button>
        </form>
      </div>
    </div>

    <!-- Featured -->
    <div v-if="!loading && activeTab === 'featured'" class="grid">
      <div class="panel">
        <h2 class="panel-title">Danh sách nổi bật</h2>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Vị trí</th>
                <th>Xe</th>
                <th>Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in featured" :key="f.id">
                <td>{{ f.position }}</td>
                <td>{{ f.car ? `${f.car.brand} ${f.car.model} ${f.car.version}` : f.carId }}</td>
                <td>{{ f.isActive ? 'Yes' : 'No' }}</td>
                <td class="actions">
                  <button class="btn-mini" @click="editFeatured(f)">Sửa</button>
                  <button class="btn-mini danger" @click="deleteFeatured(f.id)">Xoá</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <h2 class="panel-title">{{ featuredFormMode === 'create' ? 'Thêm nổi bật' : 'Cập nhật nổi bật' }}</h2>
          <button class="btn-mini" @click="resetFeaturedForm">Làm mới</button>
        </div>

        <form class="form" @submit.prevent="submitFeatured">
          <label class="field">
            <span class="label">Chọn xe</span>
            <select v-model="featuredForm.carId" class="input">
              <option value="" disabled>-- chọn --</option>
              <option v-for="c in carIdOptions" :key="c.id" :value="c.id">{{ c.label }}</option>
            </select>
          </label>

          <div class="row">
            <label class="field">
              <span class="label">Vị trí</span>
              <input v-model.number="featuredForm.position" class="input" type="number" min="0" />
            </label>
            <label class="field checkbox">
              <span class="label">Kích hoạt</span>
              <input v-model="featuredForm.isActive" type="checkbox" />
            </label>
          </div>

          <div class="row">
            <label class="field">
              <span class="label">startsAt (ISO, optional)</span>
              <input v-model="featuredForm.startsAt" class="input" placeholder="2026-03-20T00:00:00+07:00" />
            </label>
            <label class="field">
              <span class="label">endsAt (ISO, optional)</span>
              <input v-model="featuredForm.endsAt" class="input" placeholder="2026-04-01T00:00:00+07:00" />
            </label>
          </div>

          <button class="btn" type="submit">Lưu</button>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.admin-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 16px 28px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--border);
  background: var(--panel);
  border-radius: 16px;
}

.title {
  margin: 0;
  font-size: 22px;
  color: var(--text);
}

.subtitle {
  margin: 6px 0 0;
  color: var(--muted);
}

.tabs {
  display: flex;
  gap: 8px;
  margin: 14px 0;
}

.tab {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
}

.tab.active {
  border-color: rgba(31, 111, 235, 0.55);
  background: rgba(31, 111, 235, 0.15);
}

.state {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--panel);
  color: var(--muted);
}

.state.error {
  color: var(--danger);
  background: rgba(255, 78, 78, 0.08);
  border-color: rgba(255, 78, 78, 0.25);
}

.grid {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 12px;
}

@media (max-width: 980px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.panel {
  border: 1px solid var(--border);
  background: var(--panel);
  border-radius: 16px;
  padding: 14px;
  overflow: hidden;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.panel-title {
  margin: 0 0 12px;
  font-size: 16px;
  color: var(--text);
}

.table-wrap {
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: 12px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  min-width: 520px;
  background: var(--surface);
}

.table th,
.table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
  text-align: left;
  vertical-align: top;
}

.table th {
  color: var(--muted);
  font-size: 13px;
  background: rgba(127, 162, 214, 0.10);
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 12px;
}

.form {
  display: grid;
  gap: 10px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

@media (max-width: 560px) {
  .row {
    grid-template-columns: 1fr;
  }
}

.field {
  display: grid;
  gap: 6px;
}

.field.checkbox {
  align-content: center;
}

.label {
  font-size: 13px;
  color: var(--muted);
}

.input,
.textarea,
select.input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  outline: none;
}

.textarea {
  resize: vertical;
}

.btn {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: linear-gradient(90deg, var(--primary), var(--primary-2));
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.btn-mini {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
}

.btn-mini.danger {
  border-color: rgba(255, 78, 78, 0.35);
  color: var(--danger);
}

.btn-ghost {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  cursor: pointer;
}
</style>
