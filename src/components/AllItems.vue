<script setup>
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import router from '@/router';

const props = defineProps({
  fetchItems: Function,
  searchPlaceholder: String,
  locationLabel: String,
  timeLabel: String,
  timeProp: String,
  messageType: String,
  sendMessage: Function,
});

const dialogVisible = ref(false);
const contactDialogVisible = ref(false);
const selectedItem = ref(null);
const messageContent = ref('');
const items = ref([]);
const searchQuery = ref('');

onMounted(async () => {
  const response = await props.fetchItems();
  items.value = response.data;
});

const filteredItems = computed(() => {
  return items.value.filter(item => {
    return (
        item.item_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
});

const goHome = () => {
  router.push('/');
};

const showDialog = (item) => {
  selectedItem.value = item;
  dialogVisible.value = true;
};

const openContactDialog = () => {
  contactDialogVisible.value = true;
};

const sendMsg = async () => {
  if (!selectedItem.value || !selectedItem.value.contact_info) {
    ElMessage.error('接收者联系方式信息缺失');
    return;
  }

  const response = await props.sendMessage(
      selectedItem.value.email,
      messageContent.value,
      selectedItem.value._id,
      props.messageType
  );

  if (response && response.status === 201) {
    ElMessage.success('消息发送成功');
    contactDialogVisible.value = false;
    messageContent.value = '';
  } else {
    ElMessage.error('消息发送失败');
  }
};
</script>

<template>
  <div class="content">
    <el-button class="home-button" type="primary" @click="goHome">返回首页</el-button>
    <div class="search-container">
      <el-input v-model="searchQuery" :placeholder="searchPlaceholder" class="search-input"></el-input>
    </div>
    <div class="form">
      <el-table :data="filteredItems" style="width: 100%">
        <el-table-column prop="item_name" label="物品名称" width="200" />
        <el-table-column prop="location" :label="locationLabel" width="200" />
        <el-table-column :label="timeLabel" width="200">
          <template #default="{ row }">
            {{ new Date(row[timeProp]).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="照片" width="200">
          <template #default="{ row }">
            <img v-if="row.image_path" :src="`http://124.222.74.62/${row.image_path}`" alt="照片预览" class="item-image" />
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button @click="showDialog(row)" type="primary" size="mini">详细信息</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 详细信息对话框 -->
      <el-dialog v-model="dialogVisible" title="详细信息" width="50%">
        <div v-if="selectedItem" class="dialog-content">
          <p><strong>物品名称:</strong> {{ selectedItem.item_name }}</p>
          <p><strong>{{ locationLabel }}:</strong> {{ selectedItem.location }}</p>
          <p><strong>{{ timeLabel }}:</strong> {{ new Date(selectedItem[timeProp]).toLocaleString() }}</p>
          <p><strong>描述:</strong> {{ selectedItem.description }}</p>
          <p><strong>联系方式:</strong> {{ selectedItem.contact_info }}</p>
          <img v-if="selectedItem.image_path" :src="`http://124.222.74.62/${selectedItem.image_path}`" alt="照片预览"
               class="item-image" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="openContactDialog" size="small">留言</el-button>
          <el-button type="info" @click="dialogVisible = false" size="small">关闭</el-button>
        </span>
      </el-dialog>

      <!-- 联系发布者对话框 -->
      <el-dialog v-model="contactDialogVisible" title="发送消息" width="30%">
        <el-input type="textarea" v-model="messageContent" placeholder="请输入消息内容"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="contactDialogVisible = false" size="small">取消</el-button>
          <el-button type="primary" @click="sendMsg" size="small">发送</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>



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

.search-container {
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
}

.form {
  margin-top: 20px;
}

.search-input {
  width: 100%;
}

.item-image {
  width: 100px;
  height: auto;
}

.dialog-content {
  padding: 10px;
}

.dialog-footer {
  justify-content: flex-end;
}
</style>
