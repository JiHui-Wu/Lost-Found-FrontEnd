<template>
  <div class="main-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" :collapse="isCollapse">
        <!-- 首页 -->
        <el-menu-item index="1" @click="goToRoute('/')">
          <el-icon>
            <location />
          </el-icon>
          <span>回到首页</span>
        </el-menu-item>
        <!-- 我的发布 -->
        <el-menu-item index="2" @click="goToRoute('/selfcenter/profile')">
          <el-icon><icon-menu /></el-icon>
          <span>我的发布</span>
        </el-menu-item>
        <!-- 个人邮箱 -->
        <el-menu-item index="5" @click="goToRoute('/selfcenter/receivedmessages')">
          <el-icon>
            <Checked />
          </el-icon>
          <span>个人邮箱</span>
        </el-menu-item>
        <!-- 个人信息 -->
        <el-menu-item index="3" @click="goToRoute('/selfcenter/selfinfo')">
          <el-icon>
            <document />
          </el-icon>
          <span>个人信息</span>
        </el-menu-item>
        <!-- 管理员模块 -->
        <div v-if="isAdmin">
          <el-menu-item index="4" @click="goToRoute('/selfcenter/usermanagement')">
            <el-icon>
              <setting />
            </el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="6" v-if="isAdmin" @click="goToRoute('/selfcenter/itemmanagement')">
            <el-icon>
              <setting />
            </el-icon>
            <span>物品管理</span>
          </el-menu-item>
          <!-- 发布公告 -->
          <el-menu-item index="7" v-if="isAdmin" @click="goToRoute('/selfcenter/announcement')">
            <el-icon>
              <document />
            </el-icon>
            <span>发布公告</span>
          </el-menu-item>
          <!-- 上传活动文件 -->
          <el-menu-item index="8" v-if="isAdmin" @click="goToRoute('/selfcenter/announcementupload')">
            <el-icon>
              <upload />
            </el-icon>
            <span>上传文件</span>
          </el-menu-item>
        </div>
      </el-menu>
    </aside>
    <!-- 主内容区 -->
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  Checked, Upload
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user';

const isCollapse = ref(false)
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
let isAdmin = ref(userStore.isAdmin)


const menuIndexMap = {
  '/': '1',
  '/selfcenter/profile': '2',
  '/selfcenter/receivedmessages': '5',
  '/selfcenter/selfinfo': '3',
  '/selfcenter/usermanagement': '4',
  '/selfcenter/itemmanagement': '6',
  '/selfcenter/announcement': '7',
  '/selfcenter/announcementupload': '8',
};

const activeIndex = computed(() => menuIndexMap[route.path] || '1');

const goToRoute = (path: string) => {
  router.push(path);
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  /* 使得元素的宽高包含内边距和边框 */
}

html,
body {
  height: 100%;
  overflow: hidden;
  /* 防止 html 或 body 的滚动 */
}

.main-layout {
  display: flex;
  height: 100vh;
  /* 视口高度 */
  overflow: hidden;
  /* 避免主布局产生滚动条 */
}

.sidebar {
  width: 200px;
  overflow: auto;
  /* 如果侧边栏内容过多，允许滚动 */
  background-color: #f4f4f5;
}

.radio-group-container {
  width: 100%;

}

.main-content {
  flex: 1;
  overflow: auto;
  /* 允许内容区滚动 */
}
</style>
