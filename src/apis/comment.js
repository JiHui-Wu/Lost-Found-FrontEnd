import request from '@/utils/http';

// 创建新评论
export const createCommentAPI = (commentData) => {
    return request({
        url: '/comments',
        method: 'POST',
        data: commentData
    });
};

// 删除评论
export const deleteCommentAPI = (commentId) => {
    return request({
        url: `/comments/${commentId}`,
        method: 'DELETE'
    });
};


// 获取指定文章的所有评论
export const getCommentsByArticleIdAPI = (articleId) => {
    return request({
        url: `/comments/article/${articleId}`,
        method: 'GET'
    });
};
