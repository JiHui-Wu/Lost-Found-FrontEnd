<template>
  <div class="user-list">
    <h2>用户列表</h2>
    <el-row :gutter="20">
      <el-col :span="6" v-for="(user, index) in users" :key="index">
        <el-card @click="() => showUserDetails(user)">
          <h4>{{ user.username }}</h4>
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户详情对话框 -->
    <el-dialog title="用户详情" v-model="showDetails">
      <p><strong>邮箱:</strong> {{ userDetails.email }}</p>
      <p><strong>联系方式:</strong> {{ userDetails.contact }}</p>
      <p><strong>密码:</strong> {{ userDetails.password }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteUser(userDetails.email)">删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox, ElRow, ElCol, ElCard, ElDialog, ElButton } from 'element-plus';
import { getAllUsersAPI, deleteUserByEmailAPI } from '@/apis/user';

const users = ref([]);
const userDetails = ref({});
const showDetails = ref(false);

const fetchUsers = async () => {
  try {
    const response = await getAllUsersAPI();
    if (response && response.data && response.data.users) {
      users.value = response.data.users;
    }
  } catch (error) {
    ElMessage.error('获取用户列表失败');
  }
};

const showUserDetails = (user) => {
  userDetails.value = user;
  showDetails.value = true;
};

const deleteUser = async (email) => {
  ElMessageBox.confirm(
    '您确定要删除这个用户吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await deleteUserByEmailAPI(email);
      fetchUsers(); // 重新获取用户列表以反映删除操作
      ElMessage.success('用户删除成功');
      showDetails.value = false;
    } catch (error) {
      ElMessage.error('用户删除失败');
      console.error('Failed to delete user:', error);
    }
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};

onMounted(() => {
  fetchUsers();
});
</script>

<style>
.user-list {
  margin: 20px;
  padding: 20px;
}

.el-card {
  cursor: pointer;
  text-align: center;
}
</style>
