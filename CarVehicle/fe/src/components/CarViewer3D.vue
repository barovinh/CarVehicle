<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({ car: { type: Object, default: null } })

// Declared early so all functions below can reference them
const viewMode = ref('exterior')
const transitioning = ref(false)

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
let extDragging = false
let extLastX = 0
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

function onExtDown(e) {
  if (viewMode.value !== 'exterior' || transitioning.value) return
  hintVisible.value = false
  extDragging = true
  extLastX = e.touches?.[0]?.clientX ?? e.clientX
  e.preventDefault()
}

function onExtMove(e) {
  if (viewMode.value !== 'exterior' || !extDragging) return
  const x = e.touches?.[0]?.clientX ?? e.clientX
  const dx = x - extLastX
  extLastX = x
  fracFrame = (((fracFrame + dx / 8) % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES
  currentFrame.value = Math.round(fracFrame) % TOTAL_FRAMES
  renderFrame()
}

function onExtUp() {
  extDragging = false
}

// ─── DOOR HOTSPOT ──────────────────────────────────────────
const DOOR_FRAME_START = 5
const DOOR_FRAME_END = 13

// ─── HOOD & TRUNK HOTSPOTS ─────────────────────────────────
const HOOD_FRAME_START = 30
const HOOD_FRAME_END = 36
const TRUNK_FRAME_START = 16
const TRUNK_FRAME_END = 22

const activePanel = ref(null) // 'hood' | 'trunk' | null
const panelImgSrc = ref('')
const panelImgLoaded = ref(false)
let panelImg = null

const showDoorHotspot = computed(
  () =>
    viewMode.value === 'exterior' &&
    isReady.value &&
    !transitioning.value &&
    !activePanel.value &&
    currentFrame.value >= DOOR_FRAME_START &&
    currentFrame.value <= DOOR_FRAME_END,
)

const showHoodHotspot = computed(
  () =>
    viewMode.value === 'exterior' &&
    isReady.value &&
    !transitioning.value &&
    !activePanel.value &&
    (currentFrame.value >= HOOD_FRAME_START || currentFrame.value <= 2),
)

const showTrunkHotspot = computed(
  () =>
    viewMode.value === 'exterior' &&
    isReady.value &&
    !transitioning.value &&
    !activePanel.value &&
    currentFrame.value >= TRUNK_FRAME_START &&
    currentFrame.value <= TRUNK_FRAME_END,
)

function openPanel(type) {
  const url = type === 'hood' ? (props.car?.hoodImage ?? '') : (props.car?.trunkImage ?? '')
  if (!url) return
  activePanel.value = type
  panelImgLoaded.value = false
  panelImgSrc.value = url
  panelImg = new Image()
  panelImg.onload = () => {
    panelImgLoaded.value = true
  }
  panelImg.src = url
}

function closePanel() {
  activePanel.value = null
  panelImgLoaded.value = false
  panelImg = null
}

// ─── INTERIOR CANVAS VIEWER ─────────────────────────────────
const intCanvasRef = ref(null)
const intHintVisible = ref(true)
const intIsReady = ref(false)
const intLoadedCount = ref(0)
const revealX = ref('55%')
const revealY = ref('55%')

const intImages = computed(() => props.car?.interiorImages ?? [])

let intPreloaded = []
let intDragging = false
let intLastX = 0
let intFracFrame = 0
let intResizeObs = null

const INT_SENS = 10

function intTotal() {
  return intPreloaded.length
}

function renderIntFrame() {
  const canvas = intCanvasRef.value
  if (!canvas) return
  const dpr = window.devicePixelRatio || 1
  const w = Math.round(canvas.clientWidth * dpr)
  const h = Math.round(canvas.clientHeight * dpr)
  if (!w || !h) return
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, w, h)
  if (!intTotal()) return
  const f = ((Math.round(intFracFrame) % intTotal()) + intTotal()) % intTotal()
  if (intPreloaded[f]?.complete && intPreloaded[f].naturalWidth)
    drawContain(ctx, intPreloaded[f], w, h)
}

function loadInteriorImages() {
  const urls = intImages.value
  if (!urls.length) {
    intIsReady.value = true
    return
  }
  intIsReady.value = false
  intLoadedCount.value = 0
  intPreloaded = Array(urls.length).fill(null)
  let done = 0
  urls.forEach((url, i) => {
    const img = new Image()
    const finish = () => {
      done++
      intLoadedCount.value = done
      if (done === urls.length) {
        intIsReady.value = true
        renderIntFrame()
      }
    }
    img.onload = () => {
      intPreloaded[i] = img
      finish()
    }
    img.onerror = finish
    img.src = url
  })
}

function disposeInterior() {
  intResizeObs?.disconnect()
  intResizeObs = null
  intPreloaded = []
  intIsReady.value = false
  intLoadedCount.value = 0
  intFracFrame = 0
  intDragging = false
}

function onIntDown(e) {
  if (viewMode.value !== 'interior') return
  intHintVisible.value = false
  intDragging = true
  intLastX = e.touches?.[0]?.clientX ?? e.clientX
  e.preventDefault()
}

function onIntMove(e) {
  if (viewMode.value !== 'interior' || !intDragging || !intTotal()) return
  const x = e.touches?.[0]?.clientX ?? e.clientX
  const dx = x - intLastX
  intLastX = x
  intFracFrame = (((intFracFrame + dx / INT_SENS) % intTotal()) + intTotal()) % intTotal()
  renderIntFrame()
}

function onIntUp() {
  intDragging = false
}

// ─── TRANSITIONS ─────────────────────────────────────────────
function enterInterior(e) {
  if (transitioning.value) return
  const btn = e.currentTarget
  const wrap = btn.closest('.viewer360-wrap')
  if (wrap) {
    const br = btn.getBoundingClientRect()
    const wr = wrap.getBoundingClientRect()
    revealX.value = (((br.left + br.width / 2 - wr.left) / wr.width) * 100).toFixed(1) + '%'
    revealY.value = (((br.top + br.height / 2 - wr.top) / wr.height) * 100).toFixed(1) + '%'
  }
  transitioning.value = true
  viewMode.value = 'interior'
  nextTick(() => {
    intFracFrame = 0
    intHintVisible.value = true
    intIsReady.value = false
    loadInteriorImages()
    if (intCanvasRef.value) {
      intResizeObs = new ResizeObserver(() => renderIntFrame())
      intResizeObs.observe(intCanvasRef.value)
    }
    setTimeout(() => {
      transitioning.value = false
    }, 700)
  })
}

function exitInterior() {
  if (transitioning.value) return
  transitioning.value = true
  viewMode.value = 'exterior'
}

function onIntAfterLeave() {
  disposeInterior()
  transitioning.value = false
}

// ─── COMPUTED ──────────────────────────────────────────────
const loadPercent = computed(() => Math.round((loadedCount.value / TOTAL_FRAMES) * 100))
const progressWidth = computed(() => `${((currentFrame.value + 1) / TOTAL_FRAMES) * 100}%`)
const intLoadPercent = computed(() => {
  const n = intImages.value.length || 1
  return Math.round((intLoadedCount.value / n) * 100)
})

// ─── WATCHERS ───────────────────────────────────────────────
watch(baseUrl, (val) => {
  if (!val) return
  fracFrame = 0
  currentFrame.value = 0
  loadFrames()
})

// ─── LIFECYCLE ─────────────────────────────────────────────
const _allExtListeners = [
  [window, 'pointermove', onExtMove],
  [window, 'pointerup', onExtUp],
  [window, 'touchmove', onExtMove],
  [window, 'touchend', onExtUp],
]
const _allIntListeners = [
  [window, 'pointermove', onIntMove],
  [window, 'pointerup', onIntUp],
  [window, 'touchmove', onIntMove],
  [window, 'touchend', onIntUp],
]

onMounted(() => {
  loadFrames()
  resizeObs = new ResizeObserver(() => renderFrame())
  if (canvasRef.value) resizeObs.observe(canvasRef.value)
  _allExtListeners.forEach(([t, ev, fn]) =>
    t.addEventListener(ev, fn, ev.startsWith('touch') ? { passive: false } : undefined),
  )
  _allIntListeners.forEach(([t, ev, fn]) =>
    t.addEventListener(ev, fn, ev.startsWith('touch') ? { passive: false } : undefined),
  )
})

onUnmounted(() => {
  disposeInterior()
  resizeObs?.disconnect()
  _allExtListeners.forEach(([t, ev, fn]) => t.removeEventListener(ev, fn))
  _allIntListeners.forEach(([t, ev, fn]) => t.removeEventListener(ev, fn))
})
</script>

<template>
  <div class="viewer360-wrap">
    <!-- ── EXTERIOR LOADING ────────────────── -->
    <Transition name="fade">
      <div v-if="viewMode === 'exterior' && !isReady" class="viewer-loading">
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

    <!-- ── EXTERIOR CANVAS ────────────────── -->
    <canvas
      ref="canvasRef"
      class="viewer360-canvas"
      :class="{ 'canvas-hidden': viewMode === 'interior' }"
      @pointerdown="onExtDown"
      @touchstart.prevent="onExtDown"
    ></canvas>

    <!-- ── DOOR HOTSPOT ──────────────────── -->
    <Transition name="hotspot">
      <button
        v-if="showDoorHotspot"
        class="door-hotspot"
        title="Khám phá nội thất"
        @click="enterInterior"
      >
        <span class="hotspot-pulse"></span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="1" width="18" height="22" rx="2" />
          <line x1="3" y1="8" x2="14" y2="8" />
          <circle cx="16" cy="14" r="1.5" fill="currentColor" />
        </svg>
        <span class="hotspot-label">Nội thất</span>
      </button>
    </Transition>

    <!-- ── HOOD HOTSPOT ─────────────────────── -->
    <Transition name="hotspot">
      <button
        v-if="showHoodHotspot"
        class="hood-hotspot"
        title="Mở capo"
        @click="openPanel('hood')"
      >
        <span class="hotspot-pulse"></span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 17l4-10h10l4 10" />
          <path d="M5 17h14" />
          <path d="M12 7v4" />
        </svg>
        <span class="hotspot-label">Mở capo</span>
      </button>
    </Transition>

    <!-- ── TRUNK HOTSPOT ────────────────────── -->
    <Transition name="hotspot">
      <button
        v-if="showTrunkHotspot"
        class="trunk-hotspot"
        title="Mở cốp"
        @click="openPanel('trunk')"
      >
        <span class="hotspot-pulse"></span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="2" y="14" width="20" height="6" rx="1" />
          <path d="M6 14V9a6 6 0 0 1 12 0v5" />
        </svg>
        <span class="hotspot-label">Mở cốp</span>
      </button>
    </Transition>

    <!-- ── EXTERIOR BAR & BADGE ────────────── -->
    <template v-if="viewMode === 'exterior'">
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

        <button class="bar-btn" title="Quay tiếp" @click.stop="goToFrame(currentFrame + 3)">
          ›
        </button>
      </div>

      <div class="frame-badge">360°</div>
    </template>

    <!-- ── INTERIOR LAYER ─────────────────── -->
    <Transition name="room" @after-leave="onIntAfterLeave">
      <div
        v-if="viewMode === 'interior'"
        class="int-layer"
        :style="{ '--rx': revealX, '--ry': revealY }"
      >
        <!-- Interior loading -->
        <Transition name="fade">
          <div v-if="!intIsReady" class="viewer-loading">
            <div class="loading-ring">
              <svg viewBox="0 0 36 36" class="ring-svg">
                <circle class="ring-bg" cx="18" cy="18" r="15" />
                <circle
                  class="ring-bar"
                  cx="18"
                  cy="18"
                  r="15"
                  :stroke-dasharray="`${intLoadPercent * 0.942} 100`"
                />
              </svg>
              <span class="loading-pct">{{ intLoadPercent }}%</span>
            </div>
            <p class="loading-label">Đang tải nội thất 360°</p>
          </div>
        </Transition>

        <!-- Interior panoramic canvas -->
        <canvas
          ref="intCanvasRef"
          class="viewer360-canvas"
          @pointerdown="onIntDown"
          @touchstart.prevent="onIntDown"
        ></canvas>

        <!-- No images placeholder -->
        <div v-if="intIsReady && !intImages.length" class="no-interior">
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.2"
          >
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M9 3v18" />
            <circle cx="15" cy="12" r="1.5" fill="currentColor" />
          </svg>
          <p>Ảnh nội thất 360°</p>
          <p class="no-interior-sub">sẽ sớm ra mắt</p>
        </div>

        <!-- Interior drag hint -->
        <Transition name="hint">
          <span v-if="intHintVisible && intIsReady && intImages.length" class="bar-hint int-hint">
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
            Kéo để nhìn quanh
          </span>
        </Transition>

        <!-- Exit button (also acts as door back to exterior) -->
        <button class="exit-btn" title="Ra ngoài xe" @click="exitInterior">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Ra ngoài
        </button>

        <!-- Interior badge -->
        <div class="frame-badge int-badge">NỘI THẤT 360°</div>
      </div>
    </Transition>

    <!-- ── HOOD / TRUNK PANEL ────────────────── -->
    <Transition name="panel">
      <div
        v-if="activePanel"
        class="panel-overlay"
        :class="activePanel === 'hood' ? 'panel-hood' : 'panel-trunk'"
        @click.self="closePanel"
      >
        <div class="panel-scene" :class="activePanel === 'hood' ? 'scene-hood' : 'scene-trunk'">
          <div class="panel-lid">
            <div class="panel-lid-face panel-lid-outer">
              <img
                v-if="panelImgSrc"
                :src="panelImgSrc"
                class="panel-img"
                :class="{ loaded: panelImgLoaded }"
                :alt="activePanel === 'hood' ? 'Capo xe mở' : 'Cốp xe mở'"
              />
              <div v-if="!panelImgLoaded" class="panel-loading">Đang tải...</div>
            </div>
          </div>
        </div>
        <button class="panel-close" @click="closePanel">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          Đóng
        </button>
        <div class="panel-badge">
          {{ activePanel === 'hood' ? 'KHOANG ĐỘNG CƠ' : 'KHOANG HÀNH LÝ' }}
        </div>
      </div>
    </Transition>
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

/* ── CANVAS VISIBILITY ──────────────────────────────────── */
.canvas-hidden {
  visibility: hidden;
  pointer-events: none;
}

/* ── DOOR HOTSPOT ───────────────────────────────────────── */
.door-hotspot {
  position: absolute;
  left: 60%;
  top: 56%;
  transform: translate(-50%, -50%);
  z-index: 5;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(8, 12, 18, 0.72);
  backdrop-filter: blur(6px);
  border: 1.5px solid rgba(31, 111, 235, 0.65);
  color: #93c5fd;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0;
  transition:
    border-color 0.2s,
    background 0.2s,
    transform 0.2s;
}

.door-hotspot:hover {
  border-color: #1f6feb;
  background: rgba(31, 111, 235, 0.28);
  color: #fff;
  transform: translate(-50%, -50%) scale(1.12);
}

.hotspot-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 1.5px solid rgba(31, 111, 235, 0.55);
  transform: translate(-50%, -50%);
  animation: hotspotPulse 2.2s ease-out infinite;
  pointer-events: none;
}

