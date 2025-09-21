
import { GoogleAuth } from 'google-auth-library';

// Utility to safely parse and format Google Cloud credentials
export function parseGoogleCredentials(): any | null {
  try {
    const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
    
    if (!credentialsJson) {
      console.error('Credential Utils: GOOGLE_CREDENTIALS_JSON not found in environment');
      return null;
    }

    console.log('Credential Utils: Processing credentials JSON...');
    console.log('Credential Utils: Raw JSON length:', credentialsJson.length);
    console.log('Credential Utils: First 100 chars:', credentialsJson.substring(0, 100));
    
    // Handle different credential formats
    let cleanedCredentials = credentialsJson.trim();
    
    // Remove any wrapping quotes (common in environment variables)
    if ((cleanedCredentials.startsWith('"') && cleanedCredentials.endsWith('"')) ||
        (cleanedCredentials.startsWith("'") && cleanedCredentials.endsWith("'"))) {
      cleanedCredentials = cleanedCredentials.slice(1, -1);
    }
    
    // Handle escaped quotes from environment variables
    cleanedCredentials = cleanedCredentials.replace(/\\"/g, '"');
    
    // Try to parse directly first (might already be valid)
    try {
      const directParse = JSON.parse(cleanedCredentials);
      console.log('Credential Utils: Direct parsing successful');
      return validateCredentials(directParse);
    } catch (directError) {
      console.log('Credential Utils: Direct parsing failed, trying cleanup methods...');
    }
    
    // Method 1: Handle environment variable JSON on single line
    cleanedCredentials = cleanedCredentials
      .replace(/\s*\n\s*/g, '') // Remove actual newlines and surrounding whitespace
      .replace(/\\n/g, '\n')    // Convert escaped newlines back to actual newlines where needed (like in private key)
      .replace(/\\\//g, '/')    // Fix escaped slashes
      .replace(/\\t/g, '\t');   // Fix escaped tabs
    
    try {
      const credentials = JSON.parse(cleanedCredentials);
      console.log('Credential Utils: Single-line cleanup parsing successful');
      return validateCredentials(credentials);
    } catch (cleanupError) {
      console.log('Credential Utils: Single-line cleanup failed, trying comprehensive cleanup...');
    }
    
    // Method 2: Comprehensive cleanup for complex cases
    const comprehensiveClean = comprehensiveJsonCleanup(credentialsJson);
    try {
      const credentials = JSON.parse(comprehensiveClean);
      console.log('Credential Utils: Comprehensive cleanup parsing successful');
      return validateCredentials(credentials);
    } catch (comprehensiveError) {
      console.log('Credential Utils: Comprehensive cleanup failed, trying manual reconstruction...');
    }
    
    // Method 3: Manual reconstruction from raw string
    return tryManualReconstruction(credentialsJson);
    
  } catch (error) {
    console.error('Credential Utils: All parsing methods failed:', error);
    return null;
  }
}

// Validate parsed credentials
function validateCredentials(credentials: any): any | null {
  const requiredFields = ['type', 'project_id', 'private_key', 'client_email'];
  for (const field of requiredFields) {
    if (!credentials[field]) {
      console.error(`Credential Utils: Missing required field: ${field}`);
      return null;
    }
  }
  
  console.log('Credential Utils: Successfully parsed and validated credentials');
  console.log('Service account email:', credentials.client_email);
  console.log('Project ID:', credentials.project_id);
  
  return credentials;
}

// Check if JSON needs formatting (contains unescaped newlines)
function needsJsonFormatting(jsonString: string): boolean {
  try {
    // Try to parse as-is first
    JSON.parse(jsonString);
    return false; // Already valid JSON
  } catch {
    // Check if it contains literal newlines that need escaping
    return jsonString.includes('\n') && !jsonString.includes('\\n');
  }
}

// Format JSON with unescaped newlines and control characters
function formatUnescapedJson(jsonString: string): string {
  try {
    // First, try to fix common JSON formatting issues
    let fixed = jsonString
      // Remove any potential BOM or invisible characters at start
      .replace(/^\uFEFF/, '')
      // Escape literal newlines (but not already escaped ones)
      .replace(/(?<!\\)\n/g, '\\n')
      // Escape literal carriage returns (but not already escaped ones)
      .replace(/(?<!\\)\r/g, '\\r')
      // Escape literal tabs (but not already escaped ones)  
      .replace(/(?<!\\)\t/g, '\\t')
      // Escape other common control characters
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Fix any double escaping that might occur
      .replace(/\\\\n/g, '\\n')
      .replace(/\\\\r/g, '\\r')
      .replace(/\\\\t/g, '\\t');
    
    // Test if the fixed JSON is valid
    JSON.parse(fixed);
    return fixed;
  } catch (error) {
    console.error('Credential Utils: Failed to format JSON:', error);
    // Try a more aggressive approach
    return comprehensiveJsonCleanup(jsonString);
  }
}

// Comprehensive JSON cleanup for environment variable parsing
function comprehensiveJsonCleanup(jsonString: string): string {
  let cleaned = jsonString.trim();
  
  // Remove wrapping quotes if present
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || 
      (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1);
  }
  
  // Fix common environment variable issues
  cleaned = cleaned
    .replace(/\\\\/g, '\\')           // Fix double backslashes
    .replace(/\\"/g, '"')            // Fix escaped quotes
    .replace(/\\\//g, '/')           // Fix escaped slashes
    .replace(/\\t/g, '\t')           // Fix escaped tabs
    .replace(/\r\n/g, '\n')          // Normalize line endings
    .replace(/\r/g, '\n')            // Convert old Mac line endings
    .replace(/\n\s+/g, '\n')         // Remove extra whitespace after newlines
    .replace(/\s+\n/g, '\n')         // Remove whitespace before newlines
    .replace(/\n{2,}/g, '\n');       // Remove multiple consecutive newlines
  
  return cleaned;
}

// Try manual reconstruction when all parsing fails
function tryManualReconstruction(rawString: string): any | null {
  try {
    console.log('Credential Utils: Attempting manual reconstruction...');
    
    // Extract key components using regex patterns
    const patterns = {
      type: /"type"\s*:\s*"([^"]+)"/,
      project_id: /"project_id"\s*:\s*"([^"]+)"/,
      private_key_id: /"private_key_id"\s*:\s*"([^"]+)"/,
      private_key: /"private_key"\s*:\s*"(-----BEGIN PRIVATE KEY-----[^"]+-----END PRIVATE KEY-----[^"]*)"/,
      client_email: /"client_email"\s*:\s*"([^"]+)"/,
      client_id: /"client_id"\s*:\s*"([^"]+)"/,
      auth_uri: /"auth_uri"\s*:\s*"([^"]+)"/,
      token_uri: /"token_uri"\s*:\s*"([^"]+)"/,
      auth_provider_x509_cert_url: /"auth_provider_x509_cert_url"\s*:\s*"([^"]+)"/,
      client_x509_cert_url: /"client_x509_cert_url"\s*:\s*"([^"]+)"/,
      universe_domain: /"universe_domain"\s*:\s*"([^"]+)"/
    };
    
    const reconstructed: any = {};
    
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = rawString.match(pattern);
      if (match && match[1]) {
        reconstructed[key] = match[1];
        
        // Special handling for private key - ensure proper newlines
        if (key === 'private_key') {
          reconstructed[key] = reconstructed[key]
            .replace(/\\n/g, '\n')
            .replace(/\s+/g, ' ')
            .replace(/-----BEGIN PRIVATE KEY----- /g, '-----BEGIN PRIVATE KEY-----\n')
            .replace(/ -----END PRIVATE KEY-----/g, '\n-----END PRIVATE KEY-----')
            .replace(/([A-Za-z0-9+/=]{64})/g, '$1\n')
            .replace(/\n+/g, '\n')
            .trim();
        }
      }
    }
    
    console.log('Credential Utils: Manual reconstruction extracted fields:', Object.keys(reconstructed));
    
    if (Object.keys(reconstructed).length >= 4) { // At least the required fields
      return validateCredentials(reconstructed);
    }
    
    console.error('Credential Utils: Manual reconstruction failed - insufficient fields extracted');
    return null;
    
  } catch (error) {
    console.error('Credential Utils: Manual reconstruction error:', error);
    return null;
  }
}

