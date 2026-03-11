<script setup>
import { ref } from 'vue'

const form = ref({ name: '', phone: '', email: '', message: '' })
const submitted = ref(false)

function handleSubmit() {
  submitted.value = true
  form.value = { name: '', phone: '', email: '', message: '' }
}
</script>

<template>
  <section class="page">
    <header class="page-hero">
      <p class="eyebrow">{{ $t('contact.eyebrow') }}</p>
      <h1>{{ $t('contact.title') }}</h1>
      <p class="lead">{{ $t('contact.lead') }}</p>
    </header>

    <div class="contact-layout">
      <!-- FORM -->
      <div class="contact-panel">
        <h2 class="panel-title">{{ $t('contact.form.title') }}</h2>
        <form class="contact-form" @submit.prevent="handleSubmit">
          <div class="field">
            <label>{{ $t('contact.form.name') }}</label>
            <input v-model="form.name" :placeholder="$t('contact.form.namePlaceholder')" required />
          </div>
          <div class="field">
            <label>{{ $t('contact.form.phone') }}</label>
            <input
              v-model="form.phone"
              :placeholder="$t('contact.form.phonePlaceholder')"
              required
            />
          </div>
          <div class="field">
            <label>{{ $t('contact.form.email') }}</label>
            <input
              type="email"
              v-model="form.email"
              :placeholder="$t('contact.form.emailPlaceholder')"
            />
          </div>
          <div class="field">
            <label>{{ $t('contact.form.message') }}</label>
            <textarea
              v-model="form.message"
              rows="5"
              :placeholder="$t('contact.form.messagePlaceholder')"
            ></textarea>
          </div>
          <button type="submit" class="btn-submit">{{ $t('contact.form.submit') }}</button>
          <p v-if="submitted" class="form-success">{{ $t('contact.form.successMsg') }}</p>
        </form>
      </div>

      <!-- INFO -->
      <div class="contact-panel">
        <h2 class="panel-title">{{ $t('contact.info.title') }}</h2>

        <div class="info-card">
          <div class="info-row">
            <span class="info-icon">📍</span>
            <span>{{ $t('contact.info.address') }}</span>
          </div>
          <div class="info-row">
            <span class="info-icon">📞</span>
            <span>{{ $t('contact.info.phone') }}</span>
          </div>
          <div class="info-row">
            <span class="info-icon">✉️</span>
            <span>{{ $t('contact.info.email') }}</span>
          </div>
        </div>

        <div class="info-card">
          <h3 class="hours-title">{{ $t('contact.info.hoursTitle') }}</h3>
          <div class="info-row">
            <span class="info-icon">🕐</span>
            <div>
              <p>{{ $t('contact.info.weekday') }}</p>
              <p>{{ $t('contact.info.saturday') }}</p>
              <p>{{ $t('contact.info.sunday') }}</p>
            </div>
          </div>
        </div>

        <div class="map-wrap">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=106.6200%2C10.7050%2C106.7200%2C10.7950&layer=mapnik"
            allowfullscreen
            loading="lazy"
            title="Ban do CarVehicle"
          ></iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

/* ---- PANEL ---- */
.contact-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-title {
  margin: 0;
  font-size: 20px;
  letter-spacing: 0.06em;
}

/* ---- FORM ---- */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(12, 18, 26, 0.7);
  border: 1px solid rgba(127, 162, 214, 0.18);
  border-radius: 18px;
  padding: 28px 24px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field label {
  font-size: 13px;
  letter-spacing: 0.06em;
  color: #c2d1ea;
}

.field input,
.field textarea {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(127, 162, 214, 0.28);
  background: rgba(15, 22, 32, 0.8);
  color: #e9f1ff;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s;
}

.field input:focus,
.field textarea:focus {
  border-color: #1f6feb;
}

.btn-submit {
  padding: 12px 28px;
  border-radius: 999px;
  border: none;
  background: #1f6feb;
  color: #fff;
  font-size: 14px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  font-family: inherit;
  align-self: flex-start;
  transition: opacity 0.2s;
}

.btn-submit:hover {
  opacity: 0.85;
}

.form-success {
  font-size: 14px;
  color: #00d4ff;
  margin: 0;
}

/* ---- INFO ---- */
.info-card {
  background: rgba(12, 18, 26, 0.7);
  border: 1px solid rgba(127, 162, 214, 0.18);
  border-radius: 18px;
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 15px;
  color: #c2d1ea;
}

.info-row p {
  margin: 0;
}

.info-icon {
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 1px;
}

.hours-title {
  margin: 0;
  font-size: 14px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7fa2d6;
}

/* ---- MAP ---- */
.map-wrap {
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(127, 162, 214, 0.18);
  height: 220px;
}

.map-wrap iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  filter: invert(0.9) hue-rotate(180deg);
}

@media (max-width: 820px) {
  .contact-layout {
    grid-template-columns: 1fr;
  }
}
</style>
