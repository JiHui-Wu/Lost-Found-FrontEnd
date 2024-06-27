<template>
  <div class="content">
    <!-- 用户发布的失物招领信息 -->
    <div class="form">
      <h2 style="text-align: center;">我的失物</h2>
      <el-table :data="myLostItems" style="width: 100%">
        <el-table-column prop="item_name" label="物品名称" width="200" />
        <el-table-column prop="location" label="丢失位置" width="200" />
        <el-table-column prop="lost_time" label="丢失时间" width="200">
          <template #default="{ row }">
            {{ new Date(row.lost_time).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="照片" width="200">
          <template #default="{ row }">
            <img v-if="row.image_path" :src="`http://124.222.74.62/${row.image_path}`" alt="照片预览"
              style="width: 100px; height: auto;" />
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button @click="deleteItem(row, 'lost')" type="danger">删除该条信息</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 用户发布的寻物启事信息 -->
    <div class="form">
      <h2 style="text-align: center;">我的招领</h2>
      <el-table :data="myFoundItems" style="width: 100%">
        <el-table-column prop="item_name" label="物品名称" width="200" />
        <el-table-column prop="location" label="发现位置" width="200" />
        <el-table-column prop="found_time" label="发现时间" width="200">
          <template #default="{ row }">
            {{ new Date(row.found_time).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="照片" width="200">
          <template #default="{ row }">
            <img v-if="row.image_path" :src="`http://124.222.74.62/${row.image_path}`" alt="照片预览"
              style="width: 100px; height: auto;" />
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button @click="deleteItem(row, 'found')" type="danger">删除该条信息</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElButton, ElMessage, ElMessageBox, ElTable, ElTableColumn } from 'element-plus';
import { deleteItemAPI } from '@/apis/user';
import { getMyFoundItems } from '@/apis/found';
import { getMyLostItems } from '@/apis/lost';

const myLostItems = ref([]);
const myFoundItems = ref([]);

onMounted(async () => {
  await loadItems();
});

const loadItems = async () => {
  myLostItems.value = (await getMyLostItems()).data || [];
  myFoundItems.value = (await getMyFoundItems()).data || [];
};

const deleteItem = (item, type) => {
  ElMessageBox.confirm(
    '确定要删除这条信息吗？',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await deleteItemAPI(item._id, type);
      ElMessage.success('物品删除成功');
      if (type === 'lost') {
        myLostItems.value = myLostItems.value.filter(i => i._id !== item._id);
      } else {
        myFoundItems.value = myFoundItems.value.filter(i => i._id !== item._id);
      }
    } catch (error) {
      console.error('删除物品时发生错误:', error);
      ElMessage.error('删除物品失败');
    }
  }).catch(() => {
    ElMessage.info('取消了删除');
  });
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

.form {
  margin: 20px;
  padding: 20px;
  /* 增加内边距 */
  width: 80%;
  background: rgba(255, 255, 255, 0.8);
  /* 调整背景色的透明度 */
  border-radius: 10px;
  /* 添加圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* 添加阴影 */
}

.el-table {
  margin-top: 20px;
  /* 表格上边距 */
}

.el-table th,
.el-table td {
  padding: 15px;
  /* 表格单元格内边距 */
  border-bottom: 1px solid #f0f0f0;
  /* 单元格底部边框 */
}

.el-table-row:hover {
  background-color: #f0f0f0;
  /* 鼠标悬停行的背景颜色 */
}

.el-button {
  margin-left: 5px;
  transition: background-color 0.3s;
  /* 按钮颜色变化过渡效果 */
}

.el-button:hover {
  background-color: #3399ff;
  /* 按钮悬停时的背景颜色 */
}

.home-button {
  margin: 20px;
}
</style>
