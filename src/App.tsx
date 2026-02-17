import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProjectWorkspace from './pages/ProjectWorkspace';

type View = 'dashboard' | 'project';

function App() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<View>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleOpenProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setView('project');
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
    setSelectedProjectId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <>
      {view === 'dashboard' && <Dashboard onOpenProject={handleOpenProject} />}
      {view === 'project' && selectedProjectId && (
        <ProjectWorkspace projectId={selectedProjectId} onBack={handleBackToDashboard} />
      )}
    </>
  );
}

export default App;
