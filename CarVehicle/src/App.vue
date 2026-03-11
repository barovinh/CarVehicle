<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'

const appShellRef = ref(null)
const router = useRouter()
router.afterEach(() => appShellRef.value?.scrollTo({ top: 0, behavior: 'instant' }))
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
        <RouterLink class="nav-link" to="/">/index</RouterLink>
        <RouterLink class="nav-link" to="/ds-san-pham">/ds-san-pham</RouterLink>
        <RouterLink class="nav-link" to="/gioi-thieu">/gioi-thieu</RouterLink>
        <RouterLink class="nav-link" to="/lien-he">/lien-he</RouterLink>
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
  color-scheme: light;
  font-family: 'Rajdhani', 'Segoe UI', sans-serif;
  background: radial-gradient(circle at 10% 10%, #1f2b3a, #0f141b 55%, #090b10);
  color: #e9f1ff;
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
  scrollbar-color: rgba(31, 111, 235, 0.55) rgba(8, 12, 18, 0.5);
}

.app-shell::-webkit-scrollbar {
  width: 6px;
}

.app-shell::-webkit-scrollbar-track {
  background: rgba(8, 12, 18, 0.5);
}

.app-shell::-webkit-scrollbar-thumb {
  background: rgba(31, 111, 235, 0.5);
  border-radius: 3px;
}

.app-shell::-webkit-scrollbar-thumb:hover {
  background: rgba(31, 111, 235, 0.85);
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
  background: rgba(10, 14, 20, 0.82);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(130, 166, 220, 0.2);
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
  background: linear-gradient(135deg, #1f6feb, #00d4ff);
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
  color: #7fa2d6;
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
  color: #e9f1ff;
  border: 1px solid rgba(127, 162, 214, 0.35);
  background: rgba(15, 20, 27, 0.7);
  transition: all 0.2s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: #1f6feb;
  color: #0a0f14;
  border-color: #1f6feb;
}

.app-main {
  flex: 1;
  padding: 36px 60px 30px;
}

.app-footer {
  padding: 20px 40px 30px;
  border-top: 1px solid rgba(127, 162, 214, 0.2);
  background: rgba(10, 14, 20, 0.7);
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
  background: linear-gradient(135deg, rgba(24, 34, 50, 0.9), rgba(9, 13, 19, 0.55));
  border: 1px solid rgba(127, 162, 214, 0.25);
  box-shadow: 0 18px 45px rgba(4, 8, 14, 0.5);
}

:global(.eyebrow) {
  margin: 0 0 10px;
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #7fa2d6;
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
  background: #1f6feb;
  color: #0a0f14;
}

:global(.btn.ghost) {
  border: 1px solid rgba(127, 162, 214, 0.45);
  color: #e9f1ff;
}

:global(.page-grid) {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

:global(.card) {
  padding: 20px;
  border-radius: 18px;
  border: 1px solid rgba(127, 162, 214, 0.18);
  background: rgba(12, 18, 26, 0.7);
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
