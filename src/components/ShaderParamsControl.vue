<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  currentMode: {
    type: String,
    required: true
  },
  currentShader: {
    type: String,
    default: ''
  },
  shaderParams: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['shader-param-changed']);

// Liste des paramètres gérés automatiquement par le code (à exclure de l'UI)
const autoManagedParams = [
  'uTime', 'u_time',
  'uAudioData', 'u_audioData', 'u_audioLevel',
  'u_bass', 'u_mid', 'u_treble',
  'u_peak', 'u_energy',
  'uTexture', 'u_texture',
  'uHasTexture',
  'u_resolution'
];

// Paramètres modifiables avec leurs configurations
const paramConfigs = {
  // Spiky shader (3D)
  u_baseAmount: { label: 'Quantité de Base', min: -2, max: 2, step: 0.1 },
  u_spikeAmount: { label: 'Quantité de Spikes', min: -5, max: 15, step: 0.1 },
  u_noiseScale: { label: 'Échelle du Bruit', min: 1, max: 50, step: 0.5 },
  u_noiseSpeed: { label: 'Vitesse du Bruit', min: -2, max: 2, step: 0.001 },

  // Wave shader (3D)
  u_waveSpeed: { label: 'Vitesse de Vague', min: 0, max: 10, step: 0.1 },
  u_waveAmplitude: { label: 'Amplitude de Vague', min: 0, max: 2, step: 0.05 },
  u_audioInfluence: { label: "Influence de l'audio", min: 0, max: 6, step: 0.05 },
  u_waveScale: { label: 'Échelle de Vague', min: 0.5, max: 20, step: 0.5 },

  // DNA Helix shader (3D)
  u_helixRadius: { label: 'Rayon Hélice', min: 0.2, max: 2, step: 0.1 },
  u_helixHeight: { label: 'Hauteur Hélice', min: 0.5, max: 5, step: 0.1 },
  u_twistSpeed: { label: 'Vitesse de Torsion', min: 0, max: 10, step: 0.5 },
  u_spacing: { label: 'Espacement', min: 0.5, max: 3, step: 0.1 },

  // Liquid Metal shader (3D)
  u_viscosity: { label: 'Viscosité', min: 0, max: 3, step: 0.1 },
  u_dropIntensity: { label: 'Intensité Gouttes', min: 0, max: 2, step: 0.1 },

  // Blooming Flower shader (3D)
  u_petalCount: { label: 'Nombre de Pétales', min: 3, max: 16, step: 1 },
  u_bloomAmount: { label: 'Ouverture', min: 0, max: 1, step: 0.05 },
  u_petalCurve: { label: 'Courbure Pétales', min: 0, max: 3, step: 0.1 },
  u_centerSize: { label: 'Taille Centre', min: 0.1, max: 0.5, step: 0.05 },

  // Paramètres communs 2D
  u_speed: { label: 'Vitesse', min: 0, max: 5, step: 0.1 },
  u_intensity: { label: 'Intensité', min: 0, max: 3, step: 0.1 },
  u_scale: { label: 'Échelle', min: 0.1, max: 3, step: 0.1 },

  // Fractal shader (2D)
  u_power: { label: 'Puissance Fractale', min: 2, max: 16, step: 0.5 },
  u_iterations: { label: 'Itérations', min: 3, max: 12, step: 1 },
  u_bailout: { label: 'Bailout', min: 1, max: 5, step: 0.1 },
  u_cameraDistance: { label: 'Distance Caméra', min: 1, max: 8, step: 0.1 },
  u_rotationSpeed: { label: 'Vitesse de Rotation', min: -1, max: 1, step: 0.05 },

  // Couleurs (format vec3)
  u_color: { label: 'Couleur', type: 'color' },
  u_color1: { label: 'Couleur 1', type: 'color' },
  u_color2: { label: 'Couleur 2', type: 'color' },
  u_color3: { label: 'Couleur 3', type: 'color' }
};

// Filtrer les paramètres affichables
const displayableParams = computed(() => {
  const params = {};

  for (const key in props.shaderParams) {
    // Exclure les paramètres automatiques
    if (autoManagedParams.includes(key)) continue;

    // Vérifier si on a une config pour ce paramètre
    if (paramConfigs[key]) {
      // Extraire la valeur réelle (gérer le cas où c'est {value: X})
      const rawValue = props.shaderParams[key];
      const actualValue = rawValue && typeof rawValue === 'object' && 'value' in rawValue
        ? rawValue.value
        : rawValue;

      params[key] = {
        value: actualValue,
        config: paramConfigs[key]
      };
    }
  }

  return params;
});

// Valeurs locales des paramètres
const localParams = ref({});

// Initialiser les valeurs locales
watch(() => props.shaderParams, () => {
  for (const key in displayableParams.value) {
    const param = displayableParams.value[key];
    // Seulement mettre à jour si la valeur existe et n'est pas undefined
    if (param.value !== undefined && param.value !== null) {
      if (param.config.type === 'color' && Array.isArray(param.value)) {
        // Convertir vec3 en couleur hex
        localParams.value[key] = rgbToHex(param.value);
      } else {
        localParams.value[key] = param.value;
      }
    }
  }
}, { immediate: true, deep: true });

// Conversion RGB array vers hex
const rgbToHex = (rgb) => {
  const r = Math.round(rgb[0] * 255);
  const g = Math.round(rgb[1] * 255);
  const b = Math.round(rgb[2] * 255);
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// Conversion hex vers RGB array
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ] : [1, 1, 1];
};

// Gérer les changements de paramètres
const onParamChange = (key, value, isColor = false) => {
  if (isColor) {
    // Convertir la couleur hex en vec3
    emit('shader-param-changed', key, hexToRgb(value));
  } else {
    emit('shader-param-changed', key, parseFloat(value));
  }
};
</script>

<template>
  <div v-if="Object.keys(displayableParams).length > 0" class="shader-params">
    <h4>Paramètres du Shader</h4>

    <div v-for="(param, key) in displayableParams" :key="key" class="param-control">
      <!-- Contrôle pour les couleurs -->
      <template v-if="param.config.type === 'color'">
        <label :for="key">{{ param.config.label }}</label>
        <div class="color-wrapper">
          <input
            :id="key"
            v-model="localParams[key]"
            type="color"
            @input="onParamChange(key, localParams[key], true)"
          />
          <span class="color-value">{{ localParams[key] }}</span>
        </div>
      </template>

      <!-- Contrôle pour les sliders -->
      <template v-else>
        <label :for="key">{{ param.config.label }}</label>
        <div class="slider-wrapper">
          <input
            :id="key"
            v-model="localParams[key]"
            type="range"
            :min="param.config.min"
            :max="param.config.max"
            :step="param.config.step"
            @input="onParamChange(key, localParams[key])"
          />
          <span class="value-display">{{ Number(localParams[key]).toFixed(2) }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.shader-params {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 6px;
}

.shader-params h4 {
  margin: 0 0 10px 0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #00ff88;
  text-align: center;
}

.param-control {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.param-control label {
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  font-size: 0.8rem;
  color: #00ff88;
  min-width: 50px;
  text-align: right;
  font-family: 'Courier New', monospace;
}

.color-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-wrapper input[type=color] {
  width: 50px;
  height: 30px;
  border: 1px solid #00ff88;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
}

.color-value {
  font-size: 0.8rem;
  color: #00ff88;
  font-family: 'Courier New', monospace;
}
</style>
