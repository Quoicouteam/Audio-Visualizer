<script setup>
import AudioFileUploader from './AudioFileUploader.vue';
import AudioControls from './AudioControls.vue';
import ModeSelector from './ModeSelector.vue';
import AssetUploader from './AssetUploader.vue';
import ShaderSelector from './ShaderSelector.vue';

defineProps({
  isPlaying: Boolean,
  currentMode: {
    type: String,
    required: true
  }
});

defineEmits([
  'file-uploaded',
  'mode-changed',
  'toggle-play',
  'stop',
  'volume-change',
  'image-uploaded',
  'model-uploaded',
  'shader-2d-changed',
  'shader-3d-changed',
  'reset-mode'
]);
</script>

<template>
  <div class="controls-overlay">
    <div class="panel">
      <h3>Commandes Rétro</h3>

      <div class="section">
        <AudioFileUploader @file-uploaded="$emit('file-uploaded', $event)" />
      </div>

      <div class="divider"></div>

      <div class="section">
        <AudioControls
          :is-playing="isPlaying"
          @toggle-play="$emit('toggle-play')"
          @stop="$emit('stop')"
          @volume-change="$emit('volume-change', $event)"
        />
      </div>

      <div class="divider"></div>

      <div class="section">
        <ModeSelector @mode-changed="$emit('mode-changed', $event)" />
      </div>

      <div class="divider"></div>

      <div class="section">
        <AssetUploader
          :current-mode="currentMode"
          @image-uploaded="$emit('image-uploaded', $event)"
          @model-uploaded="$emit('model-uploaded', $event)"
          @reset-mode="$emit('reset-mode')"
        />
      </div>

      <div class="divider"></div>

      <div class="section">
        <ShaderSelector
          :current-mode="currentMode"
          @shader-2d-changed="$emit('shader-2d-changed', $event)"
          @shader-3d-changed="$emit('shader-3d-changed', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls-overlay {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  user-select: none;
}

.panel {
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid #00ff88;
  padding: 15px 25px;
  border-radius: 12px;
  text-align: center;
  color: #00ff88;
  font-family: 'Courier New', monospace;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.15);
  backdrop-filter: blur(5px);
  min-width: 300px;
}

h3 { margin: 0 0 15px 0; font-size: 1rem; text-transform: uppercase; letter-spacing: 2px; }

.section { margin: 10px 0; display: flex; justify-content: center; align-items: center; gap: 10px; }

.btn {
  background: transparent;
  border: 1px solid #00ff88;
  color: #00ff88;
  padding: 8px 16px;
  cursor: pointer;
  font-family: inherit;
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.2s;
  border-radius: 4px;
}

.btn:hover { background: #00ff88; color: black; box-shadow: 0 0 10px #00ff88; }
.btn:active { transform: scale(0.95); }

.icon-btn { font-size: 1.2rem; padding: 5px 15px; }

.volume-wrapper { display: flex; align-items: center; gap: 5px; margin-left: 10px; }
input[type=range] { accent-color: #00ff88; cursor: pointer; }

.divider { height: 1px; background: #00ff88; margin: 10px 0; opacity: 0.3; }

.shaders-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 10px 0;
}

.shader-dropdown {
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: left;
}

.shader-dropdown label {
  font-size: 0.85rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.shader-select {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #00ff88;
  color: #00ff88;
  padding: 6px 10px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  width: 100%;
}

.shader-select:hover {
  background: rgba(0, 255, 136, 0.1);
  box-shadow: 0 0 5px rgba(0, 255, 136, 0.3);
}

.shader-select:focus {
  outline: none;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}

.shader-select option {
  background: #0a0a0a;
  color: #00ff88;
}
</style>
