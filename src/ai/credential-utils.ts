
import { GoogleAuth } from 'google-auth-library';

// Utility to safely parse and format Google Cloud credentials
export function parseGoogleCredentials(): any | null {
  try {
    const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
    
    if (!credentialsJson) {
      console.error('Credential Utils: GOOGLE_CREDENTIALS_JSON not found in environment');
      return null;
    }

    // Handle different credential formats
    let cleanedCredentials = credentialsJson;
    
    // Remove any potential prefix/suffix issues
    cleanedCredentials = cleanedCredentials.trim();
    
    // Handle double quotes wrapping
    if (cleanedCredentials.startsWith('"') && cleanedCredentials.endsWith('"')) {
      cleanedCredentials = cleanedCredentials.slice(1, -1);
    }
    
    // Handle single quotes wrapping
    if (cleanedCredentials.startsWith("'") && cleanedCredentials.endsWith("'")) {
      cleanedCredentials = cleanedCredentials.slice(1, -1);
    }
    
    // Fix escaped quotes
    cleanedCredentials = cleanedCredentials.replace(/\\"/g, '"');
    
    // Check if the JSON needs formatting (has literal newlines that need escaping)
    if (needsJsonFormatting(cleanedCredentials)) {
      console.log('Credential Utils: Formatting unescaped JSON...');
      cleanedCredentials = formatUnescapedJson(cleanedCredentials);
    } else {
      // Fix escaped newlines in private key for already formatted JSON
      cleanedCredentials = cleanedCredentials.replace(/\\n/g, '\n');
    }
    
    // Parse the JSON
    const credentials = JSON.parse(cleanedCredentials);
    
    // Validate required fields
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
    
  } catch (error) {
    console.error('Credential Utils: Error parsing credentials:', error);
    
    // Try alternative parsing methods
    return tryAlternativeParsing();
  }
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
      // Escape literal newlines
      .replace(/\n/g, '\\n')
      // Escape literal carriage returns
      .replace(/\r/g, '\\r')
      // Escape literal tabs
      .replace(/\t/g, '\\t')
      // Fix any double escaping that might occur
      .replace(/\\\\n/g, '\\n')
      .replace(/\\\\r/g, '\\r')
      .replace(/\\\\t/g, '\\t');
    
    // Test if the fixed JSON is valid
    JSON.parse(fixed);
    return fixed;
  } catch (error) {
    console.error('Credential Utils: Failed to format JSON:', error);
    throw error;
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
