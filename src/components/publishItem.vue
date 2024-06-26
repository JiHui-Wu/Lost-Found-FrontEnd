<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" label-position="left" @submit.prevent="submitForm">
    <el-form-item label="物品名称：" prop="item_name">
      <el-input v-model="form.item_name" placeholder="请输入物品名称"></el-input>
    </el-form-item>
    <el-form-item label="地点：" prop="location">
      <el-input v-model="form.location" placeholder="请输入地点"></el-input>
    </el-form-item>
    <el-form-item label="时间：" prop="time">
      <el-date-picker v-model="form.time" type="datetime" placeholder="选择日期时间"></el-date-picker>
    </el-form-item>
    <el-form-item label="物品描述：" prop="description">
      <el-input v-model="form.description" placeholder="请输入物品描述"></el-input>
    </el-form-item>
    <el-form-item label="联系方式：" prop="contact_info">
      <el-input v-model="form.contact_info" placeholder="请输入您的联系方式"></el-input>
    </el-form-item>
    <el-form-item label="上传图片：" prop="image">
      <el-upload
          class="upload-demo"
          :on-change="handleFileChange"
          :file-list="fileList"
          list-type="picture-card"
          action="#"
          ref="uploadRef"
          :before-upload="beforeUpload"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <img v-if="imagePreview" :src="imagePreview" class="preview-image" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit">提交</el-button>
      <el-button type="warning" native-type="reset" @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';
import router from '@/router';

const props = defineProps({
  submitFunction: {
    type: Function,
    required: true,
  }
});

const userStore = useUserStore();
const formRef = ref(null);
const form = ref({
  item_name: '',
  location: '',
  time: '',
  description: '',
  contact_info: '',
  image: null,
});

const resetForm = () => {
  formRef.value?.resetFields();
  fileList.value = [];
  imagePreview.value = ''; // 清空预览图片
};

const fileList = ref([]);
const imagePreview = ref(''); // 用于存储图片预览的URL
const beforeUpload = () => {
  return false;
};

// 处理文件改变事件
const handleFileChange = (file) => {
  if (file) {
    form.value.image = file.raw;
    imagePreview.value = URL.createObjectURL(file.raw);
  }
};

const rules = {
  item_name: [
    { required: true, message: '请输入物品名称', trigger: 'blur' },
  ],
  location: [
    {required: true, message: '请输入地点', trigger: 'blur'},
  ],
  time: [
    {required: true, message: '请选择时间', trigger: 'blur'},
  ],
  description: [
    {required: true, message: '请输入物品描述', trigger: 'blur'},
  ],
  contact_info: [
    {required: true, message: '请输入您的联系方式', trigger: 'blur'},
  ],
};

const submitForm = async () => {
  try {
    await formRef.value.validate(); // 进行表单校验
    const formData = new FormData();
    formData.append('item_name', form.value.item_name);
    formData.append('location', form.value.location);
    formData.append('time', form.value.time.toISOString()); // 确保日期格式正确
    formData.append('description', form.value.description);
    formData.append('contact_info', form.value.contact_info);
    if (form.value.image) {
      formData.append('image', form.value.image);
    }

    const response = await props.submitFunction(formData);
    if (response.status === 201) {
      ElMessage.success('发布成功');
      formRef.value?.resetFields();
      fileList.value = [];
      imagePreview.value = '';
    } else {
      ElMessage.error('发布失败');
    }
  } catch (error) {
    if (!userStore.isLoggedIn) {
      ElMessage.error('请检查你是否登录');
      router.push('/login');
    } else {
      ElMessage.error('请填写表单的所有内容');
    }
  }
};
</script>

<style scoped>
.preview-image {
  max-width: 200px;
  max-height: 200px;
  margin-top: 10px;
}
</style>
