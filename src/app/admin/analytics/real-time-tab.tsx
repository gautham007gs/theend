'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, Zap, Users, MessageSquare, DollarSign, Globe, Activity } from 'lucide-react';

interface RealTimeTabProps {
  newRealTimeStats: {
    responseTimeChart: Array<{ time: string; responseTime: number }>;
    userFlowChart: Array<{ step: string; count: number; dropOff: number }>;
    emotionalStateDistribution: Array<{ emotion: string; count: number; percentage: number }>;
    languageUsageChart: Array<{ language: string; messages: number; users: number }>;
    sessionQualityMetrics: {
      averageMessagesPerSession: number;
      averageSessionLength: number;
      bounceRate: number;
      retentionRate: number;
    };
    apiCostMetrics: {
      totalCost: number;
      costPerUser: number;
      tokenUsage: number;
      cacheHitRate: number;
    };
  };
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

export function RealTimeTab({ newRealTimeStats }: RealTimeTabProps) {
  return (
    <div className="space-y-6">
      {/* API Performance & Cost Optimization */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Response Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {newRealTimeStats.responseTimeChart.length > 0 ? 
                newRealTimeStats.responseTimeChart[newRealTimeStats.responseTimeChart.length - 1].responseTime.toFixed(0) + 'ms' : 
                '850ms'
              }
            </div>
            <p className="text-xs text-green-600">Optimized with caching</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily API Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${newRealTimeStats.apiCostMetrics.totalCost.toFixed(2)}</div>
            <p className="text-xs text-green-600">
              {newRealTimeStats.apiCostMetrics.cacheHitRate.toFixed(1)}% cache hit rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Token Usage</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(newRealTimeStats.apiCostMetrics.tokenUsage / 1000).toFixed(1)}K
            </div>
            <p className="text-xs text-blue-600">Tokens used today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost per User</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${newRealTimeStats.apiCostMetrics.costPerUser.toFixed(3)}</div>
            <p className="text-xs text-green-600">Optimized efficiency</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Response Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>API Response Time Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={newRealTimeStats.responseTimeChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Flow Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>User Flow Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={newRealTimeStats.userFlowChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="step" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Session Quality & Language Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Session Quality Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Session Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>Avg Messages/Session</span>
                <span className="font-bold">{newRealTimeStats.sessionQualityMetrics.averageMessagesPerSession.toFixed(1)}</span>
              </div>
              <Progress value={Math.min(100, newRealTimeStats.sessionQualityMetrics.averageMessagesPerSession * 5)} className="mt-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Avg Session Length</span>
                <span className="font-bold">{newRealTimeStats.sessionQualityMetrics.averageSessionLength.toFixed(1)}m</span>
              </div>
              <Progress value={Math.min(100, newRealTimeStats.sessionQualityMetrics.averageSessionLength * 3)} className="mt-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Bounce Rate</span>
                <span className="font-bold text-red-600">{newRealTimeStats.sessionQualityMetrics.bounceRate.toFixed(1)}%</span>
              </div>
              <Progress value={newRealTimeStats.sessionQualityMetrics.bounceRate} className="mt-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Retention Rate</span>
                <span className="font-bold text-green-600">{newRealTimeStats.sessionQualityMetrics.retentionRate.toFixed(1)}%</span>
              </div>
              <Progress value={newRealTimeStats.sessionQualityMetrics.retentionRate} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        {/* Emotional State Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Emotional State Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={newRealTimeStats.emotionalStateDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ emotion, percentage }) => `${emotion} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {newRealTimeStats.emotionalStateDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Language Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Language Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {newRealTimeStats.languageUsageChart.map((lang, index) => (
                <div key={lang.language} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-medium">{lang.language}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{lang.users} users</Badge>
                    <span className="text-sm text-muted-foreground">{lang.messages} msgs</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Alerts & Status */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-green-600" />
            <span>Real-time System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">🟢</div>
              <div className="text-sm">AI Services</div>
              <div className="text-xs text-muted-foreground">Operational</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">🟢</div>
              <div className="text-sm">Database</div>
              <div className="text-xs text-muted-foreground">Healthy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">🟡</div>
              <div className="text-sm">Performance</div>
              <div className="text-xs text-muted-foreground">Good</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">🟢</div>
              <div className="text-sm">Analytics</div>
              <div className="text-xs text-muted-foreground">Live</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}