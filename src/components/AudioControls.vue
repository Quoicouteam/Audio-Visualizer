<script setup>
defineProps({
  isPlaying: Boolean
});

const emit = defineEmits(['toggle-play', 'stop', 'volume-change']);

const handleVolumeChange = (event) => {
  emit('volume-change', event.target.value);
};
</script>

<template>
  <div class="player-controls">
    <button
      class="btn icon-btn"
      @click="$emit('toggle-play')"
      title="Lecture/Pause"
    >
      {{ isPlaying ? '⏸' : '▶' }}
    </button>

    <button
      class="btn icon-btn"
      @click="$emit('stop')"
      title="Stop"
    >
      ⏹
    </button>

    <div class="volume-wrapper">
      <span>🔊</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        @input="handleVolumeChange"
      >
    </div>
  </div>
</template>

<style scoped>
.player-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
}

.btn {
  padding: 8px 12px;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid #00ff88;
  border-radius: 6px;
  color: #00ff88;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.btn:hover {
  background: rgba(0, 255, 136, 0.2);
  transform: translateY(-1px);
}

.icon-btn {
  font-size: 1.2rem;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.volume-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 10px;
}

.volume-wrapper span {
  font-size: 1.1rem;
}

.volume-wrapper input[type="range"] {
  width: 100px;
  cursor: pointer;
}
</style>
