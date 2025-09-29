
'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              The application encountered an unexpected error.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }


  // Auto-recovery attempt
  private attemptRecovery = () => {
    console.log('🔄 Attempting error recovery...');
    
    // Clear potentially corrupted cache
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('messages_kruthika');
        localStorage.removeItem('aiMood_kruthika');
        sessionStorage.clear();
        
        // Reload specific modules
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistration().then(registration => {
            if (registration) {
              registration.update();
            }
          });
        }
        
        console.log('✅ Error recovery completed');
        this.setState({ hasError: false, error: null, errorInfo: null });
        
        // Refresh page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (recoveryError) {
        console.error('❌ Recovery failed:', recoveryError);
      }
    }
  };

    return this.props.children;
  }
}

export default ErrorBoundary;
