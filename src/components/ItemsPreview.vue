<template>
  <div class="items-preview">
    <h3>{{ title }}</h3>
    <el-table :data="items.slice(0, 5)" style="width: 100%">
      <el-table-column prop="item_name" label="物品名称" width="200" />
      <el-table-column prop="location" :label="locationLabel" width="200" />
      <el-table-column :label="timeLabel" width="200">
        <template #default="{ row }">
          {{ new Date(row[timeProp]).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="照片" width="200">
        <template #default="{ row }">
          <img v-if="row.image_path" :src="`http://124.222.74.62/${row.image_path}`" alt="照片预览"
               style="width: 50px; height: auto;" />
          <span v-else>无</span>
        </template>
      </el-table-column>
    </el-table>
    <el-button class="more-button" type="primary" @click="go">查看更多</el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  title: String,
  fetchItems: Function,
  locationLabel: String,
  timeLabel: String,
  timeProp: String,
  routePath: String
});

const router = useRouter();
const items = ref([]);

onMounted(async () => {
  const response = await props.fetchItems();
  items.value = response.data;
});

const go = () => {
  router.push(props.routePath);
};
</script>

<style scoped>
.items-preview {
  overflow: auto;
  max-height: 100%;
  width: 100%;
  /* 确保宽度适应父容器 */
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.items-preview h3 {
  margin: 10px 0;
  text-align: center;
}

.el-table {
  margin: 0 auto;
  display: inline-block;
}

.more-button {
  margin: 10px auto;
  display: block;
}

h3 {
  text-align: center;
}
</style>

