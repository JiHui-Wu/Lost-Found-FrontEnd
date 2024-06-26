import request from '@/utils/http'
export const loginAPI = ({ email, password }) => {
    return request({
        url: '/users/login',
        method: 'POST',
        data: {
            email,
            password
        }
    })
}
export const registerAPI = (userData) => {
    return request({
        url: '/users/register',
        method: 'POST',
        data: userData,
    });
};
export const deleteItemAPI = (itemId, itemType) => {
    const url = `/items/deleteItem/${itemType}/${itemId}`;
    return request({
        url: url,
        method: 'DELETE',
    });
};
export const getUserProfileAPI = () => {
    return request({
        url: '/users/profile',
        method: 'GET',
    });
};

export const updateUserProfileAPI = (userData) => {
    return request({
        url: '/users/profile',
        method: 'PUT',
        data: userData,
    });
};
// 获取所有用户的 API 函数
export const getAllUsersAPI = () => {
    return request({
        url: '/permissions/allusers',
        method: 'GET',
    });
};

// 通过 email 删除用户的 API 函数
export const deleteUserByEmailAPI = (email) => {
    return request({
        url: `/permissions/deleteuser/${email}`,
        method: 'DELETE',
    });
};

