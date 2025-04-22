
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import SessionTemplateDialog from '@/components/sessions/SessionTemplateDialog';

const Index = () => {
  const { sessions } = useSession();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  return (
    <Layout>
      <SessionTemplateDialog open={showDialog} onOpenChange={setShowDialog} />
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Team Pulse</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage team health check sessions
            </p>
          </div>
          <Button 
            className="self-start md:self-center"
            onClick={() => setShowDialog(true)}
          >
            New Retrospective
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

