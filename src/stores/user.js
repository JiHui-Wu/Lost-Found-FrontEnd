import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        userInfo: JSON.parse(localStorage.getItem('userInfo')) || {},
        token: localStorage.getItem('token') || null,
        isLoggedIn: localStorage.getItem('isLoggedIn') === 'true' || false,
        isAdmin: localStorage.getItem('isAdmin') === 'true' || false,  // 添加 isAdmin 状态
    }),
    actions: {
        setUserInfo(data) {
            this.userInfo = data.user;
            this.token = data.token;
            this.isAdmin = data.user.isAdmin;  // 假设 isAdmin 信息包含在 user 对象中
            localStorage.setItem('userInfo', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            localStorage.setItem('isAdmin', this.isAdmin);  // 保存 isAdmin 状态
        },
        setLoginStatus(status) {
            this.isLoggedIn = status;
            localStorage.setItem('isLoggedIn', status);
        },
        clearUserInfo() {
            this.userInfo = {};
            this.token = null;
            this.isLoggedIn = false;
            this.isAdmin = false;  // 清除 isAdmin 状态
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('isAdmin');  // 移除 isAdmin 信息
        },
    },
});