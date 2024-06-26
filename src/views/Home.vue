<template>
  <div class="home">
    <div class="header">
      <div class="welcome">欢迎来到 TrackMyItems</div>
      <div class="navigation">
        <router-link to="/lost" class="nav-link" :class="{ active: isActive('/lost') }">您丢失了物品?</router-link>
        <router-link to="/" class="nav-link" :class="{ active: isActive('/') }">首页</router-link>
        <router-link to="/found" class="nav-link" :class="{ active: isActive('/found') }">您捡到了物品?</router-link>
        <router-link to="/forum" class="nav-link" :class="{ active: isActive('/forum') }">论坛</router-link>
        <el-button @click="toggleFilesPanel" type="info">平台文件</el-button>
      </div>
      <div class="user-info">
        <router-link v-if="isLoggedIn" to="/selfcenter/profile" class="user-button">
          {{ userStore.userInfo.username }}
        </router-link>
        <router-link to="/login" class="login-link" v-if="!isLoggedIn">登录/注册</router-link>
        <el-button @click="logout" v-if="isLoggedIn" type="warning">退出登录</el-button>
      </div>
    </div>
    <div class="content-area">
      <router-view></router-view>
      <div class="items-container" v-if="route.matched.length <= 1">
        <div class="row">
          <div class="img-component item">
            <img src="../assets/51925652895_0a20276e6d_c.jpg" alt=""/>
          </div>
          <AnnouncementsDisplay class="announcement-component item"/>
        </div>
        <div class="row">
          <FoundItemsPreview class="items-preview item"/>
          <LostItemsPreview class="items-preview item"/>
        </div>
      </div>
    </div>

    <!-- 可展开的文件列表面板 -->
    <div v-if="showFilesPanel" class="files-panel">
      <el-table :data="fileList">
        <el-table-column prop="name" label="文件名" width="180"></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{row}">
            <el-button @click="download(row.name)" size="mini">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getFiles, downloadFile } from '@/apis/file';
import { useUserStore } from '@/stores/user';
import LostItemsPreview from '@/components/LostItemsPreview.vue';
import FoundItemsPreview from '@/components/FoundItemsPreview.vue';
import AnnouncementsDisplay from '@/components/AnnouncementsDisplay.vue';

const route = useRoute();
const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);
const showFilesPanel = ref(false);
const fileList = ref([]);

const logout = () => {
  userStore.clearUserInfo();
  userStore.setLoginStatus(false);
};

const isActive = (path) => {
  return route.path === path;
};

const toggleFilesPanel = () => {
  showFilesPanel.value = !showFilesPanel.value;
  if (showFilesPanel.value && fileList.value.length === 0) {
    fetchFileList();
  }
};

const fetchFileList = async () => {
  try {
    const data = await getFiles();
    fileList.value = data;
  } catch (error) {
    console.error('Failed to fetch files:', error);
  }
};

const download = async (fileName) => {
  try {
    await downloadFile(fileName);
    console.log('File downloaded successfully');
  } catch (error) {
    console.error('Failed to download file:', error);
  }
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.header {
  flex: 0 0 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 50px;
  background-color: #f6ac98;
}

.navigation,
.user-info {
  display: flex;
  align-items: center;
}

.welcome {
  font-size: 20px;
  font-family: 楷体;
}

.welcome,
.nav-link,
.user-button,
.login-link,
.el-button {
  margin: 0 15px;
  color: #fff;
}

.nav-link,
.user-button,
.login-link,
.el-button {
  padding: 5px 15px;
  border-radius: 5px;
  text-decoration: none;
  background-color: #e66549;
}

.nav-link:hover,
.user-button:hover,
.login-link:hover,
.el-button:hover {
  background-color: #cf4921;
}

.nav-link.active {
  background-color: #7becbf;
}

.content-area {
  flex: 1;
  overflow: auto;
}

.items-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
}

.row {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.item {
  width: 49%;
  display: flex;
  flex-direction: column;
}

.img-component img {
  width: 102%;
  height: auto;
}

.announcement-component,
.items-preview {
  padding: 10px;
  flex-grow: 1;
}

.files-panel {
  margin-top: 10px;
  background-color: #f4f4f4;
  border: 1px solid #ccc;
  padding: 10px;
}
</style>
