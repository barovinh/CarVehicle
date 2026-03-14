<script setup>
import { onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'

const appShellRef = ref(null)
const router = useRouter()
router.afterEach(() => appShellRef.value?.scrollTo({ top: 0, behavior: 'instant' }))

const THEME_KEY = 'carvehicle-theme'

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light'
}

const theme = ref('dark')

function applyTheme(nextTheme) {
  document.documentElement.dataset.theme = nextTheme
  document.documentElement.style.colorScheme = nextTheme
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

onMounted(() => {
  theme.value = getInitialTheme()
  applyTheme(theme.value)
})

watch(theme, (next) => {
  localStorage.setItem(THEME_KEY, next)
  applyTheme(next)
})
</script>

<template>
  <div class="app-shell" ref="appShellRef">
    <header class="app-header">
      <div class="brand">
        <span class="brand-mark"></span>
        <div>
          <p class="brand-label">CarVehicle</p>
          <p class="brand-sub">Template layout</p>
        </div>
      </div>
      <nav class="nav">
        <RouterLink class="nav-link" to="/">Trang chủ</RouterLink>
        <RouterLink class="nav-link" to="/ds-san-pham">Sản phẩm</RouterLink>
        <RouterLink class="nav-link" to="/su-kien">Sự kiện</RouterLink>
        <RouterLink class="nav-link" to="/lien-he">Liên hệ</RouterLink>
        <button class="nav-link nav-toggle" type="button" @click="toggleTheme">
          {{ theme === 'dark' ? 'Tối' : 'Sáng' }}
        </button>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>

    <footer class="app-footer">
      <p>CarVehicle 2026 - Layout template.</p>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap');

:global(:root) {
  color-scheme: light dark;
  font-family: 'Rajdhani', 'Segoe UI', sans-serif;

  --app-bg: radial-gradient(circle at 10% 10%, #1f2b3a, #0f141b 55%, #090b10);
  --text: #e9f1ff;
  --muted: #c2d1ea;
  --subtle: #7fa2d6;

  --panel: rgba(12, 18, 26, 0.7);
  --panel-2: rgba(15, 20, 27, 0.7);
  --panel-strong: rgba(15, 22, 32, 0.8);
  --chrome: rgba(10, 14, 20, 0.82);
  --chrome-soft: rgba(10, 14, 20, 0.7);

  --border: rgba(127, 162, 214, 0.18);
  --border-2: rgba(127, 162, 214, 0.35);
  --border-3: rgba(127, 162, 214, 0.45);

  --primary: #1f6feb;
  --primary-contrast: #0a0f14;
  --accent: #00d4ff;
  --danger: #f87171;

  background: var(--app-bg);
  color: var(--text);
}

:global(:root[data-theme='light']) {
  --app-bg: radial-gradient(circle at 10% 10%, #f5f9ff, #e9f1ff 55%, #dbe7f7);
  --text: #0a0f14;
  --muted: rgba(16, 24, 40, 0.78);
  --subtle: rgba(31, 67, 123, 0.75);

  --panel: rgba(255, 255, 255, 0.75);
  --panel-2: rgba(255, 255, 255, 0.65);
  --panel-strong: rgba(255, 255, 255, 0.9);
  --chrome: rgba(255, 255, 255, 0.82);
  --chrome-soft: rgba(255, 255, 255, 0.7);

  --border: rgba(16, 24, 40, 0.12);
  --border-2: rgba(16, 24, 40, 0.18);
  --border-3: rgba(16, 24, 40, 0.24);

  --primary: #1f6feb;
  --primary-contrast: #ffffff;
  --accent: #00b8d9;
}

:global(html),
:global(body) {
  height: 100%;
  overflow: hidden;
  margin: 0;
}

.app-shell {
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-width: thin;
  scrollbar-color: rgba(31, 111, 235, 0.55) transparent;
}

.app-shell::-webkit-scrollbar {
  width: 6px;
}

.app-shell::-webkit-scrollbar-track {
  background: transparent;
}

.app-shell::-webkit-scrollbar-thumb {
  background: rgba(31, 111, 235, 0.45);
  border-radius: 3px;
}

.app-shell::-webkit-scrollbar-thumb:hover {
  background: rgba(31, 111, 235, 0.75);
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 40px;
  background: var(--chrome);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-mark {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  box-shadow: 0 0 0 6px rgba(31, 111, 235, 0.25);
}

.brand-label {
  font-size: 18px;
  margin: 0;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.brand-sub {
  margin: 2px 0 0;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--subtle);
}

.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
  flex: 1 1 420px;
}

.nav-link {
  padding: 6px 12px;
  border-radius: 999px;
  text-decoration: none;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text);
  border: 1px solid var(--border-2);
  background: var(--panel-2);
  transition: all 0.2s ease;
}

.nav-toggle {
  cursor: pointer;
  font-family: inherit;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: var(--primary);
  color: var(--primary-contrast);
  border-color: var(--primary);
}

.app-main {
  flex: 1;
  padding: 36px 60px 30px;
}

.app-footer {
  padding: 20px 40px 30px;
  border-top: 1px solid var(--border);
  background: var(--chrome-soft);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

:global(.page) {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
}

:global(.page-hero) {
  padding: 32px;
  border-radius: 24px;
  background: linear-gradient(135deg, var(--panel), rgba(9, 13, 19, 0.25));
  border: 1px solid var(--border-2);
  box-shadow: 0 18px 45px rgba(4, 8, 14, 0.5);
}

:global(.eyebrow) {
  margin: 0 0 10px;
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--subtle);
}

:global(.lead) {
  font-size: 18px;
  max-width: 520px;
}

:global(.hero-actions) {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

:global(.btn) {
  text-decoration: none;
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

:global(.btn.primary) {
  background: var(--primary);
  color: var(--primary-contrast);
}

:global(.btn.ghost) {
  border: 1px solid var(--border-3);
  color: var(--text);
}

:global(.page-grid) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

:global(.card) {
  padding: 20px;
  border-radius: 18px;
  border: 1px solid var(--border);
  background: var(--panel);
  box-shadow: 0 10px 20px rgba(4, 8, 14, 0.45);
}

@media (max-width: 720px) {
  .app-header,
  .app-main,
  .app-footer {
    padding-left: 20px;
    padding-right: 20px;
  }

  .nav {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 540px) {
  .app-header {
    padding-top: 22px;
    padding-bottom: 22px;
  }

  .nav-link {
    font-size: 12px;
    padding: 6px 10px;
  }
}
</style>
