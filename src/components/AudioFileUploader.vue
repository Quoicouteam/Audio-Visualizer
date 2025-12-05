<script setup>
const emit = defineEmits(['file-uploaded']);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    emit('file-uploaded', file);
  }
};
</script>

<template>
  <label class="btn upload-btn">
    📂 Charger MP3
    <input
      type="file"
      @change="handleFileChange"
      accept="audio/*"
      hidden
    >
  </label>
</template>

<style scoped>
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
