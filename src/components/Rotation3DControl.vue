<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  currentMode: {
    type: String,
    required: true
  },
  initialSpeed: {
    type: Number,
    default: 0.005
  }
});

const emit = defineEmits(['rotation-speed-changed']);

const rotationSpeed = ref(props.initialSpeed);

watch(rotationSpeed, (newSpeed) => {
  emit('rotation-speed-changed', parseFloat(newSpeed));
});
</script>

<template>
  <div v-if="currentMode.startsWith('3d')" class="rotation-control">
    <h4>Rotation 3D</h4>
    <label for="rotation-speed">Vitesse</label>
    <div class="slider-wrapper">
      <input
        id="rotation-speed"
        v-model="rotationSpeed"
        type="range"
        min="0"
        max="0.02"
        step="0.001"
      />
      <span class="value-display">{{ (rotationSpeed * 1000).toFixed(1) }}</span>
    </div>
  </div>
</template>

<style scoped>
.rotation-control {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.rotation-control h4 {
  margin: 0 0 5px 0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #00ff88;
  text-align: center;
}

.rotation-control label {
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #00ff88;
}

.slider-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.slider-wrapper input[type=range] {
  flex: 1;
  accent-color: #00ff88;
  cursor: pointer;
}

.value-display {
  font-size: 0.85rem;
  color: #00ff88;
  min-width: 50px;
  text-align: right;
}
</style>
