import request from '@/utils/http';

// 获取所有帖子
export const getAllArticlesAPI = () => {
    return request({
        url: '/articles',
        method: 'GET'
    });
};

// 创建新帖子
export const createArticleAPI = (articleData) => {
    return request({
        url: '/articles',
        method: 'POST',
        data: articleData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// 删除帖子
export const deleteArticleAPI = (articleId) => {
    return request({
        url: `/articles/${articleId}`,
        method: 'DELETE'
    });
};

// 获取帖子详情
export const getArticleAPI = (articleId) => {
    return request({
        url: `/articles/${articleId}`,
        method: 'GET'
    });
};

// 更新帖子
export const updateArticleAPI = (articleId, articleData) => {
    return request({
        url: `/articles/${articleId}`,
        method: 'PUT',
        data: articleData
    });
};
