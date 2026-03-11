<script setup></script>

<template>
  <section class="page">
    <header class="page-hero">
      <p class="eyebrow">{{ $t('home.eyebrow') }}</p>
      <h1>{{ $t('home.title') }}</h1>
      <p class="lead">{{ $t('home.lead') }}</p>
      <div class="hero-actions">
        <RouterLink class="btn primary" to="/ds-san-pham">{{
          $t('home.actions.products')
        }}</RouterLink>
        <RouterLink class="btn ghost" to="/lien-he">{{ $t('home.actions.contact') }}</RouterLink>
      </div>
    </header>

    <div class="page-grid">
      <article class="card">
        <h2>{{ $t('home.cards.highlight.title') }}</h2>
        <p>{{ $t('home.cards.highlight.body') }}</p>
      </article>
      <article class="card">
        <h2>{{ $t('home.cards.services.title') }}</h2>
        <p>{{ $t('home.cards.services.body') }}</p>
      </article>
      <article class="card">
        <h2>{{ $t('home.cards.promo.title') }}</h2>
        <p>{{ $t('home.cards.promo.body') }}</p>
      </article>
    </div>
  </section>
</template>
