import { generateResponse, type EmotionalStateInput } from '@/ai/flows/emotional-state-simulation';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body: EmotionalStateInput = await req.json();
    const response = await generateResponse(body);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}