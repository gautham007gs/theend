
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceControllerProps {
  onVoiceMessage: (text: string) => void;
  isAiSpeaking: boolean;
  onToggleAiVoice: () => void;
}

export default function VoiceController({ 
  onVoiceMessage, 
  isAiSpeaking, 
  onToggleAiVoice 
}: VoiceControllerProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-IN';

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          onVoiceMessage(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, [onVoiceMessage]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1.1; // Slightly higher pitch for feminine voice
      speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={isListening ? "default" : "outline"}
        size="sm"
        onClick={isListening ? stopListening : startListening}
        className="p-2"
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      
      <Button
        variant={isAiSpeaking ? "default" : "outline"}
        size="sm"
        onClick={onToggleAiVoice}
        className="p-2"
      >
        {isAiSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
    </div>
  );
}
