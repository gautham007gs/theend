
/**
 * Environment Variable Security
 * Protects sensitive environment variables from exposure
 */

export class EnvironmentSecurity {
  private static readonly SENSITIVE_KEYS = [
    'ADMIN_PASSWORD',
    'COOKIE_SECRET',
    'REQUEST_SIGNATURE_SECRET',
    'GOOGLE_CREDENTIALS_JSON',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  // Validate environment variables are secure
  static validateEnvironment(): {
    isSecure: boolean;
    warnings: string[];
    criticalIssues: string[];
  } {
    const warnings: string[] = [];
    const criticalIssues: string[] = [];

    // Check for default/weak values
    if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === 'change-this-in-production') {
      criticalIssues.push('ADMIN_PASSWORD is using default value - CRITICAL SECURITY RISK');
    }

    if (!process.env.COOKIE_SECRET || process.env.COOKIE_SECRET.length < 32) {
      criticalIssues.push('COOKIE_SECRET is weak or missing');
    }

    if (!process.env.REQUEST_SIGNATURE_SECRET || process.env.REQUEST_SIGNATURE_SECRET.length < 32) {
      warnings.push('REQUEST_SIGNATURE_SECRET should be longer for better security');
    }

    // Check for production environment
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('https://')) {
        criticalIssues.push('Supabase URL must use HTTPS in production');
      }
    }

    return {
      isSecure: criticalIssues.length === 0,
      warnings,
      criticalIssues
    };
  }

  // Sanitize environment variables for logging
  static sanitizeForLogging(obj: any): any {
    const sanitized = { ...obj };
    
    Object.keys(sanitized).forEach(key => {
      if (this.SENSITIVE_KEYS.some(sensitive => key.includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  // Generate secure environment template
  static generateSecureEnvTemplate(): string {
    return `# Secure Environment Variables Template
# Replace all placeholder values with secure, unique values

# Admin Security
ADMIN_PASSWORD=your-ultra-secure-admin-password-here-min-20-chars

# Cookie Security  
COOKIE_SECRET=${this.generateSecureSecret(64)}

# Request Signatures
REQUEST_SIGNATURE_SECRET=${this.generateSecureSecret(64)}

# Node Environment
NODE_ENV=production

# Note: Generate new secrets using crypto.randomBytes(32).toString('hex')
`;
  }

  private static generateSecureSecret(length: number = 64): string {
    if (typeof crypto !== 'undefined' && crypto.randomBytes) {
      return crypto.randomBytes(length / 2).toString('hex');
    }
    
    // Fallback for browser environment
    const chars = 'abcdef0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export default EnvironmentSecurity;
