import axios from "axios";
// require('dotenv/config');

export const baseUrl = import.meta.env.VITE_APP_BASE_URL;

// Helper function to get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('authToken');
};

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const fetchDataFromApi = async (url) => {
    try {
        const headers = getAuthHeaders();
        const { data } = await axios.get(baseUrl + url, { headers });
        return data;
    } catch (error) {
        console.log('API fetch error:', error);
        if (error.response?.status === 401) {
            // Token expired or invalid, redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            window.location.href = '/signin';
        }
        return error;
    }
}

export const postData = async (url, formData) => {
    try {
        const token = getAuthToken();
        const headers = {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        };

        const response = await fetch(baseUrl + url, {
            method: 'POST',
            headers,
            body: JSON.stringify(formData),
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            window.location.href = '/signin';
            return { error: true, message: 'Authentication required' };
        }

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorData = await response.json();
            return errorData;
        }
    } catch (error) {
        console.log('API post error:', error);
        return { error: true, message: error.message };
    }
}

export const editData = async (url, updatedData) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
        };

        const res = await fetch(`${baseUrl}${url}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(updatedData),
        });

        if (res.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            window.location.href = '/signin';
            return { error: true, message: 'Authentication required' };
        }

        const result = await res.json();
        if (!res.ok) {
            return { error: true, ...result };
        }
        return result;
    } catch (error) {
        return { error: true, message: error.message };
    }
};

export const deleteData = async (url) => {
    try {
        const headers = getAuthHeaders();
        const response = await axios.delete(`${baseUrl}${url}`, { headers });
        return response.data;
    } catch (error) {
        console.log('API delete error:', error);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            window.location.href = '/signin';
        }
        if (error.response) {
            return error.response.data;
        }
        return {
            error: true,
            message: "Network error",
            notify: error.message
        };
    }
}

export const uploadImage = async (url, formData) => {
    try {
        const token = getAuthToken();
        const config = {
            headers: {
                ...getAuthHeaders(),
                // Don't set Content-Type for FormData, let browser set it with boundary
            }
        };

        const response = await axios.post(baseUrl + url, formData, config);
        return response.data;
    } catch (error) {
        console.log('API upload error:', error);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            window.location.href = '/signin';
        }
        return { error: true, message: error.message };
    }
}

export const deleteImages = async (url, image) => {
    try {
        const headers = getAuthHeaders();
        const response = await axios.delete(`${baseUrl}${url}`, {
            headers,
            data: image
        });
        return response.data;
    } catch (error) {
        console.log('API delete image error:', error);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            window.location.href = '/signin';
        }
        return { error: true, message: error.message };
    }
}

// New helper function for authentication
export const setAuthToken = (token) => {
    localStorage.setItem('token', token);
};

export const removeAuthToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
    return !!getAuthToken();
};

