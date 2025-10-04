
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('ai_profile')
      .select('settings')
      .eq('profile_id', 'kruthika')
      .maybeSingle();

    if (error) {
      console.error('API Route: Error fetching AI profile:', error);
      return NextResponse.json({ data: null, error }, { status: 500 });
    }

    return NextResponse.json({ data, error: null }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('API Route: Exception fetching AI profile:', error);
    return NextResponse.json({ 
      data: null, 
      error: { message: 'Server error' } 
    }, { status: 500 });
  }
}
