<template>
    <div class="item-management">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="所有找到的物品" name="found">
                <el-table :data="foundItems" style="width: 100%">
                    <el-table-column prop="item_name" label="物品名称"></el-table-column>
                    <el-table-column prop="location" label="发现位置"></el-table-column>
                    <el-table-column prop="found_time" label="发现时间" :formatter="formatDate"></el-table-column>
                    <el-table-column prop="contact_info" label="联系方式"></el-table-column>
                    <el-table-column label="图片">
                        <template #default="{ row }">
                            <el-image v-if="row.image_path" style="width: 50px; height: 50px"
                                :src="getImagePath(row.image_path)" fit="fill">
                            </el-image>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #default="{ row }">
                            <el-button @click="deleteItem(row, 'found')" type="danger" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="所有丢失的物品" name="lost">
                <el-table :data="lostItems" style="width: 100%">
                    <el-table-column prop="item_name" label="物品名称"></el-table-column>
                    <el-table-column prop="location" label="丢失位置"></el-table-column>
                    <el-table-column prop="lost_time" label="丢失时间" :formatter="formatDate"></el-table-column>
                    <el-table-column prop="contact_info" label="联系方式"></el-table-column>
                    <el-table-column label="图片">
                        <template #default="{ row }">
                            <el-image v-if="row.image_path" style="width: 50px; height: 50px"
                                :src="getImagePath(row.image_path)" fit="fill">
                            </el-image>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #default="{ row }">
                            <el-button @click="deleteItem(row, 'lost')" type="danger" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAllFoundItems } from '@/apis/found';
import { getAllLostItems } from '@/apis/lost';
import { deleteItemAPI } from '@/apis/user';

const activeTab = ref('found');
const foundItems = ref([]);
const lostItems = ref([]);

const fetchItems = async () => {
    const foundResponse = await getAllFoundItems();
    const lostResponse = await getAllLostItems();
    foundItems.value = foundResponse.data;
    lostItems.value = lostResponse.data;
};

const deleteItem = async (item, type) => {
    // 显示确认对话框
    ElMessageBox.confirm(
        '您确定要删除这个物品吗？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(async () => {
        // 如果用户点击“确定”，执行删除操作
        try {
            const response = await deleteItemAPI(item._id, type);
            if (response.status === 200) {
                ElMessage.success('删除成功');
                fetchItems(); // 刷新列表
            } else {
                ElMessage.error('删除失败');
            }
        } catch (error) {
            ElMessage.error('删除失败');
            console.error('删除错误:', error);
        }
    }).catch(() => {
        // 如果用户点击“取消”，则不执行任何操作
        ElMessage.info('已取消删除');
    });
};

const handleTabClick = (tab) => {
    activeTab.value = tab.name;
};
const formatDate = (value) => {
    // 检查输入值是否具有found_time或lost_time属性，取决于数据来源
    const dateString = value.found_time || value.lost_time || value;
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
    } else {
        return '日期无效';
    }
};

const getImagePath = (path) => {
    return `http://124.222.74.62/${path}`
};

fetchItems();
</script>

<style scoped>
.item-management {
    margin: 20px;
}

.el-table {
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-table th {
    background-color: #f5f7fa;
}

.el-table-row:hover {
    background-color: #f5f7fa;
}

.el-button {
    border: 1px solid #dcdfe6;
    color: #606266;
    transition: all .3s ease;
}

.el-button:hover {
    border-color: #c0c4cc;
    background-color: #ecf5ff;
    color: #409eff;
}

.el-image {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin: 5px;
}

.el-tabs__header {
    border-bottom: 2px solid #409eff;
}

.el-tabs__item.is-active {
    border-color: #409eff;
    color: #409eff;
}

.el-tabs__item:hover {
    color: #409eff;
}
</style>
