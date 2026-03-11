<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({ car: { type: Object, default: null } })

const TOTAL_FRAMES = 36

const baseUrl = computed(() => {
  if (!props.car?.image) return null
  return props.car.image.replace(/\/\d+\.png(\?.*)?$/, '/')
})

function frameUrl(n) {
  return `${baseUrl.value}${n}.png`
}

const canvasRef = ref(null)
const currentFrame = ref(0)
const loadedCount = ref(0)
const isReady = ref(false)
const hintVisible = ref(true)

let preloaded = []
let isDragging = false
let lastX = 0
let fracFrame = 0
let resizeObs = null

function drawContain(ctx, img, cw, ch) {
  const iw = img.naturalWidth || 800
  const ih = img.naturalHeight || 600
  const scale = Math.min(cw / iw, ch / ih)
  const dx = (cw - iw * scale) / 2
  const dy = (ch - ih * scale) / 2
  ctx.drawImage(img, dx, dy, iw * scale, ih * scale)
}

function renderFrame() {
  const canvas = canvasRef.value
  if (!canvas) return
  const dpr = window.devicePixelRatio || 1
  const w = Math.round(canvas.clientWidth * dpr)
  const h = Math.round(canvas.clientHeight * dpr)
  if (w === 0 || h === 0) return
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, w, h)

  const f = Math.round(fracFrame) % TOTAL_FRAMES
  if (preloaded[f]?.complete && preloaded[f].naturalWidth) {
    drawContain(ctx, preloaded[f], w, h)
  }
}

function loadFrames() {
  isReady.value = false
  loadedCount.value = 0
  preloaded = Array(TOTAL_FRAMES).fill(null)
  let done = 0
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const img = new Image()
    const finish = () => {
      done++
      loadedCount.value = done
      if (done === TOTAL_FRAMES) {
        isReady.value = true
      }
    }
    img.onload = () => {
      preloaded[i] = img
      finish()
      if (i === 0) renderFrame()
    }
    img.onerror = finish
    img.src = frameUrl(i + 1)
  }
}

function goToFrame(n) {
  fracFrame = ((n % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES
  currentFrame.value = Math.round(fracFrame) % TOTAL_FRAMES
  renderFrame()
}

function onPointerDown(e) {
  hintVisible.value = false
  isDragging = true
  lastX = e.touches?.[0]?.clientX ?? e.clientX
  e.preventDefault()
}

function onPointerMove(e) {
  if (!isDragging) return
  const x = e.touches?.[0]?.clientX ?? e.clientX
  const dx = x - lastX
  lastX = x
  fracFrame = (((fracFrame + dx / 8) % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES
  currentFrame.value = Math.round(fracFrame) % TOTAL_FRAMES
  renderFrame()
}

function onPointerUp() {
  isDragging = false
}

const loadPercent = computed(() => Math.round((loadedCount.value / TOTAL_FRAMES) * 100))
const progressWidth = computed(() => `${((currentFrame.value + 1) / TOTAL_FRAMES) * 100}%`)

watch(baseUrl, (val) => {
  if (!val) return
  fracFrame = 0
  currentFrame.value = 0
  loadFrames()
})

onMounted(() => {
  loadFrames()
  resizeObs = new ResizeObserver(() => renderFrame())
  if (canvasRef.value) resizeObs.observe(canvasRef.value)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('touchmove', onPointerMove, { passive: false })
  window.addEventListener('touchend', onPointerUp)
})

onUnmounted(() => {
  resizeObs?.disconnect()
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('touchmove', onPointerMove)
  window.removeEventListener('touchend', onPointerUp)
})
</script>

<template>
  <div class="viewer360-wrap">
    <Transition name="fade">
      <div v-if="!isReady" class="viewer-loading">
        <div class="loading-ring">
          <svg viewBox="0 0 36 36" class="ring-svg">
            <circle class="ring-bg" cx="18" cy="18" r="15" />
            <circle
              class="ring-bar"
              cx="18"
              cy="18"
              r="15"
              :stroke-dasharray="`${loadPercent * 0.942} 100`"
            />
          </svg>
          <span class="loading-pct">{{ loadPercent }}%</span>
        </div>
        <p class="loading-label">Đang tải chế độ xem 360°</p>
      </div>
    </Transition>

    <canvas
      ref="canvasRef"
      class="viewer360-canvas"
      @pointerdown="onPointerDown"
      @touchstart.prevent="onPointerDown"
    ></canvas>

    <div class="viewer360-bar">
      <button class="bar-btn" title="Quay ngược" @click.stop="goToFrame(currentFrame - 3)">
        ‹
      </button>

      <div class="bar-progress">
        <div class="bar-fill" :style="{ width: progressWidth }"></div>
      </div>

      <Transition name="hint">
        <span v-if="hintVisible" class="bar-hint">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path d="M8 3L3 8l5 5M16 3l5 5-5 5" />
          </svg>
          Kéo để xoay 360°
        </span>
      </Transition>

      <button class="bar-btn" title="Quay tiếp" @click.stop="goToFrame(currentFrame + 3)">›</button>
    </div>

    <div class="frame-badge">360°</div>
  </div>
</template>

<style scoped>
.viewer360-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  min-height: 260px;
  border-radius: 16px;
  overflow: hidden;
  background: #04060a;
  border: 1px solid rgba(127, 162, 214, 0.14);
  user-select: none;
  cursor: grab;
}

.viewer360-wrap:active {
  cursor: grabbing;
}

.viewer360-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.viewer-loading {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: #04060a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.loading-ring {
  position: relative;
  width: 62px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-svg {
  width: 62px;
  height: 62px;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: rgba(127, 162, 214, 0.12);
  stroke-width: 3;
}

.ring-bar {
  fill: none;
  stroke: #1f6feb;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dashoffset: 0;
  transition: stroke-dasharray 0.2s ease;
}

.loading-pct {
  position: absolute;
  font-size: 13px;
  font-weight: 600;
  color: #7fa2d6;
}

.loading-label {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(127, 162, 214, 0.55);
}

.viewer360-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(to top, rgba(4, 6, 10, 0.85) 0%, transparent 100%);
}

.bar-btn {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid rgba(127, 162, 214, 0.28);
  background: rgba(6, 10, 16, 0.7);
  color: #c2d1ea;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.bar-btn:hover {
  border-color: #1f6feb;
  background: rgba(31, 111, 235, 0.18);
}

.bar-progress {
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: rgba(127, 162, 214, 0.18);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1f6feb, #00d4ff);
  border-radius: 2px;
  transition: width 0.05s linear;
}

.bar-hint {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: rgba(127, 162, 214, 0.7);
  letter-spacing: 0.06em;
  white-space: nowrap;
  pointer-events: none;
}

.frame-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 4;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(31, 111, 235, 0.18);
  border: 1px solid rgba(31, 111, 235, 0.4);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #93c5fd;
  pointer-events: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.hint-enter-active,
.hint-leave-active {
  transition: opacity 0.4s ease;
}
.hint-enter-from,
.hint-leave-to {
  opacity: 0;
}
</style>
