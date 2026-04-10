import React, { useState, useEffect } from 'react';
import { UploadZone } from './components/UploadZone';
import { SummaryDisplay } from './components/SummaryDisplay';
import { Layout } from './components/Layout';
import { AuthForm } from './components/AuthForm';
import api from './services/api';

interface Summary {
  id: string;
  summaryText: string;
  keyPoints: string[];
  metadata: {
    wordCount: number;
    sentenceCount: number;
    compressionRatio: number;
    confidenceScore: number;
    processingTime: number;
  };
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState<'auth' | 'home' | 'summarizer'>('auth');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<any | null>(null);
  const [currentSummary, setCurrentSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // User is logged in, go to home
      setCurrentPage('home');
      setCurrentUser({ email: 'user@example.com', fullName: 'User' });
    }
  }, []);

  const handleFileSelect = async (file: File, type: 'pdf' | 'image' | 'text') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.uploadDocument(file, type);
      const document = response.data.data;
      setUploadedDocument(document);

      // Generate summary
      const summaryResponse = await api.generateSummary(document.id, 0.3, true);
      const summary = summaryResponse.data.data;
      setCurrentSummary(summary);
      setCurrentPage('summarizer');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to process document');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextInput = async (text: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.uploadText(text);
      const document = response.data.data;
      setUploadedDocument(document);

      // Generate summary
      const summaryResponse = await api.generateSummary(document.id, 0.3, true);
      const summary = summaryResponse.data.data;
      setCurrentSummary(summary);
      setCurrentPage('summarizer');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to process text');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateSummary = async (ratio: number) => {
    if (!currentSummary) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.regenerateSummary(currentSummary.id, ratio);
      const summary = response.data.data;
      setCurrentSummary(summary);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to regenerate summary');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'txt') => {
    if (!currentSummary) return;

    try {
      const response = await api.exportSummary(currentSummary.id, format);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `summary.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentElement?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError('Failed to export summary');
      console.error('Error:', err);
    }
  };

  const handleShare = async () => {
    if (!currentSummary) return;

    try {
      const response = await api.shareSummary(currentSummary.id);
      const shareUrl = response.data.data.shareUrl;

      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch (err: any) {
      setError('Failed to create share link');
      console.error('Error:', err);
    }
  };

  const handleAuth = async (formData: any) => {
    setAuthLoading(true);
    setError(null);

    try {
      if (authMode === 'login') {
        const response = await api.login(formData.email, formData.password);
        const user = response.data.data.user;
        setCurrentUser(user);
        setCurrentPage('home');
      } else {
        const response = await api.register(formData.email, formData.password, formData.fullName);
        const user = response.data.data.user;
        setCurrentUser(user);
        setCurrentPage('home');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('auth');
    setCurrentSummary(null);
    setUploadedDocument(null);
    localStorage.removeItem('token');
  };

  // Auth page
  if (currentPage === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-block w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">SumUP</h1>
            <p className="text-secondary-600">Professional Document Summarizer</p>
          </div>

          {/* Auth Form */}
          <AuthForm
            mode={authMode}
            onSubmit={handleAuth}
            isLoading={authLoading}
            error={error}
          />

          {/* Toggle Auth Mode */}
          <div className="text-center mt-6 text-secondary-600">
            <span>
              {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setError(null);
                }}
                className="text-primary-600 font-semibold hover:text-primary-700"
              >
                {authMode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Main app with layout
  return (
    <Layout currentUser={currentUser} onLogout={handleLogout}>
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Home page */}
      {currentPage === 'home' && (
        <div className="space-y-12">
          {/* Hero */}
          <div className="text-center space-y-6 py-8">
            <h2 className="text-5xl font-bold text-secondary-900">
              Summarize Documents Intelligently
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Upload PDFs, images with text, or paste content. SumUP uses advanced algorithms
              to extract key information while preserving the original meaning.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-secondary-700">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">✓</span>
                </div>
                <span>Faithful Summarization</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-700">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">✓</span>
                </div>
                <span>Multiple Formats</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-700">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">✓</span>
                </div>
                <span>Instant Processing</span>
              </div>
            </div>
          </div>

          {/* Upload section */}
          <div className="py-12">
            <UploadZone
              onFileSelect={handleFileSelect}
              onTextInput={handleTextInput}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {/* Summarizer page */}
      {currentPage === 'summarizer' && currentSummary && uploadedDocument && (
        <div className="space-y-8">
          {/* Back button */}
          <button
            onClick={() => {
              setCurrentPage('home');
              setCurrentSummary(null);
              setUploadedDocument(null);
            }}
            className="btn-ghost mb-4"
          >
            ← Back to Upload
          </button>

          {/* Document info */}
          <div className="card">
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">
              {uploadedDocument.filename}
            </h2>
            <p className="text-secondary-600 mb-4">
              Uploaded at {new Date(uploadedDocument.uploadedAt).toLocaleString()}
            </p>
          </div>

          {/* Summary display */}
          <SummaryDisplay
            originalText={uploadedDocument.extractedText || ''}
            summaryText={currentSummary.summaryText}
            keyPoints={currentSummary.keyPoints}
            metadata={currentSummary.metadata}
            onExport={handleExport}
            onShare={handleShare}
            onRegenerateSummary={handleRegenerateSummary}
          />
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
            <p className="mt-4 text-secondary-600 font-medium">Processing your document...</p>
          </div>
        </div>
      )}
    </Layout>
  );
}
