
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, CheckCircle, XCircle } from 'lucide-react';

interface SecurityAuditResult {
  overallScore: number;
  grade: string;
  categories: Record<string, { score: number; issues: string[]; recommendations: string[] }>;
  summary: string;
}

export default function SecurityMonitoringTab() {
  const [auditResult, setAuditResult] = useState<SecurityAuditResult | null>(null);
  const [loading, setLoading] = useState(true);

  const performSecurityAudit = async () => {
    setLoading(true);
    try {
      // Import and run security audit
      const { SecurityAudit } = await import('@/lib/security-audit');
      const result = SecurityAudit.performFullAudit();
      setAuditResult(result);
    } catch (error) {
      console.error('Security audit failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSecurityAudit();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Running security audit...</p>
        </div>
      </div>
    );
  }

  if (!auditResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Security Audit Failed</CardTitle>
          <CardDescription>Unable to perform security audit</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D': case 'F': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Overall Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Audit Results
            <Badge className={getGradeColor(auditResult.grade)}>
              Grade: {auditResult.grade}
            </Badge>
          </CardTitle>
          <CardDescription>
            Comprehensive security assessment of your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(auditResult.overallScore)}`}>
                {auditResult.overallScore}/100
              </div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm">{auditResult.summary}</p>
              <Button 
                onClick={performSecurityAudit} 
                size="sm" 
                className="mt-2"
              >
                Re-run Audit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(auditResult.categories).map(([category, data]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="capitalize">{category.replace(/([A-Z])/g, ' $1')}</span>
                <div className={`flex items-center gap-1 ${getScoreColor(data.score)}`}>
                  {data.score >= 90 ? <CheckCircle className="h-4 w-4" /> : 
                   data.score >= 70 ? <AlertTriangle className="h-4 w-4" /> : 
                   <XCircle className="h-4 w-4" />}
                  <span className="font-bold">{data.score}%</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.issues.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-red-600 mb-1">Issues:</h4>
                  <ul className="text-xs space-y-1">
                    {data.issues.map((issue, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <XCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {data.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-blue-600 mb-1">Recommendations:</h4>
                  <ul className="text-xs space-y-1">
                    {data.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <CheckCircle className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Security Actions</CardTitle>
          <CardDescription>
            Immediate actions to improve security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button variant="outline" size="sm">
              Update Passwords
            </Button>
            <Button variant="outline" size="sm">
              Review IP Blocks
            </Button>
            <Button variant="outline" size="sm">
              Check Certificates
            </Button>
            <Button variant="outline" size="sm">
              Audit Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
