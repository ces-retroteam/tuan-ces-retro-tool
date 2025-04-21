
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { templates } from '@/data/templates';
import { Template } from '@/types';
import TemplateCard from '@/components/sessions/TemplateCard';
import CreateSessionForm from '@/components/sessions/CreateSessionForm';

const CreateSession = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  const handleBack = () => {
    if (selectedTemplate) {
      setSelectedTemplate(null);
    } else {
      navigate('/');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Session</h1>
          <p className="text-muted-foreground mt-1">
            {selectedTemplate 
              ? `Configure your session using the ${selectedTemplate.name} template` 
              : 'Select a template to start your session'}
          </p>
        </div>

        {!selectedTemplate ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={setSelectedTemplate}
              />
            ))}
          </div>
        ) : (
          <CreateSessionForm template={selectedTemplate} onBack={handleBack} />
        )}
      </div>
    </Layout>
  );
};

export default CreateSession;
