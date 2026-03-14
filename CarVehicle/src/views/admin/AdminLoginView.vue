<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { setAdminCredentials } from '../../services/adminAuth'

const router = useRouter()

const username = ref('admin_giabao')
const password = ref('')
const loading = ref(false)
const error = ref('')

const canSubmit = computed(() => username.value.trim() && password.value.trim() && !loading.value)

async function onSubmit() {
  if (!canSubmit.value) return

  loading.value = true
  error.value = ''

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value.trim(),
        password: password.value,
      }),
    })

    if (!res.ok) {
      const payload = await res.json().catch(() => null)
      throw new Error(payload?.error || 'Sai tài khoản hoặc mật khẩu')
    }

    setAdminCredentials(username.value.trim(), password.value)
    router.replace('/quanly')
  } catch (e) {
    error.value = e?.message || 'Đăng nhập thất bại'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="admin-page">
    <div class="login-card">
      <h1 class="title">Đăng nhập quản lý</h1>
      <p class="subtitle">Nhập tài khoản quản trị để truy cập trang quản lý.</p>

      <form class="form" @submit.prevent="onSubmit">
        <label class="field">
          <span class="label">Tài khoản</span>
          <input v-model="username" class="input" autocomplete="username" />
        </label>

        <label class="field">
          <span class="label">Mật khẩu</span>
          <input v-model="password" class="input" type="password" autocomplete="current-password" />
        </label>

        <p v-if="error" class="error">{{ error }}</p>

        <button class="btn" type="submit" :disabled="!canSubmit">
          {{ loading ? 'Đang kiểm tra...' : 'Đăng nhập' }}
        </button>
      </form>

      <p class="hint">URL: <strong>/quanly</strong></p>
    </div>
  </section>
</template>

<style scoped>
.admin-page {
  min-height: calc(100vh - 120px);
  display: grid;
  place-items: center;
  padding: 24px 16px;
}

.login-card {
  width: min(520px, 100%);
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px;
}

.title {
  margin: 0;
  font-size: 22px;
  color: var(--text);
}

.subtitle {
  margin: 8px 0 16px;
  color: var(--muted);
  line-height: 1.5;
}

.form {
  display: grid;
  gap: 12px;
}

.field {
  display: grid;
  gap: 6px;
}

.label {
  font-size: 13px;
  color: var(--muted);
}

.input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  outline: none;
}

.input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.25);
}

.error {
  margin: 0;
  color: var(--danger);
  background: rgba(255, 78, 78, 0.08);
  border: 1px solid rgba(255, 78, 78, 0.25);
  padding: 10px 12px;
  border-radius: 12px;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.hint {
  margin: 14px 0 0;
  color: var(--muted);
  font-size: 13px;
}
</style>
