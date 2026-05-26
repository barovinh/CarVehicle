<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.replace('/')
}
</script>

<template>
  <section class="notfound-page">
    <div class="card">
      <p class="eyebrow">404</p>
      <h1 class="title">Trang không tìm thấy</h1>
      <p class="subtitle">Đường dẫn này không tồn tại. Bạn có thể quay lại trang chủ để tiếp tục.</p>

      <button class="btn" type="button" @click="goHome">Về trang chủ</button>
    </div>
  </section>
</template>

<style scoped>
.notfound-page {
  min-height: calc(100vh - 120px);
  display: grid;
  place-items: center;
  padding: 24px 16px;
}

.card {
  width: min(560px, 100%);
  padding: 28px;
  border-radius: 24px;
  border: 1px solid var(--border);
  background:
    radial-gradient(circle at top, rgba(31, 111, 235, 0.2), transparent 55%),
    var(--panel);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.22);
  text-align: center;
}

.eyebrow {
  margin: 0 0 10px;
  font-size: 12px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--accent);
}

.title {
  margin: 0;
  font-size: clamp(30px, 5vw, 48px);
  color: var(--text);
}

.subtitle {
  margin: 12px 0 24px;
  color: var(--muted);
  line-height: 1.6;
}

.btn {
  padding: 12px 18px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
</style>