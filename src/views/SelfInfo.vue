<template>
  <div class="content">
    <div class="user-info">
      <h2>个人信息</h2>
      <div v-if="userProfile" class="info-section">
        <p><strong>用户名:</strong> {{ userProfile.username }}</p>
        <p><strong>邮箱:</strong> {{ userProfile.email }}</p>
        <p><strong>联系方式:</strong> {{ userProfile.contact }}</p>
      </div>
      <el-button @click="showDialog = true">更新信息</el-button>

      <el-dialog title="更新个人信息" v-model="showDialog">
        <el-form ref="updateForm">
          <el-form-item label="用户名">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="form.contact"></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input type="password" v-model="form.newPassword" placeholder="请输入新密码"
              autocomplete="new-password"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input type="password" v-model="form.confirmNewPassword" placeholder="请再次输入新密码"
              autocomplete="new-password"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelUpdate">取消</el-button>
          <el-button type="primary" @click="updateProfile">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getUserProfileAPI, updateUserProfileAPI } from '@/apis/user';

const userProfile = ref(null);
const form = ref({ username: '', email: '', contact: '', newPassword: '', confirmNewPassword: '' });
const showDialog = ref(false);

onMounted(async () => {
  try {
    const response = await getUserProfileAPI();
    if (response && response.data && response.data.user) {
      userProfile.value = response.data.user;
      form.value = { ...response.data.user, newPassword: '', confirmNewPassword: '' };
    }
  } catch (error) {
    ElMessage.error('获取用户信息失败');
    console.error('Failed to fetch user profile:', error);
  }
});

const updateProfile = async () => {
  if (form.value.newPassword !== form.value.confirmNewPassword) {
    ElMessage.error('两次输入的新密码不一致！');
    return;
  }

  try {
    const response = await updateUserProfileAPI({
      username: form.value.username,
      email: form.value.email,
      contact: form.value.contact,
      password: form.value.newPassword,  // 添加密码字段
    });

    if (response && response.data) {
      userProfile.value = { ...form.value, newPassword: '', confirmNewPassword: '' };
      showDialog.value = false;
      ElMessage.success('用户信息更新成功');
    }
  } catch (error) {
    ElMessage.error('用户信息更新失败');
    console.error('Failed to update user profile:', error);
  }
};

const cancelUpdate = () => {
  form.value = { ...userProfile.value, newPassword: '', confirmNewPassword: '' };
  showDialog.value = false;
};
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url('/src/assets/iceberg-404966_1920.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}

.user-info {
  padding: 200px;
  max-width: 500px;
  margin: 20px auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
}

.info-section {
  text-align: left;
  margin: 20px 0;
}

.info-section p {
  margin: 10px 0;
  line-height: 1.5;
}

.dialog-footer {
  text-align: right;
}
</style>
