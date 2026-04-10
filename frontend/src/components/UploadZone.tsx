import React, { useCallback, useState } from 'react';
import { Upload, FileText, Image, Type, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface UploadZoneProps {
  onFileSelect: (file: File, type: 'pdf' | 'image' | 'text') => void;
  onTextInput: (text: string) => void;
  isLoading?: boolean;
}

export function UploadZone({ onFileSelect, onTextInput, isLoading = false }: UploadZoneProps) {
  const [textInput, setTextInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      acceptedFiles.forEach((file) => {
        const fileExt = file.name.split('.').pop()?.toLowerCase();

        // Validate file type
        if (['pdf'].includes(fileExt || '')) {
          onFileSelect(file, 'pdf');
        } else if (['png', 'jpg', 'jpeg', 'gif', 'bmp'].includes(fileExt || '')) {
          onFileSelect(file, 'image');
        } else if (['txt', 'md', 'doc', 'docx'].includes(fileExt || '')) {
          onFileSelect(file, 'text');
        } else {
          setError(`Unsupported file type: ${fileExt}`);
        }
      });
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isLoading,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
      'text/plain': ['.txt', '.md'],
    },
  });

  const handleTextSubmit = () => {
    if (!textInput.trim()) {
      setError('Please enter some text to summarize');
      return;
    }

    if (textInput.trim().length < 50) {
      setError('Text must be at least 50 characters long');
      return;
    }

    onTextInput(textInput.trim());
    setTextInput('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tab selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('file')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'file'
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload File
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'text'
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-200 text-secondary-700 hover:bg-secondary-300'
          }`}
        >
          <Type className="w-4 h-4" />
          Paste Text
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* File upload section */}
      {activeTab === 'file' && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-primary-600 bg-primary-50'
              : 'border-secondary-300 bg-secondary-50 hover:border-primary-400'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} disabled={isLoading} />

          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-4 rounded-full">
              <Upload className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
          </h3>

          <p className="text-secondary-600 mb-4">or click to browse your computer</p>

          {/* Supported formats */}
          <div className="flex flex-wrap justify-center gap-3 pt-4 border-t border-secondary-300">
            <div className="flex items-center gap-2 text-secondary-600">
              <FileText className="w-4 h-4" />
              <span className="text-sm">PDF</span>
            </div>
            <div className="flex items-center gap-2 text-secondary-600">
              <Image className="w-4 h-4" />
              <span className="text-sm">Images (PNG, JPG)</span>
            </div>
            <div className="flex items-center gap-2 text-secondary-600">
              <Type className="w-4 h-4" />
              <span className="text-sm">Text Files</span>
            </div>
          </div>
        </div>
      )}

      {/* Text input section */}
      {activeTab === 'text' && (
        <div className="card">
          <textarea
            value={textInput}
            onChange={(e) => {
              setTextInput(e.target.value);
              setError(null);
            }}
            placeholder="Paste or type your text here... (minimum 50 characters)"
            className="input-base !p-4 !border-0 h-64 resize-none focus:ring-primary-500 mb-4"
            disabled={isLoading}
          />

          <div className="flex justify-between items-center">
            <span className="text-sm text-secondary-600">
              {textInput.length} characters
            </span>
            <button
              onClick={handleTextSubmit}
              disabled={isLoading || textInput.length < 50}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Summarize Text'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
