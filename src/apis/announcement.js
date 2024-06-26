import request from '@/utils/http';

// 发布公告
export const createAnnouncementAPI = (announcementData) => {
    return request({
        url: '/announcements',
        method: 'POST',
        data: announcementData,
    });
};

// 获取所有公告
export const getAllAnnouncementsAPI = () => {
    return request({
        url: '/announcements',
        method: 'GET',
    });
};

// 更新公告
export const updateAnnouncementAPI = (announcementId, announcementData) => {
    return request({
        url: `/announcements/${announcementId}`,
        method: 'PUT',
        data: announcementData,
    });
};

// 删除公告
export const deleteAnnouncementAPI = (announcementId) => {
    return request({
        url: `/announcements/${announcementId}`,
        method: 'DELETE',
    });
};