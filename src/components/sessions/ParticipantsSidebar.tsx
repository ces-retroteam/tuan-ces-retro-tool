
import React from 'react';
import { useSession } from '@/context/SessionContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

const PLACEHOLDER_IMAGES = [
  'photo-1582562124811-c09040d0a901',
  'photo-1618160702438-9b02ab6515c9',
  'photo-1535268647677-300dbf3d78d1',
  'photo-1501286353178-1ec881214838'
];

export default function ParticipantsSidebar() {
  const { participants } = useSession();
  
  return (
    <Sidebar side="right" variant="floating">
      <SidebarHeader className="pb-0">
        <div className="px-2 py-2">
          <h3 className="font-semibold text-lg">Participants</h3>
          <p className="text-sm text-muted-foreground">
            {participants.length} joined
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Anonymous Users</SidebarGroupLabel>
          <div className="space-y-4 p-4">
            {participants.map((participant, index) => (
              <div key={participant.id} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage 
                    src={`https://images.unsplash.com/${PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length]}`} 
                    alt="Participant avatar" 
                  />
                  <AvatarFallback>P{index + 1}</AvatarFallback>
                </Avatar>
                <span className="text-sm">Participant {index + 1}</span>
              </div>
            ))}
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
