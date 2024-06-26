<template>
  <div>
    <div class="post-header">
      <h3 class="post-title">{{ article.title }}</h3>
      <div class="post-meta">
        <p>作者: {{ article.author?.username || '未知' }}</p>
        <p>{{ formatDate(article.createdAt) }}</p>
      </div>
      <el-button class="backButton" type="primary" @click="goBack">返回</el-button>
    </div>
    <el-divider></el-divider>
    <div class="post-content">
      <p>{{ article.content }}</p>
      <div v-if="article.images.length > 0" class="post-images">
        <el-image
            v-for="image in article.images"
            :key="`http://124.222.74.62${image.url}`"
            :src="`http://124.222.74.62${image.url}`"
            :preview-src-list="article.images.map(img => img.url)"
            class="post-image"
        />
      </div>
    </div>
    <el-divider></el-divider>
    <div class="post-footer">
      <el-button type="danger" @click="deletePost" v-if="canDeletePost">删除帖子</el-button>
      <h3 class="commentTitle">评论</h3>
      <div v-for="comment in article.comments" :key="comment._id" class="comment-item">
        <p>{{ comment.content }}</p>
        <div class="comment-meta">
          <span>作者: {{ comment.author?.username || '未知' }}</span>
          <span>{{ formatDate(comment.createdAt) }}</span>
          <el-button size="mini" type="danger" v-if="comment.author?._id === userStore.userInfo.id || userStore.isAdmin" @click="deleteComment(comment._id)">删除</el-button>
        </div>
      </div>
      <div v-if="userStore.isLoggedIn">
        <el-form @submit.prevent="createComment" class="comment-form">
          <el-row :gutter="10">
            <el-col :span="20">
              <el-form-item>
                <el-input type="textarea" v-model="newComment" placeholder="添加评论" autosize></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-button type="primary" @click="createComment">发布评论</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { createCommentAPI, deleteCommentAPI, getCommentsByArticleIdAPI } from '@/apis/comment';
import { deleteArticleAPI } from '@/apis/article';
import { useUserStore } from '@/stores/user';

const props = defineProps({
  article: Object,
});
const emit = defineEmits(['delete-post', 'go-back']);

const article = ref(props.article);
const newComment = ref('');
const userStore = useUserStore();

const canDeletePost = computed(() => {
  return article.value.author?._id === userStore.userInfo._id || userStore.isAdmin;
});

const fetchComments = async () => {
  try {
    const response = await getCommentsByArticleIdAPI(article.value._id);
    article.value.comments = response.data;
  } catch (error) {
    ElMessage.error('获取评论失败');
  }
};

const createComment = async () => {
  if (!newComment.value) {
    ElMessage.error('评论内容不能为空');
    return;
  }
  try {
    await createCommentAPI({
      articleId: article.value._id,
      content: newComment.value,
    });
    newComment.value = '';
    fetchComments();
    ElMessage.success('评论发布成功');
  } catch (error) {
    ElMessage.error('发布评论失败');
  }
};

const deleteComment = async (commentId) => {
  try {
    await deleteCommentAPI(commentId);
    fetchComments();
    ElMessage.success('评论删除成功');
  } catch (error) {
    ElMessage.error('删除评论失败');
  }
};

const deletePost = async () => {
  try {
    await deleteArticleAPI(article.value._id);
    ElMessage.success('帖子删除成功');
    emit('delete-post');
  } catch (error) {
    ElMessage.error('删除帖子失败');
  }
};

const goBack = () => {
  emit('go-back');
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date) ? '无效日期' : date.toLocaleString();
};

onMounted(() => {
  fetchComments();
});
</script>

<style scoped>
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.post-title {
  flex-grow: 1;
  text-align: center;
}

.post-meta {
  text-align:right;
  font-size: 12px;
  color: #888;
}

.post-content,
.post-footer {
  padding: 10px 0;
}

.post-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.post-image {
  width: 100%;
  height: auto;
  border-radius: 5px;
}

.comment-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.comment-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
}

.comment-form {
  display: flex;
  align-items: flex-end;
  width: 100%;
}

.backButton {
  margin-left: 10px;
}

.el-form-item {
  margin-bottom: 0;
}

.el-input {
  width: 100%;
}
.commentTitle{
 position: relative;
  left: 320px;
}
</style>