@keyframes hotspotPulse {
  0% {
    transform: translate(-50%, -50%) scale(0.65);
    opacity: 0.9;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.95);
    opacity: 0;
  }
}

.hotspot-label {
  font-size: 8px;
  letter-spacing: 0.07em;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 1;
  margin-top: 1px;
}

/* ── HOTSPOT TRANSITION ───────────────────────────────── */
.hotspot-enter-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.hotspot-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.hotspot-enter-from,
.hotspot-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.3);
}

/* ── INTERIOR LAYER ──────────────────────────────────── */
.int-layer {
  position: absolute;
  inset: 0;
  z-index: 8;
  background: #04060a;
  cursor: grab;
}

.int-layer:active {
  cursor: grabbing;
}

/* ── ROOM TRANSITION (circular reveal) ───────────────── */
.room-enter-active {
  animation: roomReveal 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.room-leave-active {
  animation: roomReveal 0.48s cubic-bezier(0.55, 0, 1, 0.45) reverse both;
}
@keyframes roomReveal {
  from {
    clip-path: circle(0% at var(--rx, 55%) var(--ry, 55%));
  }
  to {
    clip-path: circle(150% at var(--rx, 55%) var(--ry, 55%));
  }
}

/* ── EXIT BUTTON ────────────────────────────────────────── */
.exit-btn {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px 7px 10px;
  border-radius: 20px;
  background: rgba(6, 10, 16, 0.78);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(127, 162, 214, 0.24);
  color: #b0c6e8;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.exit-btn:hover {
  background: rgba(31, 111, 235, 0.22);
  border-color: #1f6feb;
  color: #fff;
}

/* ── INTERIOR BADGE ─────────────────────────────────── */
.int-badge {
  font-size: 9.5px;
  padding: 3px 8px;
  letter-spacing: 0.12em;
}

/* ── INTERIOR DRAG HINT ───────────────────────────── */
.int-hint {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background: rgba(6, 10, 16, 0.68);
  backdrop-filter: blur(6px);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(127, 162, 214, 0.15);
  white-space: nowrap;
}

/* ── NO INTERIOR PLACEHOLDER ───────────────────────── */
.no-interior {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: rgba(127, 162, 214, 0.35);
  pointer-events: none;
}

.no-interior svg {
  opacity: 0.35;
}

.no-interior p {
  margin: 0;
  font-size: 13px;
  letter-spacing: 0.06em;
}

.no-interior-sub {
  font-size: 11px !important;
  opacity: 0.7;
}

/* ── HOOD / TRUNK HOTSPOTS ─────────────────────────────────── */
.hood-hotspot {
  position: absolute;
  left: 26%;
  top: 36%;
  transform: translate(-50%, -50%);
  z-index: 5;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(8, 12, 18, 0.72);
  backdrop-filter: blur(6px);
  border: 1.5px solid rgba(0, 212, 255, 0.6);
  color: #7df9ff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0;
  transition:
    border-color 0.2s,
    background 0.2s,
    transform 0.2s;
}
.hood-hotspot:hover {
  border-color: #00d4ff;
  background: rgba(0, 212, 255, 0.22);
  color: #fff;
  transform: translate(-50%, -50%) scale(1.12);
}

.trunk-hotspot {
  position: absolute;
  left: 72%;
  top: 45%;
  transform: translate(-50%, -50%);
  z-index: 5;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(8, 12, 18, 0.72);
  backdrop-filter: blur(6px);
  border: 1.5px solid rgba(0, 212, 255, 0.6);
  color: #7df9ff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0;
  transition:
    border-color 0.2s,
    background 0.2s,
    transform 0.2s;
}
.trunk-hotspot:hover {
  border-color: #00d4ff;
  background: rgba(0, 212, 255, 0.22);
  color: #fff;
  transform: translate(-50%, -50%) scale(1.12);
}

/* ── PANEL OVERLAY ──────────────────────────────────────────── */
.panel-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: rgba(2, 5, 10, 0.88);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* 3-D scene container */
.panel-scene {
  width: 88%;
  height: 80%;
  perspective: 900px;
  cursor: default;
}

.panel-lid {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.panel-lid-face {
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  overflow: hidden;
  background: #08101c;
  border: 1px solid rgba(0, 212, 255, 0.2);
  position: relative;
}

.panel-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.35s ease;
}
.panel-img.loaded {
  opacity: 1;
}

.panel-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: rgba(127, 162, 214, 0.5);
  letter-spacing: 0.1em;
}

