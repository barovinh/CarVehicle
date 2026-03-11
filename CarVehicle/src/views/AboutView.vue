<script setup></script>

<template>
  <section class="page">
    <header class="page-hero">
      <p class="eyebrow">{{ $t('about.eyebrow') }}</p>
      <h1>{{ $t('about.title') }}</h1>
      <p class="lead">{{ $t('about.lead') }}</p>
    </header>

    <div class="page-grid">
      <article class="card">
        <h2>{{ $t('about.cards.vision.title') }}</h2>
        <p>{{ $t('about.cards.vision.body') }}</p>
      </article>
      <article class="card">
        <h2>{{ $t('about.cards.values.title') }}</h2>
        <p>{{ $t('about.cards.values.body') }}</p>
      </article>
      <article class="card">
        <h2>{{ $t('about.cards.journey.title') }}</h2>
        <p>{{ $t('about.cards.journey.body') }}</p>
      </article>
    </div>
  </section>
</template>
