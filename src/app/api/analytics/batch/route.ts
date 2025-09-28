
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { events } = await request.json();
    
    if (!Array.isArray(events)) {
      return NextResponse.json({ error: 'Events must be an array' }, { status: 400 });
    }

    const results = await Promise.allSettled(
      events.map(async (event) => {
        switch (event.type) {
          case 'user_behavior':
            return await trackUserBehavior(event);
          case 'conversation_quality':
            return await trackConversationQuality(event);
          case 'ui_interaction':
            return await trackUIInteraction(event);
          case 'performance':
            return await trackPerformance(event);
          default:
            console.warn('Unknown event type:', event.type);
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      processed: events.length,
      successful,
      failed
    });
  } catch (error: any) {
    console.error('Batch Analytics Error:', error);
    return NextResponse.json(
      { error: 'Failed to process batch analytics', details: error.message },
      { status: 500 }
    );
  }
}

async function trackUserBehavior(event: any) {
  // Store in a user_behavior_log table or extend messages_log
  const { error } = await supabase
    .from('messages_log')
    .insert({
      message_id: `behavior_${Date.now()}_${Math.random()}`,
      sender_type: 'system',
      chat_id: 'analytics',
      text_content: JSON.stringify(event),
      has_image: false
    });
  
  if (error) throw error;
}

async function trackConversationQuality(event: any) {
  // Track conversation metrics
  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabase
    .from('daily_analytics')
    .upsert({
      date: today,
      message_count: event.messageCount,
      response_time: event.averageLength
    }, {
      onConflict: 'date'
    });
  
  if (error) throw error;
}

async function trackUIInteraction(event: any) {
  // Track UI interactions for UX optimization
  console.log('UI Interaction:', event);
}

async function trackPerformance(event: any) {
  // Track performance metrics
  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabase
    .from('daily_analytics')
    .upsert({
      date: today,
      response_time: event.metric === 'response_time' ? event.value : 0
    }, {
      onConflict: 'date'
    });
  
  if (error) throw error;
}
