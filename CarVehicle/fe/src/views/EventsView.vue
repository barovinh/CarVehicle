<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { fetchEvents } from '../services/eventsApi'

const items = ref([])
const updatedAt = ref('')
const loading = ref(true)
const hasError = ref(false)

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

async function load() {
  loading.value = true
  hasError.value = false

  try {
    const data = await fetchEvents()
    items.value = Array.isArray(data.items) ? data.items : []
    updatedAt.value = data.updatedAt || ''
  } catch {
    hasError.value = true
  } finally {
    loading.value = false
  }
}

function onVisibilityChange() {
  if (document.visibilityState === 'visible') load()
}

let pollTimer = null

onMounted(async () => {
  await load()

  document.addEventListener('visibilitychange', onVisibilityChange)

  const pollMs = Number(import.meta.env.VITE_EVENTS_POLL_MS || 0)
  if (Number.isFinite(pollMs) && pollMs > 0) {
    pollTimer = window.setInterval(load, pollMs)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange)
  if (pollTimer) window.clearInterval(pollTimer)
})
</script>

<template>
  <section class="page">
    <header class="page-hero">
      <p class="eyebrow">{{ $t('events.eyebrow') }}</p>
      <h1>{{ $t('events.title') }}</h1>
      <p class="lead">{{ $t('events.lead') }}</p>
      <p v-if="updatedAt" class="updated">{{ $t('events.updatedAt') }}: {{ updatedAt }}</p>
    </header>

    <p v-if="loading" class="state-msg">{{ $t('events.states.loading') }}</p>
    <p v-else-if="hasError" class="state-msg error">{{ $t('events.states.error') }}</p>
    <p v-else-if="!items.length" class="state-msg">{{ $t('events.states.empty') }}</p>

    <div v-else class="page-grid">
      <article v-for="ev in items" :key="ev.id" class="card event-card">
        <p class="event-meta">{{ formatDateRange(ev.startAt, ev.endAt) }}</p>
        <h2 class="event-title">
          <RouterLink class="event-title-link" :to="{ name: 'event-detail', params: { id: ev.id } }">
            {{ ev.title }}
          </RouterLink>
        </h2>
        <p v-if="ev.location" class="event-location">{{ ev.location }}</p>
        <p class="event-summary">{{ ev.summary }}</p>
        <p v-if="ev.highlight" class="event-highlight">{{ ev.highlight }}</p>
        <div class="event-actions">
          <RouterLink class="event-cta" :to="{ name: 'event-detail', params: { id: ev.id } }">
            {{ $t('events.cta.default') }}
          </RouterLink>

          <RouterLink v-if="ev.cta?.to" class="event-cta secondary" :to="ev.cta.to">
            {{ ev.cta.label || $t('events.cta.default') }}
          </RouterLink>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.state-msg {
  color: var(--subtle);
  font-size: 16px;
}

.state-msg.error {
  color: var(--danger);
}

.updated {
  margin: 14px 0 0;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(127, 162, 214, 0.85);
}

.event-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.event-meta {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--subtle);
}

.event-title {
  margin: 0;
  font-size: 20px;
  letter-spacing: 0.02em;
}

.event-title-link {
  color: inherit;
  text-decoration: none;
}

.event-title-link:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.event-location {
  margin: 0;
  font-size: 14px;
  color: var(--muted);
}

.event-summary {
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}

.event-highlight {
  margin: 0;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  background: rgba(0, 212, 255, 0.06);
  color: var(--text);
  line-height: 1.6;
}

.event-cta {
  margin-top: 6px;
  align-self: flex-start;
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid rgba(127, 162, 214, 0.45);
  color: #e9f1ff;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition: all 0.2s ease;
}

.event-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
}

.event-cta.secondary {
  background: rgba(15, 20, 27, 0.7);
}

.event-cta:hover {
  background: var(--primary);
  color: var(--primary-contrast);
  border-color: var(--primary);
}
</style>
