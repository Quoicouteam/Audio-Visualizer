<script setup>
defineProps({
  currentMode: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['image-uploaded', 'model-uploaded', 'reset-mode']);

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    emit('image-uploaded', file);
  }
};

const handleModelUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    emit('model-uploaded', file);
  }
};

const handleReset = () => {
  emit('reset-mode');
};
</script>

<template>
  <div class="upload-section">
    <!-- Boutons pour le mode 2D -->
    <template v-if="currentMode === '2d'">
      <button class="btn upload-btn" @click="handleReset">
        🔄 Réinitialiser
      </button>
      <label class="btn upload-btn">
        📂 Importer Image
        <input
          type="file"
          @change="handleImageUpload"
          accept="image/*"
          hidden
        >
      </label>
    </template>

    <!-- Boutons pour le mode 3D -->
    <template v-if="currentMode === '3d-model'">
      <button class="btn upload-btn" @click="handleReset">
        🔄 Réinitialiser
      </button>
      <label class="btn upload-btn">
        📂 Importer Modèle
        <input
          type="file"
          @change="handleModelUpload"
          accept=".obj,.fbx,.glb,.gltf"
          hidden
        >
      </label>
    </template>
  </div>
</template>

<style scoped>
.upload-section {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.upload-btn {
  display: inline-block;
  cursor: pointer;
  padding: 10px 15px;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid #00ff88;
  border-radius: 6px;
  color: #00ff88;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.upload-btn:hover {
  background: rgba(0, 255, 136, 0.2);
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
  transform: translateY(-2px);
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
</style>
