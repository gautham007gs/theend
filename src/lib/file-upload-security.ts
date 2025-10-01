
/**
 * Secure File Upload Protection
 * Prevents malicious file uploads and validates file integrity
 */

export class FileUploadSecurity {
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  private static readonly MAGIC_NUMBERS = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/webp': [0x52, 0x49, 0x46, 0x46]
  };

  static async validateFileUpload(file: File): Promise<{
    isValid: boolean;
    reason?: string;
    threat?: string;
  }> {
    // Size validation
    if (file.size > this.MAX_FILE_SIZE) {
      return { isValid: false, reason: 'File too large', threat: 'oversized_file' };
    }

    // Type validation
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { isValid: false, reason: 'Invalid file type', threat: 'invalid_file_type' };
    }

    // Magic number validation (prevent type spoofing)
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    const magicNumbers = this.MAGIC_NUMBERS[file.type as keyof typeof this.MAGIC_NUMBERS];
    if (magicNumbers && !this.validateMagicNumbers(bytes, magicNumbers)) {
      return { isValid: false, reason: 'File type mismatch', threat: 'file_type_spoofing' };
    }

    // Scan for embedded scripts
    const content = new TextDecoder('utf-8', { fatal: false }).decode(arrayBuffer);
    if (this.containsMaliciousContent(content)) {
      return { isValid: false, reason: 'Malicious content detected', threat: 'embedded_script' };
    }

    return { isValid: true };
  }

  private static validateMagicNumbers(bytes: Uint8Array, expected: number[]): boolean {
    for (let i = 0; i < expected.length; i++) {
      if (bytes[i] !== expected[i]) return false;
    }
    return true;
  }

  private static containsMaliciousContent(content: string): boolean {
    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i,
      /<iframe/i,
      /eval\(/i,
      /document\./i
    ];

    return maliciousPatterns.some(pattern => pattern.test(content));
  }
}

export default FileUploadSecurity;
