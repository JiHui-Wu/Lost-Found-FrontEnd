<template>
    <div class="home">
      <el-button type="primary" round class="back" @click="back">还没想好?先到处逛逛</el-button>
      <div v-if="islogin">
       <LoginFormVue @changePage="changePage"></LoginFormVue>
      </div>
      <div v-else>
        <RegisterFormVue @changePage="changePage"></RegisterFormVue>
      </div>
    </div>
  </template>

  <script setup>
    import LoginFormVue from '@/components/LoginForm.vue';
    import RegisterFormVue from '@/components/RegisterForm.vue';
    import router from '@/router';
    import { ref } from 'vue';
    let islogin = ref(true)
    let changePage = (val) => {
        islogin.value=val
  }
  const back = () => {
      router.push('/')
    }
  </script>


  <style scoped>
  .home {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-image: url('../assets/iceberg-404966_1920.jpg');
    background-size: cover;
    background-position: center;
  }


  .back{
  background-color: #77e3d7;
  position: absolute; /* 使用绝对定位 */
  top: 10px; /* 距离顶部10px */
  left: 10px; /* 距离左侧10px */
  padding: 10px 20px; /* 增加填充以放大按钮 */
  z-index: 10; /* 确保按钮在其他元素之上 */
  }

  </style>
