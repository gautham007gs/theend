
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    // Check database connectivity
    const { data, error } = await supabase
      .from('messages_log')
      .select('message_id')
      .limit(1);

    const dbStatus = error ? 'unhealthy' : 'healthy';

    // Check environment variables
    const configStatus = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                        process.env.GOOGLE_CREDENTIALS_JSON ? 'healthy' : 'unhealthy';

    const overall = dbStatus === 'healthy' && configStatus === 'healthy' ? 'healthy' : 'degraded';

    return NextResponse.json({
      status: overall,
      timestamp: new Date().toISOString(),
      checks: {
        database: dbStatus,
        config: configStatus,
        memory: process.memoryUsage().heapUsed / 1024 / 1024 + ' MB'
      },
      uptime: process.uptime()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
