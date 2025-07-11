import axios from "axios";

// Thiết lập base URL
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:4000";

// Tạo axios instance với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Thêm interceptor để tự động gửi token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await axiosInstance.get(url);
    return data;
  } catch (error) {
    console.log("API fetch error:", error);
    throw error;
  }
};

export const postData = async (url, formData) => {
  try {
    // Sử dụng axios thay vì fetch để tận dụng interceptor
    const response = await axiosInstance.post(url, formData);
    return response.data;
  } catch (error) {
    console.log("API post error:", error);
    throw error;
  }
};

export const editData = async (url, updatedData) => {
  try {
    const response = await axiosInstance.put(url, updatedData);
    return response.data;
  } catch (error) {
    console.log("API edit error:", error);
    throw error;
  }
};

export const deleteData = async (url) => {
  try {
    const response = await axiosInstance.delete(url);
    return response.data;
  } catch (error) {
    console.log("API delete error:", error);
    throw error;
  }
};

export const uploadImage = async (url, formData) => {
  try {
    const response = await axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.log("API upload error:", error);
    throw error;
  }
};

export const deleteImages = async (url, image) => {
  try {
    const response = await axiosInstance.delete(url, { data: image });
    return response.data;
  } catch (error) {
    console.log("API delete image error:", error);
    throw error;
  }
};
