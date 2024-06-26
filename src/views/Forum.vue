<template>
  <div class="common-layout">
    <div class="background-container">
      <div class="background-image"></div>
      <div class="forum-content">
        <el-button v-if="!isCreatingArticle && !selectedArticle" type="primary" @click="openCreateArticlePage" class="create-article-button">发布新帖子</el-button>

        <div v-if="isCreatingArticle">
          <el-card>
            <el-form :model="newArticle">
              <el-form-item label="标题">
                <el-input v-model="newArticle.title"></el-input>
              </el-form-item>
              <el-form-item label="内容">
                <el-input type="textarea" v-model="newArticle.content"></el-input>
              </el-form-item>
              <el-form-item label="上传图片">
                <el-upload
                    action=""
                    list-type="picture-card"
                    :file-list="fileList"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :on-change="handleFileChange"
                    :multiple="true"
                    :limit="5"
                    :auto-upload="false"
                    ref="upload">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </el-form-item>

              <div class="drawer-footer">
                <el-button @click="cancelCreateArticle">取消</el-button>
                <el-button type="primary" @click="createArticle">发布</el-button>
              </div>
            </el-form>
          </el-card>
        </div>

        <div v-else>
          <PostList v-if="!selectedArticle" @view-post="viewPost" />
          <PostDetail v-if="selectedArticle" :article="selectedArticle" @delete-post="deletePost" @go-back="goBack" />
        </div>
      </div>
      <div class="background-image"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import PostList from '@/components/PostList.vue';
import PostDetail from '@/components/PostDetail.vue';
import { createArticleAPI } from '@/apis/article';
import { useUserStore } from '@/stores/user';

const newArticle = ref({
  title: '',
  content: '',
  images: [], // 添加 images 字段
  author: '' // 添加 author 字段
});
const isCreatingArticle = ref(false);
const selectedArticle = ref(null);
const userStore = useUserStore();
const fileList = ref([]);
const dialogImageUrl = ref('');
const dialogVisible = ref(false);

const openCreateArticlePage = () => {
  isCreatingArticle.value = true;
};

const cancelCreateArticle = () => {
  isCreatingArticle.value = false;
};

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url || URL.createObjectURL(file.raw);
  dialogVisible.value = true;
};

const handleRemove = (file) => {
  const index = fileList.value.indexOf(file);
  fileList.value.splice(index, 1);
};

const beforeRemove = (file) => {
  return new Promise((resolve, reject) => {
    if (confirm('确定要删除这张图片吗？')) {
      resolve();
    } else {
      reject();
    }
  });
};

//此处取名要注意
const handleFileChange = (file, newFileList) => {
  fileList.value = newFileList;
};

const createArticle = async () => {
  const formData = new FormData();
  formData.append('title', newArticle.value.title);
  formData.append('content', newArticle.value.content);
  formData.append('author', userStore.userInfo.id);
  // 添加每个文件
  fileList.value.forEach((file) => {
    formData.append('images', file.raw);
  });

  try {
    await createArticleAPI(formData);
    ElMessage.success('文章发布成功');
    isCreatingArticle.value = false;
    fileList.value = []; // 清空文件列表
  } catch (error) {
    ElMessage.error('文章发布失败');
  }
};

const viewPost = (article) => {
  selectedArticle.value = article;
};

const deletePost = () => {
  selectedArticle.value = null;
};

const goBack = () => {
  selectedArticle.value = null;
};
</script>

<style scoped>
.common-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.background-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.background-image {
  flex: 1;
  background-image: url('../assets/pexels-photo-1097930.jpeg');
  background-size: cover;
  background-position: center;
}

.forum-content {
  flex: 2;
  padding: 20px;
  background-color: white;
  overflow-y: auto;
}

.create-article-button {
  margin-bottom: 20px;
}
</style>
