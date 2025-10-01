
import { Logger } from '@/utils/logger';

export class DatabaseSecurity {
  // SQL injection prevention for dynamic queries
  static sanitizeForSQL(input: string): string {
    return input
      .replace(/'/g, "''")  // Escape single quotes
      .replace(/;/g, '')    // Remove semicolons
      .replace(/--/g, '')   // Remove SQL comments
      .replace(/\/\*/g, '') // Remove multi-line comment start
      .replace(/\*\//g, '') // Remove multi-line comment end
      .replace(/xp_/gi, '') // Remove extended stored procedures
      .replace(/sp_/gi, '') // Remove stored procedures
      .trim();
  }
  
  // Validate table/column names (only allow alphanumeric and underscore)
  static validateIdentifier(identifier: string): boolean {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier);
  }
  
  // Parameterized query helper
  static buildParameterizedQuery(baseQuery: string, params: Record<string, any>): { query: string; values: any[] } {
    let parameterizedQuery = baseQuery;
    const values: any[] = [];
    let paramIndex = 1;
    
    for (const [key, value] of Object.entries(params)) {
      parameterizedQuery = parameterizedQuery.replace(
        new RegExp(`:${key}\\b`, 'g'),
        `$${paramIndex}`
      );
      values.push(value);
      paramIndex++;
    }
    
    return { query: parameterizedQuery, values };
  }
  
  // Log database security events
  static logSecurityEvent(event: string, details: any): void {
    Logger.warn(`Database Security Event: ${event}`, {
      ...details,
      timestamp: new Date().toISOString(),
      category: 'database_security'
    });
  }
  
  // Validate numeric inputs to prevent injection
  static validateNumericInput(input: any): number | null {
    const num = Number(input);
    if (isNaN(num) || !isFinite(num)) {
      return null;
    }
    return num;
  }
  
  // Validate UUID format
  static validateUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}

export default DatabaseSecurity;
