<script setup>
import { ref, onMounted, watch } from 'vue';
import { getAvailableShaders2D, getAvailableShaders3D } from '../scripts/shaderManager.js';

const props = defineProps({
  currentMode: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['shader-2d-changed', 'shader-3d-changed']);

const shaders2D = ref([]);
const shaders3D = ref([]);
const selectedShader2D = ref('default');
const selectedShader3D = ref('normals');

onMounted(() => {
  shaders2D.value = getAvailableShaders2D();
  shaders3D.value = getAvailableShaders3D();
});

// Réinitialiser les shaders quand le mode change
watch(() => props.currentMode, (newMode) => {
  if (newMode === '2d') {
    selectedShader2D.value = 'default';
    emit('shader-2d-changed', 'default');
  } else if (newMode === '3d-model') {
    selectedShader3D.value = 'normals';
    emit('shader-3d-changed', 'normals');
  }
});

const handleShader2DChange = (event) => {
  selectedShader2D.value = event.target.value;
  emit('shader-2d-changed', event.target.value);
};

const handleShader3DChange = (event) => {
  selectedShader3D.value = event.target.value;
  emit('shader-3d-changed', event.target.value);
};
</script>

<template>
  <div class="shaders-section">
    <!-- Shader 2D visible seulement en mode 2D -->
    <div v-if="currentMode === '2d'" class="shader-dropdown">
      <label>🎨 Shader 2D</label>
      <select
        v-model="selectedShader2D"
        @change="handleShader2DChange"
        class="shader-select"
      >
        <option
          v-for="shader in shaders2D"
          :key="shader.id"
          :value="shader.id"
        >
          {{ shader.name }}
        </option>
      </select>
    </div>

    <!-- Shader 3D visible seulement en mode 3D -->
    <div v-if="currentMode === '3d-model'" class="shader-dropdown">
      <label>✨ Shader 3D</label>
      <select
        v-model="selectedShader3D"
        @change="handleShader3DChange"
        class="shader-select"
      >
        <option
          v-for="shader in shaders3D"
          :key="shader.id"
          :value="shader.id"
        >
          {{ shader.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.shaders-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 60px; /* Évite le saut de layout */
}

.shader-dropdown {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.shader-dropdown label {
  font-size: 0.85rem;
  color: #00ff88;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.shader-select {
  padding: 8px 12px;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid #00ff88;
  border-radius: 6px;
  color: #00ff88;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
}

.shader-select:hover {
  background: rgba(0, 255, 136, 0.2);
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);
}

.shader-select:focus {
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
}

.shader-select option {
  background: #0a0a0a;
  color: #00ff88;
}
</style>
