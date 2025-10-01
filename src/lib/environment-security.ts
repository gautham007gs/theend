
/**
 * Environment Variable Security
 * Protects sensitive environment variables from exposure
 */

export class EnvironmentSecurity {
  private static readonly SENSITIVE_KEYS = [
    'COOKIE_SECRET',
    'REQUEST_SIGNATURE_SECRET',
    'GOOGLE_CREDENTIALS_JSON',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  // Validate environment variables are secure
  static validateEnvironment(): {
    isSecure: boolean;
    warnings: string[];
    criticalIssues: string[];
  } {
    const warnings: string[] = [];
    const criticalIssues: string[] = [];

    // Check for Supabase configuration
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      criticalIssues.push('NEXT_PUBLIC_SUPABASE_URL is missing - required for authentication');
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      criticalIssues.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing - required for authentication');
    }

    // Check for optional security enhancements
    if (!process.env.COOKIE_SECRET || process.env.COOKIE_SECRET.length < 32) {
      warnings.push('COOKIE_SECRET should be longer for better session security');
    }

    if (!process.env.REQUEST_SIGNATURE_SECRET || process.env.REQUEST_SIGNATURE_SECRET.length < 32) {
      warnings.push('REQUEST_SIGNATURE_SECRET should be longer for better API security');
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

# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional Security Enhancements
COOKIE_SECRET=${this.generateSecureSecret(64)}
REQUEST_SIGNATURE_SECRET=${this.generateSecureSecret(64)}

# Node Environment
NODE_ENV=production

# Note: Generate new secrets using crypto.randomBytes(32).toString('hex')
`;
  }

  private static generateSecureSecret(length: number = 64): string {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(length / 2);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback for server environment
    const chars = 'abcdef0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export default EnvironmentSecurity;
