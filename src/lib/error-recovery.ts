
type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

interface ErrorLog {
  timestamp: number;
  message: string;
  severity: ErrorSeverity;
  stack?: string;
  context?: Record<string, any>;
}

class ErrorRecoverySystem {
  private static instance: ErrorRecoverySystem;
  private errorLog: ErrorLog[] = [];
  private maxLogSize = 100;
  private recoveryAttempts = new Map<string, number>();
  private maxRecoveryAttempts = 3;

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  public static getInstance(): ErrorRecoverySystem {
    if (!ErrorRecoverySystem.instance) {
      ErrorRecoverySystem.instance = new ErrorRecoverySystem();
    }
    return ErrorRecoverySystem.instance;
  }

  private setupGlobalErrorHandlers() {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      this.handleError({
        message: event.message,
        severity: 'high',
        stack: event.error?.stack,
        context: { filename: event.filename, lineno: event.lineno },
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        severity: 'medium',
        context: { reason: event.reason },
      });
    });
  }

  private handleError(error: Omit<ErrorLog, 'timestamp'>) {
    const errorLog: ErrorLog = {
      ...error,
      timestamp: Date.now(),
    };

    this.errorLog.push(errorLog);
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    // Attempt recovery based on severity
    if (error.severity === 'critical' || error.severity === 'high') {
      this.attemptRecovery(error.message);
    }

    console.error('[Error Recovery]', errorLog);
  }

  private attemptRecovery(errorKey: string) {
    const attempts = this.recoveryAttempts.get(errorKey) || 0;
    
    if (attempts >= this.maxRecoveryAttempts) {
      console.error('[Error Recovery] Max recovery attempts reached for:', errorKey);
      return;
    }

    this.recoveryAttempts.set(errorKey, attempts + 1);

    // Clear potentially corrupted cache
    try {
      localStorage.removeItem('response_cache');
      sessionStorage.clear();
    } catch (e) {
      console.error('[Error Recovery] Failed to clear cache:', e);
    }

    // Reset after 5 minutes
    setTimeout(() => {
      this.recoveryAttempts.delete(errorKey);
    }, 300000);
  }

  public getErrorLogs(): ErrorLog[] {
    return [...this.errorLog];
  }

  public clearLogs() {
    this.errorLog = [];
    this.recoveryAttempts.clear();
  }
}

export const errorRecovery = ErrorRecoverySystem.getInstance();
