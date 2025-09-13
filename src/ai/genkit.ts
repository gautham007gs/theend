
import { genkit } from 'genkit';
import { vertexAI } from '@genkit-ai/vertexai';

// -----------------------------------------------------------------------------
// Genkit AI Initialization with Vertex AI (Gemini)
// -----------------------------------------------------------------------------

// Parse service account credentials from environment variable
const getServiceAccountCredentials = () => {
  try {
    const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
    if (credentialsJson) {
      return JSON.parse(credentialsJson);
    }
  } catch (error) {
    console.error('Genkit: Error parsing GOOGLE_CREDENTIALS_JSON:', error);
  }
  return null;
};

// Function to determine the API key to use at initialization.
// It checks environment variables in a prioritized order.
// An API key is typically a long alphanumeric string.
const MIN_API_KEY_LENGTH = 30; // Most Google API keys are around 39 characters.

const getApiKey = (): string | undefined => {
  const keySources = [
    { name: 'GOOGLE_API_KEY', value: process.env.GOOGLE_API_KEY },
    { name: 'GEMINI_API_KEY_1', value: process.env.GEMINI_API_KEY_1 },
    { name: 'GEMINI_API_KEY_2', value: process.env.GEMINI_API_KEY_2 },
    // Add more potential backup keys here if needed:
    // { name: 'GEMINI_API_KEY_3', value: process.env.GEMINI_API_KEY_3 },
  ];

  for (const source of keySources) {
    console.log(`Genkit: Checking environment variable: ${source.name}`);
    const key = source.value?.trim(); // Trim whitespace
    if (key && key.length >= MIN_API_KEY_LENGTH && !key.includes(" ") && !key.includes("<") && !key.includes("your_")) {
      console.log(`Genkit: Using API key from environment variable: ${source.name}`);
      return key;
    } else if (source.value) { // Check source.value to see if it was defined but invalid
        if (!key) {
            console.warn(`Genkit: Environment variable ${source.name} was defined but is an empty string after trimming. Skipping.`);
        } else if (key.length < MIN_API_KEY_LENGTH) {
            console.warn(`Genkit: Environment variable ${source.name} was defined but its value ("${key.substring(0,10)}...") is too short to be a valid API key (length ${key.length}, expected >=${MIN_API_KEY_LENGTH}). Skipping.`);
        } else {
            console.warn(`Genkit: Environment variable ${source.name} was defined but its value ("${key.substring(0,10)}...") appears invalid (e.g., contains spaces or placeholder text). Skipping.`);
        }
    } else {
        console.log(`Genkit: Environment variable ${source.name} is not set.`);
    }
  }

  console.error(
    "CRITICAL Genkit Error: No valid API Key found for initialization. " +
    "All checked environment variables (GOOGLE_API_KEY, GEMINI_API_KEY_1, etc.) " +
    "are undefined, empty, too short, or appear invalid. AI features will NOT work. " +
    "Please ensure at least one valid API key is correctly set in your environment variables."
  );
  return undefined;
};

// Get project ID from environment variable
const getProjectId = (): string | undefined => {
  const projectId = process.env.VERTEX_AI_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT_ID;
  if (!projectId) {
    console.warn("Genkit: No VERTEX_AI_PROJECT_ID or GOOGLE_CLOUD_PROJECT_ID found. Vertex AI may not work properly.");
  } else {
    console.log(`Genkit: Using project ID: ${projectId}`);
  }
  return projectId;
};

// Get location from environment variable (default to us-central1)
const getLocation = (): string => {
  const location = process.env.VERTEX_AI_LOCATION || process.env.GCLOUD_LOCATION || 'us-central1';
  console.log(`Genkit: Using location: ${location}`);
  return location;
};

const activeApiKey = getApiKey();
const projectId = getProjectId();
const location = getLocation();
const serviceAccountCredentials = getServiceAccountCredentials();

if (!activeApiKey) {
  console.error("Genkit: AI plugin NOT initialized due to missing valid API key. AI functionalities will be disabled.");
}

if (activeApiKey && !projectId) {
  console.warn("Genkit: API key found but no project ID configured. Vertex AI requires a Google Cloud project ID.");
}

if (serviceAccountCredentials) {
  console.log("Genkit: Service account credentials loaded successfully");
} else {
  console.warn("Genkit: No service account credentials found, falling back to API key authentication");
}

// Configure Vertex AI plugin with proper authentication
const vertexAIConfig: any = {
  projectId: projectId,
  location: location,
};

// For Replit environment, we need to set the credentials as environment variable
if (serviceAccountCredentials) {
  // Set the Google Application Credentials environment variable
  process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON = JSON.stringify(serviceAccountCredentials);
  // Also set individual credential fields that Vertex AI might expect
  process.env.GOOGLE_CLOUD_PROJECT = serviceAccountCredentials.project_id;
  process.env.GOOGLE_CLOUD_QUOTA_PROJECT = serviceAccountCredentials.project_id;
  vertexAIConfig.credentials = serviceAccountCredentials;
} else if (activeApiKey) {
  vertexAIConfig.apiKey = activeApiKey;
}

export const ai = genkit({
  plugins: activeApiKey && projectId ?
    [
      vertexAI(vertexAIConfig),
    ] :
    [], // Initialize with no plugins if no valid API key or project ID is found
  model: 'vertexai/gemini-2.0-flash-lite-001', // Updated to use the specific model you requested
});

// --- VERY IMPORTANT NOTES ON VERTEX AI CONFIGURATION ---
//
// 1.  **ENVIRONMENT VARIABLES ARE REQUIRED:**
//     This file now requires these environment variables:
//     - `GOOGLE_API_KEY`: Your Google API key for authentication (fallback)
//     - `VERTEX_AI_PROJECT_ID` or `GOOGLE_CLOUD_PROJECT_ID`: Your Google Cloud project ID
//     - `VERTEX_AI_LOCATION` (optional): Vertex AI location (defaults to us-central1)
//     - `GOOGLE_CREDENTIALS_JSON`: Service account JSON credentials (preferred)
//
// 2.  **VERTEX AI SETUP REQUIREMENTS:**
//     - You need a Google Cloud project with Vertex AI API enabled
//     - Service account with proper permissions for Vertex AI
//     - Make sure billing is enabled on your Google Cloud project
//
// 3.  **AUTHENTICATION:**
//     - Service account credentials (GOOGLE_CREDENTIALS_JSON) are preferred
//     - API key authentication is used as fallback
//     - Ensure your service account has Vertex AI User permissions
//
// 4.  **MODEL CHANGE:**
//     The model has been updated to 'vertexai/gemini-2.0-flash-lite-001' as requested.
//     This is a lightweight version of Gemini 2.0 Flash available through Vertex AI.
//
// 5.  **INITIALIZATION-TIME CONFIGURATION ONLY:**
//     The configuration is selected when your application STARTS or is (RE)DEPLOYED.
//
// 6.  **NO AUTOMATIC RUNTIME FAILOVER:**
//     If the configuration fails during runtime, you need to restart the application
//     after updating your environment variables.
//
// 7.  **CHECK THE LOGS AT STARTUP:**
//     The initialization functions log which configuration they're using.
//     Check your server startup logs to see what decisions are being made.
