<template>
  <div class="file-upload">
    <el-form :model="form" ref="form" label-width="100px" class="demo-form">
      <el-form-item label="上传文件" :label-width="formLabelWidth">
        <el-upload
            class="upload-demo"
            drag
            :action="null"
            :before-upload="beforeUpload"
            :on-remove="handleRemove"
            :file-list="fileList"
            ref="uploadRef"
            multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-form-item>
      <el-form-item v-if="selectedFile">
        <span>文件名: {{ selectedFile.name }}</span>
        <el-button type="danger" @click="removeFile">移除文件</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">上传文件</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
      <el-progress v-if="uploadProgress > 0" :percentage="uploadProgress"></el-progress>
    </el-form>
    <el-table :data="files" style="width: 100%" v-if="files.length">
      <el-table-column prop="name" label="文件名" width="250"></el-table-column>
      <el-table-column prop="size" label="大小" width="150"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="text" @click="download(row.name)">下载</el-button>
          <el-button type="text" @click="remove(row.name)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import SparkMD5 from 'spark-md5';
import { checkFileExists, deleteFile, downloadFile, getFiles, uploadActivity } from '@/apis/file';

export default {
  setup() {
    const form = reactive({});
    const formLabelWidth = '120px';
    const fileList = ref([]);
    const selectedFile = ref(null);
    const files = ref([]);
    const uploadProgress = ref(0);
    const uploadRef = ref(null);
    const CHUNK_SIZE = 5 * 1024 * 1024; // Each chunk is 5MB

    const beforeUpload = (file) => {
      console.log("beforeUpload file:", file); // Debugging information
      selectedFile.value = {
        name: file.name,
        raw: file,
      };
      fileList.value.push({
        name: file.name,
        raw: file,
      });
      return false; // Prevent automatic upload
    };

    const handleRemove = (file, fileList) => {
      console.log("File removed:", file); // Debugging information
    };

    const removeFile = () => {
      if (uploadRef.value) {
        uploadRef.value.clearFiles();
      }
      selectedFile.value = null;
      fileList.value = [];
    };

    const submitForm = async () => {
      if (!selectedFile.value || !selectedFile.value.raw) {
        ElMessage.error('请选择文件');
        return;
      }

      const file = selectedFile.value.raw;
      if (!(file instanceof Blob)) {
        ElMessage.error('选中的文件不是 Blob 类型');
        return;
      }

      const fileHash = await calculateFileHash(file);
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

      const exists = await checkFileExists(fileHash, totalChunks);
      if (exists) {
        ElMessage.success('文件秒传成功');
        resetForm();
        fetchFiles();
        return;
      }

      const chunks = createFileChunks(file);
      for (let i = 0; i < chunks.length; i++) {
        const formData = new FormData();
        formData.append('file', chunks[i]);
        formData.append('chunkNumber', (i + 1).toString());
        formData.append('totalChunks', totalChunks.toString());
        formData.append('fileName', file.name);
        formData.append('hash', fileHash);

        await uploadActivity(formData, (progressEvent) => {
          uploadProgress.value = Math.round(((i * CHUNK_SIZE + progressEvent.loaded) * 100) / file.size);
        });
      }

      ElMessage.success('文件上传成功');
      resetForm();
      fetchFiles();
    };

    const resetForm = () => {
      if (uploadRef.value) {
        uploadRef.value.clearFiles();
      }
      selectedFile.value = null;
      fileList.value = [];
      uploadProgress.value = 0;
    };

    const fetchFiles = async () => {
      try {
        files.value = await getFiles();
      } catch (error) {
        ElMessage.error('获取文件列表失败');
      }
    };

    const download = async (fileName) => {
      try {
        await downloadFile(fileName);
        ElMessage.success('文件下载成功');
      } catch (error) {
        ElMessage.error('文件下载失败');
      }
    };

    const remove = async (fileName) => {
      try {
        await deleteFile(fileName);
        ElMessage.success('文件删除成功');
        fetchFiles();  // Refresh the file list
      } catch (error) {
        ElMessage.error('文件删除失败');
      }
    };

    const calculateFileHash = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const buffer = e.target.result;
          if (buffer instanceof ArrayBuffer) {
            const spark = new SparkMD5.ArrayBuffer();
            spark.append(buffer);
            const hash = spark.end();
            resolve(hash);
          } else {
            reject(new Error('读取文件数据错误: 不是ArrayBuffer类型'));
          }
        };
        reader.onerror = (e) => reject(e);
        reader.readAsArrayBuffer(file);
      });
    };

    const createFileChunks = (file) => {
      const chunks = [];
      let currentSize = 0;
      while (currentSize < file.size) {
        const chunk = file.slice(currentSize, currentSize + CHUNK_SIZE);
        chunks.push(chunk);
        currentSize += CHUNK_SIZE;
      }
      return chunks;
    };

    onMounted(() => {
      fetchFiles();  // Load files when component is mounted
    });

    return {
      form,
      formLabelWidth,
      fileList,
      selectedFile,
      files,
      uploadProgress,
      uploadRef,
      submitForm,
      resetForm,
      download,
      remove,
      beforeUpload,
      handleRemove,
      removeFile // Ensure removeFile is correctly returned for template use
    };
  }
};
</script>

<style scoped>
.file-upload {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.el-upload {
  width: 100%;
  height: 200px;
}

.el-upload__text {
  fontSize: 16px;
  color: #606266;
}

.el-button {
  marginRight: 10px;
}
</style>
