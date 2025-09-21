import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/api/auth/register', { 
      email, 
      password, 
      full_name: name 
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    Cookies.remove('token');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// Subscription API
export const subscriptionAPI = {
  getPlans: async () => {
    const response = await api.get('/api/subscriptions/plans');
    return response.data;
  },

  getCurrentSubscription: async () => {
    const response = await api.get('/api/subscriptions/current');
    return response.data;
  },

  createCheckoutSession: async (planId: string) => {
    const response = await api.post('/api/subscriptions/checkout', {
      plan_id: planId,
      success_url: `${window.location.origin}/dashboard?success=true`,
      cancel_url: `${window.location.origin}/pricing?canceled=true`,
    });
    return response.data;
  },

  cancelSubscription: async () => {
    const response = await api.post('/api/subscriptions/cancel');
    return response.data;
  },

  getUsage: async () => {
    const response = await api.get('/api/subscriptions/usage');
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getProjects: async () => {
    const response = await api.get('/api/projects');
    return response.data;
  },

  getProject: async (id: string) => {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  },

  createProject: async (data: any) => {
    const response = await api.post('/api/projects', data);
    return response.data;
  },

  updateProject: async (id: string, data: any) => {
    const response = await api.put(`/api/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: string) => {
    const response = await api.delete(`/api/projects/${id}`);
    return response.data;
  },
};

// Documents API
export const documentsAPI = {
  uploadDocument: async (file: File, projectId?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (projectId) {
      formData.append('project_id', projectId);
    }

    const response = await api.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getDocuments: async (projectId?: string) => {
    const url = projectId ? `/api/documents?project_id=${projectId}` : '/api/documents';
    const response = await api.get(url);
    return response.data;
  },
};

export default api;