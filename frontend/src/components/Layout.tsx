import React from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentUser?: any;
  onLogout?: () => void;
  title?: string;
}

export function Layout({ children, currentUser, onLogout, title = 'SumUP' }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">{title}</h1>
                <p className="text-xs text-secondary-600 hidden sm:block">
                  Professional Document Summarizer
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-4">
              {currentUser && (
                <>
                  <div className="text-sm text-secondary-600">
                    <span className="font-medium">{currentUser.fullName}</span>
                    <p className="text-xs text-secondary-500">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-4 pt-4 border-t border-secondary-200 space-y-3">
              {currentUser && (
                <>
                  <div className="text-sm text-secondary-600 px-2">
                    <p className="font-medium">{currentUser.fullName}</p>
                    <p className="text-xs text-secondary-500">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="btn-secondary flex items-center gap-2 w-full justify-center"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-secondary-200 bg-white mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-secondary-900 mb-3">SumUP</h4>
              <p className="text-sm text-secondary-600">
                Professional document summarizer built for academic excellence.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-secondary-900 mb-3">Features</h4>
              <ul className="text-sm text-secondary-600 space-y-1">
                <li>PDF Support</li>
                <li>Image OCR</li>
                <li>Text Summarization</li>
                <li>Export Options</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-secondary-900 mb-3">Resources</h4>
              <ul className="text-sm text-secondary-600 space-y-1">
                <li>
                  <a href="#" className="hover:text-primary-600">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-600">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-secondary-200 pt-8 text-center text-secondary-600">
            <p>
              © {new Date().getFullYear()} SumUP. Built with precision for academic excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
