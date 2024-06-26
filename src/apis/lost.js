import request from '@/utils/http';

// 发布丢失物品
export const publishLostItem = (formData) => {
    return request({
        url: '/items/publishLostItem',
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// 获取所有丢失的物品
export const getAllLostItems = () => {
    return request({
        url: '/items/lostItems',
        method: 'GET'
    });
};

// 获取当前用户发布的丢失的物品
export const getMyLostItems = () => {
    return request({
        url: '/items/myLostItems',
        method: 'GET'
    });
};


