
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert'; // Added import
import { useToast } from '@/hooks/use-toast';
import { KeyRound, ShieldAlert } from 'lucide-react';
const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok && data.success) {
        toast({ 
          title: 'Login Successful', 
          description: "Welcome to the Admin Panel!" 
        });
        
        // Validate redirect parameter to prevent open redirect attacks
        const urlParams = new URLSearchParams(window.location.search);
        let redirect = urlParams.get('redirect') || '/admin/profile';
        
        // Only allow internal paths starting with / but not // (protocol-relative URLs)
        if (!redirect.startsWith('/') || redirect.startsWith('//') || redirect.includes('://')) {
          redirect = '/admin/profile';
        }
        
        router.push(redirect);
      } else {
        const errorMessage = data.error || 'Invalid login credentials.';
        setError(errorMessage);
        toast({ 
          title: 'Login Failed', 
          description: errorMessage, 
          variant: 'destructive' 
        });
      }
    } catch (err) {
      setIsLoading(false);
      const errorMessage = 'Authentication service unavailable';
      setError(errorMessage);
      toast({ 
        title: 'Login Error', 
        description: errorMessage, 
        variant: 'destructive' 
      });
      console.error('Login error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
            <KeyRound size={32} />
          </div>
          <CardTitle className="text-2xl">Kruthika Chat Admin Panel</CardTitle>
          <CardDescription>Enter your admin credentials to access settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="mb-6 bg-primary/10 border-primary/30">
            <ShieldAlert size={20} className="mr-2 shrink-0 mt-0.5 !text-primary" />
            <div>
              <span className="font-semibold !text-primary">Secure Admin Access:</span> Server-side authentication with cryptographically secure sessions and HttpOnly cookies.
            </div>
          </Alert>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email" // Changed type to email
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com" // Changed placeholder
                required
                className="text-base"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="text-base"
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full text-lg py-3" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
