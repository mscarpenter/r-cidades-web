// Arquivo: src/config/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

// Helper para pegar token
const getToken = () => localStorage.getItem('token');

// Objeto API padronizado
export const api = {
    get: async (endpoint, token = null) => {
        const authToken = token || getToken();
        const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro ${response.status}`);
        }

        return response.json();
    },

    post: async (endpoint, body, token = null) => {
        const authToken = token || getToken();
        const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro ${response.status}`);
        }

        return response.json();
    },

    put: async (endpoint, body, token = null) => {
        const authToken = token || getToken();
        const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro ${response.status}`);
        }

        return response.json();
    },

    delete: async (endpoint, token = null) => {
        const authToken = token || getToken();
        const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro ${response.status}`);
        }

        // Alguns deletes retornam 204 No Content
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    },

    upload: async (endpoint, formData, token = null) => {
        const authToken = token || getToken();
        const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                ...headers
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro ${response.status}`);
        }

        return response.json();
    }
};

export default api;
