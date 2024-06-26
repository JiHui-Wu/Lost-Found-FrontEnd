<template>
  <div class="content">
    <div class="form">
      <div class="lost-item-container">
        <publish-item
            :submitFunction="publishLostItem"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import publishItem from '../components/publishItem.vue'
import { publishLostItem } from '@/apis/lost';

</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-image: url('../assets/iceberg-404966_1920.jpg');
}

.form {
  max-width: 800px;
  padding: 20px;
}

.lost-item-container {
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
