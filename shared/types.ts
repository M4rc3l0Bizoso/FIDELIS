// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  university?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// Document Types
export interface DocumentUpload {
  id: string;
  userId: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  extractedText: string;
  language?: string;
  pageCount?: number;
  uploadedAt: string;
}

export interface DocumentMetadata {
  totalWords: number;
  totalSentences: number;
  paragraphs: number;
  estimatedReadingTime: number; // in minutes
}

// Summary Types
export interface SummaryRequest {
  documentId: string;
  summaryLength?: 'short' | 'medium' | 'long'; // 30%, 50%, 70%
  includeKeyPoints?: boolean;
  compressionRatio?: number; // 0-1
}

export interface KeyPoint {
  text: string;
  score: number;
  type: 'entity' | 'topic' | 'keyword';
}

export interface Summary {
  id: string;
  documentId: string;
  userId: string;
  originalText: string;
  summaryText: string;
  keyPoints: KeyPoint[];
  compressionRatio: number;
  confidenceScore: number;
  wordCount: number;
  sentenceCount: number;
  generatedAt: string;
  metadata?: {
    processingTime: number; // ms
    method: 'extractive';
    language: string;
  };
}

// OCR Types
export interface OcrResult {
  text: string;
  confidence: number;
  language: string;
  metadata?: {
    pageNumber?: number;
    processingTime: number;
  };
}

// File Upload Types
export interface FileUploadRequest {
  file: File;
  documentType: 'pdf' | 'image' | 'text';
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Database Models (Backend)
export interface UserModel extends User {
  passwordHash: string;
}

export interface DocumentModel extends DocumentUpload {
  storagePath: string;
}

export interface SummaryModel extends Summary {
  updatedAt: string;
}
