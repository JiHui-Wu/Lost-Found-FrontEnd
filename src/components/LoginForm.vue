<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { loginAPI } from '@/apis/user.js'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
const router = useRouter();
let emits = defineEmits(['changePage'])
const userStore = useUserStore()
const form = reactive({
  email: '',
  password: ''
})

const loginForm = ref(null)
//添加键盘监听事件
onMounted(() => {
  window.addEventListener('keydown', keyDown)
})
const keyDown = (e) => {
  //如果是回车则执行登录方法
  if (e.keyCode === 13) {
    submitLoginForm()
  }
}
onUnmounted(() => {
  window.removeEventListener('keydown', keyDown, false)
})
const submitLoginForm = () => {
  loginForm.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await loginAPI(form);
        console.log('登录成功：', response);
        router.replace('/');
        userStore.setLoginStatus(true)
        if (response.data.token) {
          userStore.setUserInfo(response.data); // 使用 response.data 设置用户信息和 Token
          ElMessage.success(response.data.message || '登录成功');
        } else {
          console.error('Token not found in response');
          ElMessage.error('Token not found');
        }
      } catch (error) {
        console.error('登录失败：', error);
        ElMessage.error(error.message || '登录失败');
      }
    } else {
      ElMessage.error('请检查输入');
    }
  });
};

const resetForm = () => {
  loginForm.value.resetFields()
}

const changeToRegister = () => {
  emits('changePage', false)
}

</script>

<template>
  <div class="content">
    <div class="form">
      <div class="sysname">TrackMyItems</div>
      <div class="btitle">账户登录</div>
      <!-- 添加 ref="loginForm" -->
      <el-form :model="form" ref="loginForm" label-width="auto">
        <!-- 添加 prop 属性来指定校验字段 -->
        <el-form-item label="邮箱" prop="email"
          :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' }, { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
          <el-input v-model="form.email" />
        </el-form-item>

        <el-form-item label="密码" prop="password"
          :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }]">
          <el-input type="password" v-model="form.password" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitLoginForm">登录</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="forget-password">若忘记密码请联系管理员</div>
    </div>
    <div class="info">
      <div class="greeting">你好，朋友!</div>
      <div class="message">开始注册,找回你丢失的东西</div>
      <el-button type="text" @click="changeToRegister">注册</el-button>
    </div>
  </div>
</template>

<style scoped>
.forget-password {
  margin-top: 15px;
  font-size: 0.8em;
  color: #333;
}

.content {
  display: flex;
  width: 800px;
  height: 500px;
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
}

.form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.info {
  flex: 1;
  background-color: #add8e6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
}

.sysname {
  font-weight: bolder;
  color: rgb(61, 207, 146);
  font-size: 2em;
  margin-bottom: 50px;
}

.btitle {
  color: #333;
  font-size: 1.5em;
  font-weight: 600;
  margin-bottom: 70px;
}

.greeting {
  margin-bottom: 15px;
  font-size: 1.5em;
  color: #333;
}

.message {
  margin-bottom: 20px;
  font-size: 1em;
  color: #333;
}

.el-form {
  margin: 0;
}

.el-button {
  margin: 20px 20px 30px 50px
}
</style>
