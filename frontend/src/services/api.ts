import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(email: string, password: string, fullName: string) {
    return this.client.post('/auth/register', { email, password, fullName });
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  }

  async logout() {
    localStorage.removeItem('token');
  }

  async getCurrentUser() {
    return this.client.get('/auth/me');
  }

  // Document endpoints
  async uploadDocument(file: File, documentType: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    return this.client.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async uploadText(text: string) {
    return this.client.post('/documents/upload-text', { text });
  }

  async getDocument(documentId: string) {
    return this.client.get(`/documents/${documentId}`);
  }

  async deleteDocument(documentId: string) {
    return this.client.delete(`/documents/${documentId}`);
  }

  async getDocumentHistory() {
    return this.client.get('/documents/history');
  }

  // Summary endpoints
  async generateSummary(
    documentId: string,
    compressionRatio: number = 0.3,
    includeKeyPoints: boolean = true
  ) {
    return this.client.post('/summaries/generate', {
      documentId,
      compressionRatio,
      includeKeyPoints,
    });
  }

  async getSummary(summaryId: string) {
    return this.client.get(`/summaries/${summaryId}`);
  }

  async regenerateSummary(summaryId: string, compressionRatio?: number) {
    return this.client.post(`/summaries/${summaryId}/regenerate`, {
      compressionRatio,
    });
  }

  async exportSummary(summaryId: string, format: 'pdf' | 'txt') {
    return this.client.get(`/summaries/${summaryId}/export`, {
      params: { format },
      responseType: 'blob',
    });
  }

  async shareSummary(summaryId: string) {
    return this.client.post(`/summaries/${summaryId}/share`);
  }

  // Health check
  async healthCheck() {
    return this.client.get('/health');
  }
}

export default new ApiClient();
