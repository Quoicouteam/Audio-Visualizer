<script setup>
const emit = defineEmits(['mode-changed']);

const handleModeClick = (mode) => {
  emit('mode-changed', mode);
};
</script>

<template>
  <div class="modes">
    <button
      class="btn"
      @click="handleModeClick('2d')"
    >
      2D
    </button>
    <button
      class="btn"
      @click="handleModeClick('3d-model')"
    >
      3D
    </button>
  </div>
</template>

<style scoped>
.modes {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn {
  padding: 10px 20px;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid #00ff88;
  border-radius: 6px;
  color: #00ff88;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn:hover {
  background: rgba(0, 255, 136, 0.2);
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}
</style>
