import request from '@/utils/http'

// 发布找到的物品
export const publishFoundItem = (formData) => {
    return request({
        url: '/items/publishFoundItem',
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// 获取所有找到的物品
export const getAllFoundItems = () => {
    return request({
        url: '/items/foundItems',
        method: 'GET'
    });
};

// 获取当前用户发布的找到的物品
export const getMyFoundItems = () => {
    return request({
        url: '/items/myFoundItems',
        method: 'GET'
    });
};

