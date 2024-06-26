<template>
    <div class="received-messages">
        <h2>收到的消息</h2>
        <div v-for="message in receivedMessages" :key="message._id" class="message">
            <el-card shadow="hover" class="message-card">
                <p><strong>发件邮箱地址:</strong> {{ message.senderEmail }}</p>
                <p><strong>内容:</strong> {{ message.content }}</p>
                <!-- 显示物品名称 -->
                <p v-if="message.itemDetails"><strong>物品名称:</strong> {{ message.itemDetails.item_name }}</p>
                <!-- 显示消息接收时间 -->
                <p><strong>收到时间:</strong> {{ formatDate(message.timestamp) }}</p>
                <el-button type="danger" @click="deleteMessageButton(message._id)">已读</el-button>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElCard, ElButton } from 'element-plus';
import { getReceivedMessages, deleteMessage } from '@/apis/message';

const receivedMessages = ref([]);

// 定义格式化时间的方法
const formatDate = (value) => {
    if (value) {
        const date = new Date(value);
        return date.toLocaleString();
    }
    return '时间未知';
};

// 获取收到的消息
const fetchReceivedMessages = async () => {
    try {
        const response = await getReceivedMessages();
        receivedMessages.value = response.data.messages;
    } catch (error) {
        console.error('Failed to fetch received messages:', error);
    }
};

// 删除消息
const deleteMessageButton = async (messageId) => {
    try {
        await deleteMessage(messageId);
        receivedMessages.value = receivedMessages.value.filter(message => message._id !== messageId);
    } catch (error) {
        console.error('Failed to delete message:', error);
    }
};

onMounted(fetchReceivedMessages);
</script>

<style scoped>
.received-messages {
    padding: 20px;
}

.message {
    margin-bottom: 20px;
}

.message-card {
    width: 400px;
    padding: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-button {
    margin-top: 10px;
}
</style>