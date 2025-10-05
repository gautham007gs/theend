
'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
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
    this.setState({ errorInfo });
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
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
        
        // Refresh page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (recoveryError) {
        console.error('❌ Recovery failed:', recoveryError);
      }
    }
  };

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
            <div className="space-y-2 flex flex-col items-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 min-h-[48px] min-w-[120px]"
              >
                Reload Page
              </button>
              <button
                onClick={this.attemptRecovery}
                className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 min-h-[48px] min-w-[120px]"
              >
                Auto Recovery
              </button>
            </div>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-gray-700 min-h-[48px] flex items-center justify-center py-3">Error Details</summary>
                <pre className="text-xs text-red-600 mt-2 bg-gray-100 p-2 rounded">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
