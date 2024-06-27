import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '../router';
import { useUserStore } from '../stores/user';



const http = axios.create({
    baseURL: 'http://124.222.74.62/api', // 确保这里配置正确
    timeout: 60000,
    headers: {'Content-Type': 'application/json'}
});

// 添加请求拦截器，在请求头中添加 token
http.interceptors.request.use(config => {
    const userStore = useUserStore();
    const token = userStore.token;
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 响应拦截器
http.interceptors.response.use(response => {
    return response;
}, error => {
    const userStore = useUserStore();
    const status = error.response ? error.response.status : 0;
    switch (status) {
        case 401:
            // 未授权或令牌失效
            userStore.clearUserInfo();
            router.push('/login');
            ElMessage.error('登录已过期，请重新登录');
            break;
        case 403:
            // 没有权限
            ElMessage.error('您没有权限访问该资源');
            break;
        default:
            // 其他错误
            ElMessage.error(error.response && error.response.data.message || '系统错误');
            break;
    }
    return Promise.reject(error);
});

export default http;
