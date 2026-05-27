<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { fetchEventById } from '../services/eventsApi'

const route = useRoute()

const loading = ref(true)
const hasError = ref(false)
const item = ref(null)

const eventId = computed(() => String(route.params.id || ''))

function upsertMeta(name, content) {
  if (!content) return
  let meta = document.head.querySelector(`meta[name="${name}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', name)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

function applySeo(ev) {
  const title = ev?.seo?.title || ev?.title
  if (title) document.title = `${title} | CarVehicle`

  const description = ev?.seo?.description || ev?.summary
  if (description) upsertMeta('description', description)
}

function formatDateRange(startAt, endAt) {
  if (!startAt) return ''
  const start = new Date(startAt)
  const end = endAt ? new Date(endAt) : null

  const dateFmt = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const timeFmt = new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' })

  if (!end) return `${dateFmt.format(start)} • ${timeFmt.format(start)}`

  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()

  if (sameDay) {
    return `${dateFmt.format(start)} • ${timeFmt.format(start)}–${timeFmt.format(end)}`
  }

  return `${dateFmt.format(start)} ${timeFmt.format(start)} → ${dateFmt.format(end)} ${timeFmt.format(end)}`
}

async function load(id) {
  loading.value = true
  hasError.value = false
  item.value = null

  try {
    const data = await fetchEventById(id)
    item.value = data?.item || null
    applySeo(item.value)
  } catch {
    hasError.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => load(eventId.value))
watch(eventId, (id) => load(id))
</script>

<template>
  <section class="page">
    <header class="page-hero hero">
      <div class="hero-top">
        <RouterLink class="back" to="/su-kien">{{ $t('eventDetail.back') }}</RouterLink>
        <p v-if="item?.startAt" class="hero-meta">{{ formatDateRange(item.startAt, item.endAt) }}</p>
      </div>

      <h1 class="hero-title">{{ item?.title || $t('eventDetail.title') }}</h1>
      <p v-if="item?.location" class="hero-location">{{ item.location }}</p>
      <p v-if="item?.summary" class="lead">{{ item.summary }}</p>

      <div v-if="item?.cover?.src" class="hero-cover">
        <img class="cover-img" :src="item.cover.src" :alt="item.cover.alt || item.title" loading="lazy" />
      </div>
    </header>

    <p v-if="loading" class="state-msg">{{ $t('eventDetail.states.loading') }}</p>
    <p v-else-if="hasError" class="state-msg error">{{ $t('eventDetail.states.error') }}</p>

    <article v-else-if="item" class="card content">
      <template v-for="(block, idx) in item.body || []" :key="idx">
        <h2 v-if="block.type === 'heading'" class="body-h2">{{ block.text }}</h2>

        <p v-else-if="block.type === 'paragraph'" class="body-text">{{ block.text }}</p>

        <ul v-else-if="block.type === 'bullets'" class="body-list">
          <li v-for="(li, liIdx) in block.items" :key="liIdx">{{ li }}</li>
        </ul>

        <figure v-else-if="block.type === 'image'" class="body-figure">
          <img class="body-img" :src="block.src" :alt="block.alt || item.title" loading="lazy" />
          <figcaption v-if="block.caption" class="body-caption">{{ block.caption }}</figcaption>
        </figure>

        <div v-else-if="block.type === 'links'" class="body-links">
          <h3 class="links-title">{{ block.title || $t('eventDetail.linksTitle') }}</h3>
          <div class="links-grid">
            <template v-for="(lnk, lnkIdx) in block.items" :key="lnkIdx">
              <RouterLink v-if="lnk.to" class="link-chip" :to="lnk.to">
                {{ lnk.label }}
              </RouterLink>
              <a v-else class="link-chip" :href="lnk.href" target="_blank" rel="noopener noreferrer">
                {{ lnk.label }}
              </a>
            </template>
          </div>
        </div>
      </template>

      <div v-if="item.cta?.to" class="footer-cta">
        <RouterLink class="btn primary" :to="item.cta.to">{{ item.cta.label }}</RouterLink>
      </div>
    </article>
  </section>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.hero-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.back {
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid var(--border-2);
  color: var(--text);
  background: var(--panel-2);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition: all 0.2s ease;
}

.back:hover {
  background: var(--primary);
  color: var(--primary-contrast);
  border-color: var(--primary);
}

.hero-meta {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--subtle);
}

.hero-title {
  margin: 0;
  font-size: 34px;
  letter-spacing: 0.02em;
}

.hero-location {
  margin: 0;
  color: var(--muted);
}

.hero-cover {
  margin-top: 10px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--panel);
}

.cover-img {
  width: 100%;
  max-height: 360px;
  object-fit: cover;
  display: block;
}

.state-msg {
  color: var(--subtle);
  font-size: 16px;
}

.state-msg.error {
  color: var(--danger);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.body-h2 {
  margin: 8px 0 0;
  font-size: 20px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.body-text {
  margin: 0;
  color: var(--muted);
  line-height: 1.85;
  font-size: 16px;
}

.body-list {
  margin: 0;
  padding-left: 18px;
  color: var(--muted);
  line-height: 1.8;
}

.body-figure {
  margin: 8px 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.body-img {
  width: 100%;
  border-radius: 16px;
  border: 1px solid var(--border);
  display: block;
}

.body-caption {
  margin: 0;
  font-size: 13px;
  color: rgba(127, 162, 214, 0.85);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.body-links {
  margin-top: 6px;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  background: rgba(0, 212, 255, 0.06);
}

.links-title {
  margin: 0 0 10px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.links-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.link-chip {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid var(--border-3);
  color: var(--text);
  text-decoration: none;
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: all 0.2s ease;
}

.link-chip:hover {
  background: var(--primary);
  color: var(--primary-contrast);
  border-color: var(--primary);
}

.footer-cta {
  margin-top: 6px;
  display: flex;
  justify-content: flex-start;
}
</style>
