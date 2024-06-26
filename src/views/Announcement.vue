<template>
    <div class="announcement-page">
        <!-- 公告发布/编辑表单 -->
        <el-form :model="form" ref="announcementForm" label-width="100px" class="form">
            <el-form-item label="标题" required>
                <el-input v-model="form.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="内容" required>
                <el-input type="textarea" v-model="form.content" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSubmitForm">发布/更新</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 公告列表 -->
        <el-table :data="announcements" style="width: 100%" stripe>
            <el-table-column prop="title" label="标题" width="180"></el-table-column>
            <el-table-column prop="content" label="内容"></el-table-column>
            <el-table-column label="操作" width="180">
                <template #default="{ row }">
                    <el-button size="small" @click="handleEdit(row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(row._id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { createAnnouncementAPI, getAllAnnouncementsAPI, deleteAnnouncementAPI, updateAnnouncementAPI } from '@/apis/announcement';

const form = ref({ title: '', content: '' });
const announcements = ref([]);
const isEditing = ref(false);
const editingId = ref('');
const announcementForm = ref(null);

onMounted(async () => {
    await fetchAnnouncements();
});

const fetchAnnouncements = async () => {
    const response = await getAllAnnouncementsAPI();
    announcements.value = response.data || [];
};

const handleSubmitForm = async () => {
    if (isEditing.value) {
        await updateAnnouncement(editingId.value, form.value);
    } else {
        await createAnnouncementAPI(form.value);
    }
    await fetchAnnouncements();
    ElMessage.success('操作成功');
    resetForm();
};

const handleEdit = (announcement) => {
    form.value.title = announcement.title;
    form.value.content = announcement.content;
    isEditing.value = true;
    editingId.value = announcement._id;
};

const updateAnnouncement = async (id, data) => {
    await updateAnnouncementAPI(id, data);
};

const handleDelete = async (id) => {
    await ElMessageBox.confirm('确定要删除这条公告吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    });
    await deleteAnnouncementAPI(id);
    await fetchAnnouncements();
    ElMessage.success('删除成功');
    resetForm();
};

const resetForm = () => {
    form.value = { title: '', content: '' };
    isEditing.value = false;
    editingId.value = '';
    if (announcementForm.value) {
        announcementForm.value.resetFields();
    }
};
</script>

<style scoped>
.announcement-page {
    padding: 20px;
    background-color: #f5f5f5;
    /* 背景颜色 */
}

.form {
    margin-bottom: 20px;
    background-color: #ffffff;
    /* 表单背景颜色 */
    padding: 20px;
    border-radius: 8px;
    /* 边角圆润 */
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    /* 阴影效果 */
}

.el-form-item {
    margin-bottom: 15px;
    /* 表单项间距 */
}

.el-input,
.el-textarea {
    border-radius: 4px;
    /* 输入框和文本域圆角 */
}

.el-button {
    margin-right: 10px;
    /* 按钮间距 */
}

.el-button:hover {
    filter: brightness(90%);
    /* 按钮悬浮效果 */
}

.el-table {
    background-color: #ffffff;
    /* 表格背景颜色 */
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    /* 表格阴影效果 */
    border-radius: 8px;
    /* 表格边角圆润 */
}
</style>