<script setup></script>

<template>
  <section class="page">
    <header class="page-hero">
      <p class="eyebrow">Trang Chu</p>
      <h1>CarVehicle</h1>
      <p class="lead">Mo ta ngan gon cho website xe va dich vu.</p>
      <div class="hero-actions">
        <RouterLink class="btn primary" to="/ds-san-pham">Xem san pham</RouterLink>
        <RouterLink class="btn ghost" to="/lien-he">Lien he</RouterLink>
      </div>
    </header>

    <div class="page-grid">
      <article class="card">
        <h2>Danh muc noi bat</h2>
        <p>Trinh bay cac dong xe va phu kien co san.</p>
      </article>
      <article class="card">
        <h2>Dich vu</h2>
        <p>Tu van mua xe, bao duong dinh ky, tra gop.</p>
      </article>
      <article class="card">
        <h2>Khuyen mai</h2>
        <p>Cap nhat cac uu dai trong thang va su kien.</p>
      </article>
    </div>
  </section>
</template>