// Alternative parsing method for edge cases
function tryAlternativeParsing(): any | null {
  try {
    const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
    if (!credentialsJson) return null;
    
    // Method 1: Base64 decode if it looks like base64
    if (isBase64(credentialsJson)) {
      const decoded = Buffer.from(credentialsJson, 'base64').toString('utf-8');
      if (needsJsonFormatting(decoded)) {
        return JSON.parse(formatUnescapedJson(decoded));
      }
      return JSON.parse(decoded);
    }
    
    // Method 2: Try formatting unescaped JSON
    let manualFixed = credentialsJson.replace(/^["']|["']$/g, ''); // Remove wrapping quotes
    
    if (needsJsonFormatting(manualFixed)) {
      manualFixed = formatUnescapedJson(manualFixed);
    } else {
      manualFixed = manualFixed
        .replace(/\\n/g, '\n')
        .replace(/\\\"/g, '"');
    }
    
    return JSON.parse(manualFixed);
    
  } catch (error) {
    console.error('Credential Utils: All parsing methods failed:', error);
    return null;
  }
}

// Check if string is base64 encoded
function isBase64(str: string): boolean {
  try {
    return Buffer.from(str, 'base64').toString('base64') === str;
  } catch {
    return false;
  }
}

// Format credentials for environment variable storage
export function formatCredentialsForEnv(credentials: any): string {
  try {
    // Ensure private key has proper newlines
    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    }
    
    return JSON.stringify(credentials);
  } catch (error) {
    console.error('Credential Utils: Error formatting credentials:', error);
    throw error;
  }
}

console.log('Credential Utils: Loaded credential formatting utilities');
