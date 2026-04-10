import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export function AuthForm({ mode, onSubmit, isLoading = false, error }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Validation
    if (!formData.email) {
      setLocalError('Email is required');
      return;
    }

    if (!formData.password) {
      setLocalError('Password is required');
      return;
    }

    if (mode === 'register') {
      if (!formData.fullName) {
        setLocalError('Full name is required');
        return;
      }

      if (formData.password.length < 8) {
        setLocalError('Password must be at least 8 characters');
        return;
      }
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="card max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold text-secondary-900 mb-6 text-center">
        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
      </h2>

      {(error || localError) && (
        <div className="mb-4 flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error || localError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-secondary-700 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isLoading}
              className="input-base"
              placeholder="John Doe"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            className="input-base"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className="input-base pr-10"
              placeholder={mode === 'login' ? '••••••••' : 'At least 8 characters'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
        >
          {isLoading && <Loader className="w-4 h-4 animate-spin" />}
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
