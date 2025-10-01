
export class ContentSecurity {
  // Advanced content filtering patterns
  private static maliciousPatterns = [
    // Script injection attempts
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload=/gi,
    /onerror=/gi,
    /onclick=/gi,
    
    // Data URI schemes that could be malicious
    /data:text\/html/gi,
    /data:application/gi,
    
    // Protocol injection
    /file:\/\//gi,
    /ftp:\/\//gi,
    
    // Server-side includes
    /<!--#/gi,
    
    // PHP injection attempts
    /<\?php/gi,
    /<%/gi,
  ];
  
  // Detect potentially malicious content
  static scanForMaliciousContent(content: string): { 
    isSafe: boolean; 
    threats: string[]; 
    cleanedContent?: string;
  } {
    const threats: string[] = [];
    let cleanedContent = content;
    
    for (const pattern of this.maliciousPatterns) {
      if (pattern.test(content)) {
        threats.push(pattern.source);
        cleanedContent = cleanedContent.replace(pattern, '[REMOVED]');
      }
    }
    
    return {
      isSafe: threats.length === 0,
      threats,
      cleanedContent: threats.length > 0 ? cleanedContent : content
    };
  }
  
  // Image content validation
  static validateImageContent(buffer: ArrayBuffer): { isValid: boolean; reason?: string } {
    const view = new Uint8Array(buffer);
    
    // Check file signatures
    const signatures = {
      jpeg: [0xFF, 0xD8, 0xFF],
      png: [0x89, 0x50, 0x4E, 0x47],
      webp: [0x52, 0x49, 0x46, 0x46],
      gif: [0x47, 0x49, 0x46]
    };
    
    let isValidImage = false;
    for (const [format, signature] of Object.entries(signatures)) {
      if (signature.every((byte, index) => view[index] === byte)) {
        isValidImage = true;
        break;
      }
    }
    
    if (!isValidImage) {
      return { isValid: false, reason: 'Invalid image format' };
    }
    
    // Check for embedded scripts or suspicious content
    const content = new TextDecoder().decode(buffer);
    const scanResult = this.scanForMaliciousContent(content);
    
    if (!scanResult.isSafe) {
      return { isValid: false, reason: 'Suspicious content detected in image' };
    }
    
    return { isValid: true };
  }
  
  // URL validation and sanitization
  static validateURL(url: string): { isValid: boolean; sanitized?: string; reason?: string } {
    try {
      const parsed = new URL(url);
      
      // Only allow safe protocols
      const allowedProtocols = ['http:', 'https:'];
      if (!allowedProtocols.includes(parsed.protocol)) {
        return { isValid: false, reason: 'Invalid protocol' };
      }
      
      // Block suspicious domains
      const suspiciousDomains = [
        'bit.ly', 'tinyurl.com', 'ow.ly', // URL shorteners
        'iplogger.org', 'grabify.link', // IP loggers
      ];
      
      if (suspiciousDomains.some(domain => parsed.hostname.includes(domain))) {
        return { isValid: false, reason: 'Suspicious domain' };
      }
      
      return { isValid: true, sanitized: parsed.toString() };
    } catch {
      return { isValid: false, reason: 'Malformed URL' };
    }
  }
  
  // Hash content for integrity checking
  static async hashContent(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

export default ContentSecurity;
