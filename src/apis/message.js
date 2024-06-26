import request from '@/utils/http';

// 发送消息
export const sendMessage = (receiverEmail, content, itemId, itemType) => {
    return request({
        url: '/messages/send',
        method: 'POST',
        data: {
            receiverEmail,
            content,
            item: itemId,
            itemType,
        },
    });
};

// 获取接收到的消息
export const getReceivedMessages = (userEmail) => {
    return request({
        url: '/messages/received',
        method: 'GET',
        params: {
            userEmail: userEmail,
        },
    });
};
// 删除消息
export const deleteMessage = (messageId) => {
    return request({
        url: `/messages/${messageId}`,
        method: 'DELETE',
    });
};