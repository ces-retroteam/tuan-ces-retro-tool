import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Session, Participant, Comment, Action } from '../types';
import { sessions as mockSessions, participants as mockParticipants, comments as mockComments, actions as mockActions } from '../data/mockData';

interface SessionContextType {
  sessions: Session[];
  currentSession: Session | null;
  participants: Participant[];
  comments: Comment[];
  actions: Action[];
  setCurrentSession: (session: Session | null) => void;
  createSession: (session: Omit<Session, 'id' | 'dateCreated' | 'status' | 'currentPhase'>) => Session;
  updateSession: (session: Session) => void;
  addParticipant: (participant: Omit<Participant, 'id' | 'joinedAt'>) => string;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  addAction: (action: Omit<Action, 'id' | 'createdAt'>) => void;
  updateAction: (action: Action) => void;
  deleteAction: (actionId: string) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [actions, setActions] = useState<Action[]>(mockActions);

  const createSession = (sessionData: Omit<Session, 'id' | 'dateCreated' | 'status' | 'currentPhase'>) => {
    const newSession: Session = {
      ...sessionData,
      id: `session-${Date.now()}`,
      dateCreated: new Date().toISOString(),
      status: 'active',
      currentPhase: 'welcome'
    };
    
    setSessions([...sessions, newSession]);
    setCurrentSession(newSession);
    return newSession;
  };

  const updateSession = (updatedSession: Session) => {
    setSessions(sessions.map(session => 
      session.id === updatedSession.id ? updatedSession : session
    ));
    
    if (currentSession?.id === updatedSession.id) {
      setCurrentSession(updatedSession);
    }
  };

  const addParticipant = (participantData: Omit<Participant, 'id' | 'joinedAt'>) => {
    const id = `participant-${Date.now()}`;
    const newParticipant: Participant = {
      ...participantData,
      id,
      joinedAt: new Date().toISOString()
    };
    
    setParticipants([...participants, newParticipant]);
    return id;
  };

  const addComment = (commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...commentData,
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    setComments([...comments, newComment]);
  };

  const addAction = (actionData: Omit<Action, 'id' | 'createdAt'>) => {
    const newAction: Action = {
      ...actionData,
      id: `action-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    setActions([...actions, newAction]);
  };

  const updateAction = (updatedAction: Action) => {
    setActions(actions.map(action => 
      action.id === updatedAction.id ? updatedAction : action
    ));
  };

  const deleteAction = (actionId: string) => {
    setActions(actions.filter(action => action.id !== actionId));
  };

  return (
    <SessionContext.Provider 
      value={{ 
        sessions,
        currentSession, 
        participants,
        comments,
        actions,
        setCurrentSession,
        createSession,
        updateSession,
        addParticipant,
        addComment,
        addAction,
        updateAction,
        deleteAction
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
