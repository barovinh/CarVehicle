<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  car: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue'])

const name = ref('')
const phone = ref('')
const email = ref('')
const submitted = ref(false)
const errors = ref({})

const carLabel = computed(() => {
  if (!props.car) return ''
  return `${props.car.brand} ${props.car.model} – ${props.car.version}`
})

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      setTimeout(() => {
        name.value = ''
        phone.value = ''
        email.value = ''
        errors.value = {}
        submitted.value = false
      }, 300)
    }
  },
)

function close() {
  emit('update:modelValue', false)
}

function validate() {
  const e = {}
  if (!name.value.trim()) e.name = 'Vui lòng nhập họ và tên.'
  if (!phone.value.trim()) e.phone = 'Vui lòng nhập số điện thoại.'
  else if (!/^[0-9]{9,11}$/.test(phone.value.replace(/\s/g, '')))
    e.phone = 'Số điện thoại không hợp lệ.'
  if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
    e.email = 'Email không hợp lệ.'
  return e
}

function handleSubmit() {
  errors.value = validate()
  if (Object.keys(errors.value).length) return
  submitted.value = true
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="modelValue" class="dialog-backdrop" @click.self="close">
        <div class="dialog-box" role="dialog" aria-modal="true">
          <div class="dialog-header">
            <h2 class="dialog-title">Đặt lịch lái thử</h2>
            <button class="dialog-close" @click="close" aria-label="Đóng">&#x2715;</button>
          </div>

          <div v-if="submitted" class="dialog-success">
            <span class="success-icon">✓</span>
            <p>Cảm ơn bạn! Chúng tôi sẽ liên hệ xác nhận lịch lái thử sớm nhất.</p>
            <button class="btn-confirm" @click="close">Đóng</button>
          </div>

          <form v-else class="dialog-form" @submit.prevent="handleSubmit" novalidate>
            <div class="form-group">
              <label class="form-label">Xe chọn lái thử</label>
              <input class="form-input is-readonly" :value="carLabel" readonly />
            </div>

            <div class="form-group">
              <label class="form-label" for="bd-name">
                Họ và tên <span class="required">*</span>
              </label>
              <input
                id="bd-name"
                class="form-input"
                :class="{ 'is-error': errors.name }"
                v-model="name"
                placeholder="Nguyễn Văn A"
                autocomplete="name"
              />
              <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
            </div>

            <div class="form-group">
              <label class="form-label" for="bd-phone">
                Số điện thoại <span class="required">*</span>
              </label>
              <input
                id="bd-phone"
                class="form-input"
                :class="{ 'is-error': errors.phone }"
                v-model="phone"
                placeholder="0900 000 000"
                type="tel"
                autocomplete="tel"
              />
              <p v-if="errors.phone" class="form-error">{{ errors.phone }}</p>
            </div>

            <div class="form-group">
              <label class="form-label" for="bd-email">Email (không bắt buộc)</label>
              <input
                id="bd-email"
                class="form-input"
                :class="{ 'is-error': errors.email }"
                v-model="email"
                placeholder="example@email.com"
                type="email"
                autocomplete="email"
              />
              <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="close">Hủy</button>
              <button type="submit" class="btn-confirm">Xác nhận đặt lịch</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(4, 8, 14, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.dialog-box {
  background: var(--panel);
  border: 1px solid var(--border-2);
  border-radius: 20px;
  box-shadow: 0 30px 80px rgba(4, 8, 14, 0.7);
  padding: 32px;
  width: 100%;
  max-width: 460px;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.dialog-title {
  margin: 0;
  font-size: 20px;
  color: var(--text);
}

.dialog-close {
  background: none;
  border: none;
  color: var(--subtle);
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition:
    color 0.2s,
    background 0.2s;
}

.dialog-close:hover {
  color: var(--text);
  background: rgba(127, 162, 214, 0.12);
}

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  color: var(--muted);
}

.required {
  color: var(--danger);
}

.form-input {
  background: var(--panel-strong);
  border: 1px solid var(--border-2);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  color: var(--text);
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.form-input::placeholder {
  color: rgba(127, 162, 214, 0.5);
}

.form-input:focus {
  border-color: var(--primary);
}

.form-input.is-readonly {
  color: var(--subtle);
  cursor: default;
}

.form-input.is-error {
  border-color: var(--danger);
}

.form-error {
  margin: 0;
  font-size: 12px;
  color: var(--danger);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 6px;
}

.btn-cancel {
  background: transparent;
  border: 1px solid var(--border-2);
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 14px;
  color: var(--muted);
  cursor: pointer;
  font-family: inherit;
  transition:
    border-color 0.2s,
    color 0.2s;
}

.btn-cancel:hover {
  border-color: rgba(127, 162, 214, 0.6);
  color: var(--text);
}

.btn-confirm {
  background: var(--primary);
  border: none;
  border-radius: 10px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
}

.btn-confirm:hover {
  background: #388bfd;
}

/* success state */
.dialog-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px 0 8px;
  text-align: center;
}

.success-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(31, 111, 235, 0.15);
  border: 2px solid var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: var(--accent);
}

.dialog-success p {
  margin: 0;
  color: var(--muted);
  font-size: 15px;
}

/* Transition */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}
</style>
