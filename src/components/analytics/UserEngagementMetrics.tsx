
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, MessageSquare, Clock } from 'lucide-react';

interface EngagementData {
  avgSessionDuration: number;
  returnUserRate: number;
  messagesPerSession: number;
  userSatisfactionScore: number;
}

interface UserEngagementMetricsProps {
  data: EngagementData;
}

export default function UserEngagementMetrics({ data }: UserEngagementMetricsProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatDuration(data.avgSessionDuration)}</div>
          <p className="text-xs text-muted-foreground">
            {data.avgSessionDuration > 900 ? '+12%' : '-5%'} from last week
          </p>
          <Progress 
            value={(data.avgSessionDuration / 1800) * 100} 
            className="mt-2"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Return User Rate</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.returnUserRate}%</div>
          <p className="text-xs text-muted-foreground">
            {data.returnUserRate > 40 ? '+8%' : '-2%'} from last week
          </p>
          <Progress value={data.returnUserRate} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Messages per Session</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.messagesPerSession.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">
            {data.messagesPerSession > 15 ? '+15%' : '-3%'} from last week
          </p>
          <Progress 
            value={(data.messagesPerSession / 30) * 100} 
            className="mt-2"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.userSatisfactionScore}%</div>
          <p className="text-xs text-muted-foreground">
            {data.userSatisfactionScore > 85 ? '+6%' : '-1%'} from last week
          </p>
          <Progress value={data.userSatisfactionScore} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}
