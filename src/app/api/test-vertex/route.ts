
import { NextRequest, NextResponse } from 'next/server';
import { testVertexAI, generateAIResponse } from '@/ai/vertex-ai';

export async function HEAD() {
  return new Response(null, { status: 200 });
}

export async function GET() {
  console.log('Test Vertex AI: Starting test...');
  
  try {
    // Test environment variables first
    const projectId = process.env.VERTEX_AI_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT_ID;
    const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
    
    console.log('Environment check:');
    console.log('- Project ID:', projectId ? 'Present' : 'Missing');
    console.log('- Credentials JSON:', credentialsJson ? 'Present' : 'Missing');
    
    if (!projectId || !credentialsJson) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        details: {
          projectId: !!projectId,
          credentials: !!credentialsJson
        }
      }, { status: 500 });
    }

    // Test simple response generation
    console.log('Testing simple AI response...');
    const testResponse = await generateAIResponse('Say "Hello, Vertex AI is working!"');
    
    return NextResponse.json({
      success: true,
      message: 'Vertex AI is working correctly',
      testResponse: testResponse,
      environment: {
        projectId: projectId,
        hasCredentials: true
      }
    });

  } catch (error) {
    console.error('Test Vertex AI: Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
