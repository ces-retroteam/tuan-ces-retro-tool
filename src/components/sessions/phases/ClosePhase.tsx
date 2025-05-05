
import { useSession } from '@/context/SessionContext';
import { Session } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import TeamHealthChart from './TeamHealthChart';

interface ClosePhaseProps {
  session: Session;
  isParticipant?: boolean;
}

export default function ClosePhase({ session, isParticipant = false }: ClosePhaseProps) {
  const navigate = useNavigate();
  const { comments, actions } = useSession();
  
  const sessionComments = comments.filter(c => c.sessionId === session.id);
  const sessionActions = actions.filter(a => a.sessionId === session.id);
  const openActions = sessionActions.filter(a => a.status === 'open');
  const completedActions = sessionActions.filter(a => a.status === 'completed');
  
  // Calculate average score
  const avgScoreAllTopics = "3.5";
  
  // Calculate participants count
  const totalParticipants = 12;
  const activeParticipants = 6;
  const participationRate = Math.floor((activeParticipants / totalParticipants) * 100);
  
  const handleFinish = () => {
    navigate('/');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with Key Metrics */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-lg">
        <div className="text-center mb-4">
          <h2 className="text-xl font-medium">This health check has ended</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">{avgScoreAllTopics}/5</span>
            <span className="text-sm mt-1">Overall health</span>
            <span className="text-xs mt-1">by {activeParticipants} participant{activeParticipants !== 1 && 's'}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">{openActions.length} new actions</span>
            <span className="text-xs mt-1">{completedActions.length} existing open actions</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">{participationRate}% participation</span>
            <span className="text-xs mt-1">{activeParticipants}/{totalParticipants} invited participants</span>
          </div>
        </div>
      </div>
      
      {/* Confidence Question */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-center mb-4">How confident are you that we will deliver on time?</h3>
          
          <div className="flex justify-between items-center my-4">
            <div className="w-full grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <div 
                  key={score}
                  className={`p-3 rounded-lg text-center ${
                    score === 1 ? 'bg-red-100' :
                    score === 2 ? 'bg-orange-100' :
                    score === 3 ? 'bg-yellow-100' :
                    score === 4 ? 'bg-blue-100' :
                    'bg-green-100'
                  }`}
                >
                  <div className="text-xl font-bold">{score}</div>
                  <div className="text-xs mt-1">
                    {score === 1 && 'VERY UNCERTAIN'}
                    {score === 2 && 'UNCERTAIN'}
                    {score === 3 && 'SOMEWHAT UNCERTAIN'}
                    {score === 4 && 'CONFIDENT'}
                    {score === 5 && 'VERY CONFIDENT'}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500 mt-2">
            No participants responded
          </div>
        </CardContent>
      </Card>
      
      {/* Exit Button */}
      <div className="flex justify-center mt-4">
        <Button 
          onClick={handleFinish}
          className="bg-[#4AB7D8] hover:bg-[#3da7c7] px-8"
        >
          <Home className="mr-2 h-4 w-4" />
          Exit
        </Button>
      </div>
      
      {/* Actions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Health check fff Health Check</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-3 rounded-lg mb-6 text-center">
            This health check used phases
          </div>
          
          <h3 className="font-medium text-lg mb-4">Team actions</h3>
          <p className="text-sm text-gray-500 mb-4">Actions from this health check</p>
          
          <div className="space-y-3">
            {sessionActions.slice(0, 2).map((action, index) => (
              <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                <div className="w-6 h-6 rounded-full border flex items-center justify-center">
                  <input type="checkbox" className="h-4 w-4" checked={action.status === 'completed'} readOnly />
                </div>
                <span className="flex-grow">{action.text}</span>
                <span className="text-yellow-500 font-bold">=</span>
              </div>
            ))}
          </div>
          
          <h3 className="font-medium text-lg mt-6 mb-4">Other open actions</h3>
          
          <div className="space-y-3">
            {sessionActions.slice(2, 5).map((action, index) => (
              <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                <div className="w-6 h-6 rounded-full border flex items-center justify-center">
                  <input type="checkbox" className="h-4 w-4" checked={action.status === 'completed'} readOnly />
                </div>
                <span className="flex-grow">{action.text}</span>
                <span className="text-yellow-500 font-bold">=</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Team Health Radar Chart */}
      <TeamHealthChart 
        session={session}
        avgScoreAllTopics={avgScoreAllTopics}
        totalComments={sessionComments.length}
      />
    </div>
  );
}
