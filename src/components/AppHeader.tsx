"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquareText, Users, MoreVertical, BookOpen, Info, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  title: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Chats', href: '/', icon: <MessageSquareText size={20} /> },
    { name: 'Status', href: '/status', icon: <Users size={20} /> },
  ];

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-3xl">
        <Link href="/" className="text-xl font-semibold hover:opacity-80 transition-opacity">
          {title}
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <MoreVertical size={24} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/blog" className="flex items-center gap-2 w-full cursor-pointer">
                <BookOpen size={16} />
                <span>Blog</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/legal/privacy" className="flex items-center gap-2 w-full cursor-pointer">
                <Shield size={16} />
                <span>Privacy Policy</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/legal/terms" className="flex items-center gap-2 w-full cursor-pointer">
                <Info size={16} />
                <span>Terms of Service</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <nav className="bg-primary">
        <div className="container mx-auto flex justify-around items-center max-w-3xl">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href as any}
              className={cn(
                "flex-1 py-3 text-center text-sm font-medium flex flex-col items-center gap-1 transition-colors",
                pathname === item.href
                  ? 'text-primary-foreground border-b-2 border-primary-foreground/90'
                  : 'text-primary-foreground/70 hover:text-primary-foreground/90',
                "hover:bg-primary-foreground/10"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;