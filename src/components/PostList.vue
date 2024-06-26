<template>
  <div class="article-list">
    <el-card
        v-for="article in articles"
        :key="article._id"
        class="article-card"
        @click="viewPost(article)"
        shadow="always">
      <div class="article-header">
        <h3>{{ article.title }}</h3>
        <p>作者: {{ article.author?.username || '未知' }}</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getAllArticlesAPI } from '@/apis/article';

const emit = defineEmits(['view-post']);

const articles = ref([]);
const activeNames = ref([]);

const fetchArticles = async () => {
  try {
    const response = await getAllArticlesAPI();
    articles.value = response.data;
  } catch (error) {
    ElMessage.error('获取帖子失败');
  }
};

const viewPost = (article) => {
  emit('view-post', article);
};

onMounted(() => {
  fetchArticles();
});
</script>

<style scoped>
.article-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.article-card {
  cursor: pointer;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.article-header h3 {
  margin: 0;
}

.article-header p {
  margin: 0;
  font-size: 14px;
  color: #888;
}
</style>
