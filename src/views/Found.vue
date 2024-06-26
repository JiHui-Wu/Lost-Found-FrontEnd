<template>
  <div class="content">
    <div class="form">
      <div class="found-item-container">
        <publish-item
            :submitFunction="publishFoundItem"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import publishItem from '../components/publishItem.vue'
import { publishFoundItem } from '@/apis/found';

</script>

<style scoped>
html, body {
  height: 100%;    /* 确保HTML和body元素占据整个视口高度 */
  margin: 0;       /* 移除默认外边距 */
  overflow: hidden;/* 隐藏超出视口的内容，防止滚动条出现 */
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

.found-item-container {
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