/* Hood opens from the top (rotateX negative = lift forward) */
.scene-hood .panel-lid {
  transform-origin: top center;
  animation: liftHood 0.7s cubic-bezier(0.25, 1, 0.5, 1) both;
}
@keyframes liftHood {
  from {
    transform: rotateX(-82deg);
    opacity: 0.3;
  }
  to {
    transform: rotateX(-14deg);
    opacity: 1;
  }
}

/* Trunk opens from the bottom (rotateX positive = flip up) */
.scene-trunk .panel-lid {
  transform-origin: bottom center;
  animation: liftTrunk 0.7s cubic-bezier(0.25, 1, 0.5, 1) both;
}
@keyframes liftTrunk {
  from {
    transform: rotateX(78deg);
    opacity: 0.3;
  }
  to {
    transform: rotateX(12deg);
    opacity: 1;
  }
}

/* Panel enter/leave */
.panel-enter-active {
  animation: panelFadeIn 0.3s ease both;
}
.panel-leave-active {
  animation: panelFadeIn 0.22s ease reverse both;
}
@keyframes panelFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.panel-close {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 25;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px 7px 10px;
  border-radius: 20px;
  background: rgba(6, 10, 16, 0.78);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(127, 162, 214, 0.22);
  color: #b0c6e8;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s;
}
.panel-close:hover {
  background: rgba(0, 212, 255, 0.18);
  border-color: #00d4ff;
  color: #fff;
}

.panel-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 25;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(0, 212, 255, 0.14);
  border: 1px solid rgba(0, 212, 255, 0.38);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #7df9ff;
  pointer-events: none;
}
</style>
