<template>
  <div class="tutorial-overlay" v-if="show">
    <div class="tutorial-container">
      <div class="tutorial-content">
        <h2>{{ tutorial.title }}</h2>
        <ul>
          <li v-for="(line, index) in tutorial.content" :key="index">
            {{ line }}
          </li>
        </ul>
        <button @click="$emit('close')" class="continue-button">
          Continue
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  tutorial: Object
})

defineEmits(['close'])
</script>

<style scoped>
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.tutorial-container {
  background: #1a1a1a;
  border: 4px solid #333;
  border-radius: 8px;
  padding: 40px;
  max-width: 500px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
}

.tutorial-content {
  color: white;
  text-align: center;
}

.tutorial-content h2 {
  color: #9b59b6;
  margin-bottom: 20px;
  font-size: 24px;
}

.tutorial-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.tutorial-content li {
  margin: 10px 0;
  line-height: 1.4;
  padding-left: 20px;
  position: relative;
}

.tutorial-content li:before {
  content: "→";
  position: absolute;
  left: 0;
  color: #9b59b6;
}

.continue-button {
  margin-top: 30px;
  padding: 10px 30px;
  background: #9b59b6;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 16px;
  transition: all 0.3s ease;
}

.continue-button:hover {
  background: #d6b4e7;
  transform: translateY(-2px);
}
</style> 