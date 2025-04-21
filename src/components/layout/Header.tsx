
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useSession } from '@/context/SessionContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { currentSession } = useSession();
  const navigate = useNavigate();
  
  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            TP
          </div>
          <span className="text-xl font-bold">Team Pulse</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {currentSession ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground hidden md:inline-block">
                Current session: {currentSession.name}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/session/${currentSession.id}`)}
              >
                View Session
              </Button>
            </div>
          ) : null /* Remove button here as requested */}
        </div>
      </div>
    </header>
  );
}

