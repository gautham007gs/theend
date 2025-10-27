import React, { useState, useRef, useCallback } from 'react';
import { Send, Paperclip, Smile, Mic, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSendMessage: (text: string, imageUri?: string) => void;
  isAiTyping: boolean;
}

const LAST_MESSAGE_TIME_KEY = 'kruthika_last_message_time';
const MESSAGE_COOLDOWN_MS = 2000;
const SHORT_MESSAGE_SPAM_THRESHOLD = 3;
const SHORT_MESSAGE_SPAM_WINDOW_MS = 10000;
const SHORT_MESSAGE_SPAM_KEY = 'kruthika_short_message_spam_count';
const SHORT_MESSAGE_SPAM_TIME_KEY = 'kruthika_short_message_spam_time';

const isMessageMeaningless = (text: string): boolean => {
  const trimmed = text.trim();
  if (!trimmed) return true;
  if (trimmed.length > 2) return false;

  const emojiRegex = /^[\p{Emoji}\p{Emoji_Component}]+$/u;
  const punctuationRegex = /^[.,!?;:'"()\-_+={}[\]|\\/<>@#$%^&*~`]+$/;
  const singleCharRegex = /^[a-zA-Z0-9]$/;

  return emojiRegex.test(trimmed) || punctuationRegex.test(trimmed) || singleCharRegex.test(trimmed);
};

const checkSpamRate = (): { isSpam: boolean; message?: string } => {
  const lastMessageTime = localStorage.getItem(LAST_MESSAGE_TIME_KEY);
  const now = Date.now();

  if (lastMessageTime) {
    const timeSinceLastMessage = now - parseInt(lastMessageTime);
    if (timeSinceLastMessage < MESSAGE_COOLDOWN_MS) {
      return {
        isSpam: true,
        message: `Please wait ${Math.ceil((MESSAGE_COOLDOWN_MS - timeSinceLastMessage) / 1000)} seconds before sending another message`
      };
    }
  }

  return { isSpam: false };
};

const checkShortMessageSpam = (text: string): { isSpam: boolean; message?: string } => {
  if (!isMessageMeaningless(text)) return { isSpam: false };

  const now = Date.now();
  const spamCount = parseInt(localStorage.getItem(SHORT_MESSAGE_SPAM_KEY) || '0');
  const spamTime = parseInt(localStorage.getItem(SHORT_MESSAGE_SPAM_TIME_KEY) || '0');

  if (now - spamTime > SHORT_MESSAGE_SPAM_WINDOW_MS) {
    localStorage.setItem(SHORT_MESSAGE_SPAM_KEY, '1');
    localStorage.setItem(SHORT_MESSAGE_SPAM_TIME_KEY, now.toString());
    return {
      isSpam: false
    };
  }

  const newCount = spamCount + 1;
  localStorage.setItem(SHORT_MESSAGE_SPAM_KEY, newCount.toString());

  if (newCount >= SHORT_MESSAGE_SPAM_THRESHOLD) {
    return {
      isSpam: true,
      message: 'Please send a proper message instead of single characters or emojis. This helps reduce costs! 💰'
    };
  }

  return { isSpam: false };
};

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isAiTyping }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State for emoji picker visibility
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Max 2MB
        toast({
          title: "Image Too Large",
          description: "Max image size is 2MB. Please select a smaller image.",
          variant: "destructive",
          duration: 5000,
        });
        if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please select a JPG, PNG, WEBP, or GIF image.",
          variant: "destructive",
          duration: 5000,
        });
        if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        // If input is empty, we can send image directly.
        if (!inputValue.trim()) {
            onSendMessage("", reader.result as string);
            setSelectedImage(null);
            if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = useCallback((e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const textToSend = inputValue.trim();
    const imageToSend = selectedImage;

    if (!textToSend && !imageToSend) return;

    const spamCheck = checkSpamRate();
    if (spamCheck.isSpam) {
      toast({
        title: "Slow down! ⏱️",
        description: spamCheck.message,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const shortMessageCheck = checkShortMessageSpam(textToSend);
    if (shortMessageCheck.isSpam && !imageToSend) {
      toast({
        title: "Message Blocked",
        description: shortMessageCheck.message,
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    localStorage.setItem(LAST_MESSAGE_TIME_KEY, Date.now().toString());

    if (textToSend || imageToSend) {
      setIsLoading(true); // Set loading state
      onSendMessage(textToSend, imageToSend || undefined);
      setInputValue('');
      setSelectedImage(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      if(fileInputRef.current) fileInputRef.current.value = "";
      textareaRef.current?.focus();
      setIsLoading(false); // Reset loading state after sending
    }
  }, [inputValue, selectedImage, onSendMessage, toast]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Typing indicator
    if (!isTyping) setIsTyping(true);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 96)}px`;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end p-2 sm:p-3 bg-chat-input-bg border-t border-border gap-1 sm:gap-2"
    >
      <Button 
        type="button" 
        variant="ghost" 
        size="icon" 
        onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
        className="text-muted-foreground hover:text-foreground/80 self-end shrink-0 h-9 w-9 sm:h-10 sm:w-10"
        aria-label={showEmojiPicker ? "Close emoji picker" : "Open emoji picker"}
      >
        <Smile className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
      <Textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-card rounded-lg shadow-sm custom-scrollbar py-2 px-3 text-sm leading-tight max-h-20 sm:max-h-24 min-h-[2.25rem]" 
        rows={1}
      />
      {inputValue.trim() || selectedImage ? (
        <Button 
          type="submit" 
          size="icon" 
          className="bg-primary hover:bg-primary/90 self-end shrink-0 h-9 w-9 sm:h-10 sm:w-10"
          aria-label={isLoading ? "Sending message" : "Send message"}
        >
          {isLoading ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : <Send className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />}
        </Button>
      ) : (
        <Button 
          variant="ghost" 
          size="icon" 
          type="button" 
          className="text-muted-foreground hover:text-foreground/80 self-end shrink-0 h-9 w-9 sm:h-10 sm:w-10"
          aria-label="Open microphone input"
        >
          <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      )}
       <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/jpeg,image/png,image/webp,image/gif" 
        className="hidden" 
        onChange={handleImageChange} 
        id="file-upload-input"
        aria-label="Upload image file"
      />
      <Button 
        variant="ghost" 
        size="icon" 
        type="button" 
        className="text-muted-foreground hover:text-foreground/80 self-end shrink-0 h-9 w-9 sm:h-10 sm:w-10"
        onClick={() => fileInputRef.current?.click()}
        aria-label="Attach image to message"
      >
        <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
    </form>
  );
};

export default ChatInput;