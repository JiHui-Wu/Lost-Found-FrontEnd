<template>
    <div class="announcements-display">
        <h2>最近公告</h2>
        <el-timeline>
            <el-timeline-item v-for="announcement in announcements" :key="announcement._id"
                :timestamp="new Date(announcement.createdAt).toLocaleDateString()" placement="top">
                <el-card>
                    <h3>{{ announcement.title }}</h3>
                    <p>{{ announcement.content }}</p>
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ElTimeline, ElTimelineItem, ElCard } from 'element-plus';
import { getAllAnnouncementsAPI } from '@/apis/announcement';

const announcements = ref([]);

onMounted(async () => {
    try {
        const response = await getAllAnnouncementsAPI();
        announcements.value = response.data;
    } catch (error) {
        console.error('获取公告数据失败:', error);
    }
});
</script>

<style scoped>
.announcements-display {
    overflow: auto;
    max-height: 100%;
    padding: 10px;
}

.announcements-display h2 {
    margin-bottom: 16px;
    text-align: center;
    color: #333;
}

.announcements-display .el-card {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.announcements-display h3 {
    font-size: 18px;
    color: #333;
}

.announcements-display p {
    font-size: 14px;
    color: #666;
}

.announcements-display .el-timeline-item {
    margin-bottom: 20px;
}
</style>