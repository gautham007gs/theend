
import {genkit} from 'genkit';
import {vertexAI} from '@genkit-ai/vertexai';

// -----------------------------------------------------------------------------
// Genkit AI Initialization with Vertex AI (Gemini)
// -----------------------------------------------------------------------------

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

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // !!! HEY! IF YOU ARE IN FIREBASE STUDIO AND process.env ISN'T WORKING  !!!
  // !!! YOU CAN TEMPORARILY HARDCODE YOUR KEY HERE FOR TESTING.           !!!
  // !!!                                                                     !!!
  // !!! **CRITICAL**: DO NOT COMMIT THIS HARDCODED KEY TO GIT OR DEPLOY IT! !!!
  // !!! REMOVE IT OR COMMENT IT OUT BEFORE PUSHING TO GITHUB/VERCEL!        !!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const studioDevApiKey = "YOUR_GEMINI_API_KEY_HERE_FOR_STUDIO_TESTING"; // <<<<<<< REPLACE THIS WITH YOUR ACTUAL KEY FOR STUDIO
  if (studioDevApiKey && studioDevApiKey !== "YOUR_GEMINI_API_KEY_HERE_FOR_STUDIO_TESTING" && studioDevApiKey.length >= MIN_API_KEY_LENGTH) {
      console.warn("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.warn("!!! Genkit: WARNING! Using TEMPORARY hardcoded API key for Firebase Studio testing.        !!!");
      console.warn("!!! This is NOT secure for production. REMOVE before committing or deploying!              !!!");
      console.warn("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      return studioDevApiKey;
  }

  console.error(
    "CRITICAL Genkit Error: No valid Gemini API Key found for initialization. " +
    "All checked environment variables (GOOGLE_API_KEY, GEMINI_API_KEY_1, etc.) " +
    "are undefined, empty, too short, or appear invalid. AI features will NOT work. " +
    "Please ensure at least one valid API key is correctly set in your environment variables " +
    "OR for Firebase Studio testing, temporarily hardcode it in src/ai/genkit.ts (and remove before commit/deploy)."
  );
  return undefined;
};

// Get project ID from environment variable
const getProjectId = (): string | undefined => {
  const projectId = process.env.VERTEX_AI_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT_ID;
  if (!projectId) {
    console.warn("Genkit: No VERTEX_AI_PROJECT_ID or GOOGLE_CLOUD_PROJECT_ID found. Vertex AI may not work properly.");
  }
  return projectId;
};

// Get location from environment variable (default to us-central1)
const getLocation = (): string => {
  return process.env.VERTEX_AI_LOCATION || 'us-central1';
};

const activeApiKey = getApiKey();
const projectId = getProjectId();
const location = getLocation();

if (!activeApiKey) {
  console.error("Genkit: AI plugin NOT initialized due to missing valid API key. AI functionalities will be disabled.");
}

if (activeApiKey && !projectId) {
  console.warn("Genkit: API key found but no project ID configured. Vertex AI requires a Google Cloud project ID.");
}

export const ai = genkit({
  plugins: activeApiKey && projectId ?
    [
      vertexAI({
        apiKey: activeApiKey,
        projectId: projectId,
        location: location,
      }),
    ] :
    [], // Initialize with no plugins if no valid API key or project ID is found
  model: 'vertexai/gemini-2.0-flash-thinking-exp', // Updated model for Vertex AI
});


// --- VERY IMPORTANT NOTES ON API KEY AND PROJECT MANAGEMENT ---
//
// 1.  **ENVIRONMENT VARIABLES ARE REQUIRED:**
//     This file now requires TWO environment variables:
//     - `GOOGLE_API_KEY` (or backup keys): Your Google API key for authentication
//     - `VERTEX_AI_PROJECT_ID` or `GOOGLE_CLOUD_PROJECT_ID`: Your Google Cloud project ID
//     - `VERTEX_AI_LOCATION` (optional): Vertex AI location (defaults to us-central1)
//
// 2.  **VERTEX AI SETUP REQUIREMENTS:**
//     - You need a Google Cloud project with Vertex AI API enabled
//     - The API key must have permissions to access Vertex AI in your project
//     - Make sure billing is enabled on your Google Cloud project
//
// 3.  **FIREBASE STUDIO TESTING (Temporary Hardcoding):**
//     If `process.env` variables are not available in your current Firebase Studio
//     session, a temporary fallback to a hardcoded `studioDevApiKey` has been added above.
//     YOU MUST:
//         a. REPLACE `"YOUR_GEMINI_API_KEY_HERE_FOR_STUDIO_TESTING"` with your actual key.
//         b. **CRITICAL:** REMOVE or comment out this hardcoded key before committing
//            your code to Git or deploying to any production/staging environment.
//            Exposing API keys in version control is a major security risk.
//
// 4.  **MODEL CHANGE:**
//     The model has been updated to 'vertexai/gemini-2.0-flash-thinking-exp' which is
//     available through Vertex AI. This provides enhanced capabilities compared to
//     the previous Google AI model.
//
// 5.  **INITIALIZATION-TIME KEY SELECTION ONLY:**
//     The `getApiKey` function selects ONE API key when your application
//     STARTS or is (RE)DEPLOYED.
//
// 6.  **NO AUTOMATIC RUNTIME FAILOVER OR SWITCHING:**
//     If the API key or project configuration that was active at startup becomes
//     invalid, exhausted, or hits quota limits WHILE THE APP IS RUNNING,
//     Genkit calls using that configuration WILL START FAILING.
//     The application **WILL NOT AUTOMATICALLY** try another configuration at that point.
//
// 7.  **MANUAL INTERVENTION REQUIRED FOR RUNTIME FAILURES (in deployed environments):**
//     If your active configuration fails during runtime:
//     a.  You need to **UPDATE YOUR ENVIRONMENT VARIABLES** in your hosting provider
//         (e.g., Vercel) or local .env file to point to working credentials.
//     b.  You **MUST THEN REDEPLOY OR RESTART** your application.
//
// 8.  **CHECK THE LOGS AT STARTUP:**
//     The initialization functions log which key source and project configuration
//     they're using. Check your server startup logs to see what decisions are being made.
