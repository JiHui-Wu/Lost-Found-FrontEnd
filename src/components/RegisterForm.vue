  <template>
   <div class="content">
    <div class="info">
          <div class="greeting">欢迎回来!</div>
          <div class="message">已有账号？立即登录，加入我们!</div>
          <el-button type="text" @click="changeToLogin">登录</el-button>
        </div>
    <div class="form">
      <div class="sysname">TrackMyItems</div>
      <div class="btitle">账户注册</div>
      <el-form :model="form" ref="registerForm" label-width="auto">
        <el-form-item label="邮箱" prop="email" :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' }, { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
          <el-input v-model="form.email" />
        </el-form-item>

        <el-form-item label="用户名" prop="username" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
          <el-input v-model="form.username" />
        </el-form-item>

        <el-form-item label="密码" prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }]">
          <el-input type="password" v-model="form.password" />
        </el-form-item>

        <el-form-item label="联系方式" prop="contact" :rules="[{ required: true, message: '请输入联系方式', trigger: 'blur' }]">
          <el-input v-model="form.contact" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitRegisterForm">注册</el-button>
          <el-button @click="resetRegisterForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
   </div>
  </template>

  <script setup>
  import { reactive, ref } from 'vue';
  import { registerAPI } from '@/apis/user.js';
  import { ElMessage } from 'element-plus';
  let emits=defineEmits(['changePage'])
  const form = reactive({
    email: '',
    username: '',
    password: '',
    contact: ''
  });

  const registerForm = ref(null);

  const submitRegisterForm = () => {
    registerForm.value.validate(async (valid) => {
      if (valid) {
        try {
          const response = await registerAPI(form);
          ElMessage.success(response.message || '注册成功');
          changeToLogin()
        } catch (error) {
          ElMessage.error(error.message || '注册失败');
        }
      } else {
        ElMessage.error('请检查输入');
      }
    });
  };
  const changeToLogin = () => {
    emits('changePage',true)
  }
  const resetRegisterForm = () => {
    registerForm.value.resetFields();
  };
  </script>

  <style scoped>
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
    margin-bottom: 35px;
    position: relative;
    top: 20px;
  }

  .btitle {
    color: #333;
    font-size: 1.5em;
    font-weight: 600;
    margin-top: 10px;
    margin-bottom: 60px;
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
  .el-button{
    margin: 20px 20px 30px 50px
  }
  </style>
