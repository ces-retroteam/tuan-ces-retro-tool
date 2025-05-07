
import React from "react";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useSidebar } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Session } from "@/types";

interface CollapsibleSidebarProps {
  session: Session;
  onInvite: () => void;
}

interface UserListItemProps {
  name: string;
  progress: number;
}

const UserListItem = ({ name, progress }: UserListItemProps) => {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="flex items-center gap-3 mb-3">
      <Avatar className="h-8 w-8 bg-muted">
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <Progress 
          value={progress} 
          className="h-1.5 mt-1"
          style={{ 
            backgroundColor: 'var(--secondary)',
          }}
        />
      </div>
    </div>
  );
};

const CollapsibleSidebar = ({ session, onInvite }: CollapsibleSidebarProps) => {
  const { isMobile, state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  // Extract facilitators and participants
  const facilitators = session.participants.filter(p => p.role === "facilitator");
  const participants = session.participants.filter(p => p.role === "participant");
  const totalMembers = facilitators.length + participants.length;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 relative ${isCollapsed ? 'w-16' : 'w-full'}`}>
      {/* Collapse toggle button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute -left-3 top-8 rounded-full w-6 h-6 bg-white dark:bg-gray-800 shadow border border-gray-100 dark:border-gray-700 hidden md:flex" 
        onClick={toggleSidebar}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <Users className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-lg font-semibold truncate">
                {totalMembers} {totalMembers === 1 ? "Member" : "Members"}
              </span>
            )}
          </div>
        </div>
        
        {!isCollapsed && (
          <Button
            variant="default"
            size="lg"
            onClick={onInvite}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            Invite
          </Button>
        )}
      </div>

      {/* User Lists */}
      {!isCollapsed && (
        <>
          {/* Facilitators section */}
          <Collapsible defaultOpen className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Facilitators
              </h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="space-y-1">
                {facilitators.map(facilitator => (
                  <UserListItem
                    key={facilitator.id}
                    name={facilitator.name}
                    progress={facilitator.progress || 0}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Participants section */}
          <Collapsible defaultOpen>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Participants
              </h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="space-y-1">
                {participants.map(participant => (
                  <UserListItem
                    key={participant.id}
                    name={participant.name}
                    progress={participant.progress || 0}
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </>
      )}
    </div>
  );
};

export default CollapsibleSidebar;
