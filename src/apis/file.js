import http from '../utils/http.js';

// 上传文件块
export const uploadActivity = async (formData, onUploadProgress) => {
    try {
        const response = await http.post('/files/upload-chunk', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,  // 监听上传进度
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 检查文件是否存在（秒传），同时确认所有必需的块是否已上传
export const checkFileExists = async (hash, totalChunks) => {
    try {
        const response = await http.post('/files/check-file', { hash, totalChunks });
        return response.data.exists;  // 确保后端返回的是基于所有块的存在判断
    } catch (error) {
        console.error('Error checking file existence:', error);
        throw error;
    }
};

// 获取文件列表
export const getFiles = async () => {
    try {
        const response = await http.get('/files/files');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 下载文件
export const downloadFile = async (fileName) => {
    try {
        let receivedLength = 0;
        const chunkSize = 1024 * 1024; // 每次请求1MB
        let chunks = [];

        // 获取文件总大小
        const headResponse = await http.head(`/files/download/${fileName}`);
        const fileSize = parseInt(headResponse.headers['content-length'], 10);

        // 断点续传下载
        while (receivedLength < fileSize) {
            const range = `bytes=${receivedLength}-${Math.min(receivedLength + chunkSize - 1, fileSize - 1)}`;
            const response = await http.get(`/files/download/${fileName}`, {
                responseType: 'blob',
                headers: {
                    'Range': range
                }
            });

            chunks.push(response.data);
            receivedLength += response.data.size;

            // 显示下载进度
            console.log(`Downloaded ${receivedLength} of ${fileSize} bytes`);
        }

        // 创建 Blob 并下载
        const blob = new Blob(chunks);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
};

// 删除文件
export const deleteFile = async (fileName) => {
    try {
        const response = await http.delete(`/files/files/${fileName}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
