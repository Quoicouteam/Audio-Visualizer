<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { initScene, switchModeAndReset, onWindowResize, cleanupScene,
         getCurrent3DShader, getCurrent3DShaderParams, getCurrent2DShaderParams,
         updateRotationSpeed, update3DShaderParam, update2DShaderParam } from './scripts/sceneManager.js';
import { setupAudio } from './scripts/audioManager.js';
import VisualizerControls from './components/VisualizerControls.vue';
import Rotation3DControl from './components/Rotation3DControl.vue';
import ShaderParamsControl from './components/ShaderParamsControl.vue';const canvasContainer = ref(null);
const audioPlayer = ref(null);
const isPlaying = ref(false);
const currentMode = ref('3d-model');
const current3DShader = ref('normals');
const shaderParams = ref({});
const rotationSpeed = ref(0.005);

const onFileUploaded = (file) => {
  const url = URL.createObjectURL(file);
  audioPlayer.value.src = url;
  audioPlayer.value.play();
  isPlaying.value = true;
  setupAudio(audioPlayer.value);
};

const onTogglePlay = () => {
  if (!audioPlayer.value.src) return;

  if (audioPlayer.value.paused) {
    audioPlayer.value.play();
    isPlaying.value = true;
    setupAudio(audioPlayer.value);
  } else {
    audioPlayer.value.pause();
    isPlaying.value = false;
  }
};

const onStop = () => {
  if (!audioPlayer.value) return;
  audioPlayer.value.pause();
  audioPlayer.value.currentTime = 0;
  isPlaying.value = false;
};

const onVolumeChange = (volume) => {
  if (audioPlayer.value) {
    audioPlayer.value.volume = volume;
  }
};

const onImageUploaded = (file) => {
  const url = URL.createObjectURL(file);
  import('./scripts/sceneManager.js').then(({ setImage2D }) => {
    setImage2D(url);
  });
};

const onModelUploaded = (file) => {
  const url = URL.createObjectURL(file);
  const extension = file.name.split('.').pop().toLowerCase();
  import('./scripts/sceneManager.js').then(({ setModel3D }) => {
    setModel3D(url, extension);
  });
};

const onShader2DChanged = (shaderName) => {
  import('./scripts/sceneManager.js').then(({ changeShader2D }) => {
    changeShader2D(shaderName);
    updateShaderInfo();
  });
};

const onShader3DChanged = (shaderName) => {
  import('./scripts/sceneManager.js').then(({ changeShader3D }) => {
    changeShader3D(shaderName);
    updateShaderInfo();
  });
};

const onRotationSpeedChanged = (speed) => {
  rotationSpeed.value = speed;
  updateRotationSpeed(speed);
};

const onShaderParamChanged = (paramName, value) => {
  if (currentMode.value.startsWith('3d')) {
    update3DShaderParam(paramName, value);
  } else if (currentMode.value.startsWith('2d')) {
    update2DShaderParam(paramName, value);
  }
};

const updateShaderInfo = () => {
  if (currentMode.value.startsWith('3d')) {
    current3DShader.value = getCurrent3DShader();
    shaderParams.value = getCurrent3DShaderParams();
  } else if (currentMode.value.startsWith('2d')) {
    shaderParams.value = getCurrent2DShaderParams();
  }
};

// Mettre à jour les informations du shader quand le mode change
watch(currentMode, () => {
  updateShaderInfo();
});

const onModeChanged = (mode) => {
  switchModeAndReset(mode);
  currentMode.value = mode;
};

const onResetMode = () => {
  switchModeAndReset(currentMode.value);
};

onMounted(() => {
  if (canvasContainer.value) {
    initScene(canvasContainer.value);
    window.addEventListener('resize', onWindowResize);
    updateShaderInfo();
  }
});

onBeforeUnmount(() => {
  cleanupScene();
  window.removeEventListener('resize', onWindowResize);
});
</script>

<template>
  <div class="app-container">

    <VisualizerControls
      :is-playing="isPlaying"
      :current-mode="currentMode"
      @file-uploaded="onFileUploaded"
      @mode-changed="onModeChanged"
      @toggle-play="onTogglePlay"
      @stop="onStop"
      @volume-change="onVolumeChange"
      @image-uploaded="onImageUploaded"
      @model-uploaded="onModelUploaded"
      @shader-2d-changed="onShader2DChanged"
      @shader-3d-changed="onShader3DChanged"
      @reset-mode="onResetMode"
    />

    <!-- Contrôle de rotation en bas à gauche -->
    <div class="rotation-panel-overlay">
      <Rotation3DControl
        :current-mode="currentMode"
        :initial-speed="rotationSpeed"
        @rotation-speed-changed="onRotationSpeedChanged"
      />
    </div>

    <!-- Paramètres du shader en bas à droite -->
    <div class="shader-params-overlay">
      <ShaderParamsControl
        :current-mode="currentMode"
        :current-shader="current3DShader"
        :shader-params="shaderParams"
        @shader-param-changed="onShaderParamChanged"
      />
    </div>

    <audio ref="audioPlayer" crossorigin="anonymous" style="display:none;" @ended="isPlaying = false"></audio>

    <div ref="canvasContainer" class="canvas-wrapper"></div>

  </div>
</template>

<style>
body { margin: 0; background: #050505; overflow: hidden; }
.app-container { position: relative; width: 100vw; height: 100vh; }
.canvas-wrapper { width: 100%; height: 100%; }

/* Panel de rotation en bas à gauche */
.rotation-panel-overlay {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid #00ff88;
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.15);
  backdrop-filter: blur(5px);
  min-width: 250px;
}

/* Panel des paramètres shader en bas à droite */
.shader-params-overlay {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;
  max-height: 70vh;
  overflow-y: auto;
  max-width: 350px;
}

/* Scrollbar personnalisée pour le panel des paramètres */
.shader-params-overlay::-webkit-scrollbar {
  width: 8px;
}

.shader-params-overlay::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.shader-params-overlay::-webkit-scrollbar-thumb {
  background: #00ff88;
  border-radius: 4px;
}

.shader-params-overlay::-webkit-scrollbar-thumb:hover {
  background: #00cc6e;
}
</style>
