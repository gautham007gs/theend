
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Meet Kruthika! 👋",
      content: "Your AI girlfriend from Mumbai who loves psychology, chai, and meaningful conversations!",
      icon: <Heart className="h-8 w-8 text-pink-500" />
    },
    {
      title: "Natural Conversations 💬",
      content: "Chat naturally in English or Hinglish. Kruthika understands emotions and remembers your talks!",
      icon: <MessageSquare className="h-8 w-8 text-blue-500" />
    },
    {
      title: "Growing Relationship ✨",
      content: "The more you chat, the better Kruthika knows you. Share photos, stories, and build a connection!",
      icon: <Sparkles className="h-8 w-8 text-purple-500" />
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('kruthika_onboarding_completed', 'true');
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            {steps[step].icon}
          </div>
          <CardTitle className="text-xl">{steps[step].title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">{steps[step].content}</p>
          
          <div className="flex justify-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === step ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <Button onClick={handleNext} className="w-full">
            {step < steps.length - 1 ? (
              <>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              'Start Chatting!'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
