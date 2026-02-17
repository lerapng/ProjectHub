import { useEffect, useState } from 'react';
import { ArrowLeft, KanbanSquare, FileText, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Project } from '../lib/database.types';
import KanbanBoard from '../components/KanbanBoard';
import NotesEditor from '../components/NotesEditor';
import ProjectSettings from '../components/ProjectSettings';

type Tab = 'kanban' | 'notes' | 'settings';

interface ProjectWorkspaceProps {
  projectId: string;
  onBack: () => void;
}

export default function ProjectWorkspace({ projectId, onBack }: ProjectWorkspaceProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('kanban');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .maybeSingle();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectUpdate = () => {
    loadProject();
  };

  const handleProjectDelete = () => {
    onBack();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-gray-600">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-gray-600">Project not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>

            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
              {project.description && (
                <p className="text-gray-600 mt-1">{project.description}</p>
              )}
            </div>

            <nav className="flex gap-2">
              <button
                onClick={() => setActiveTab('kanban')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'kanban'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <KanbanSquare className="w-4 h-4" />
                Kanban Board
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'notes'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                Knowledge Base
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'kanban' && <KanbanBoard projectId={projectId} />}
        {activeTab === 'notes' && <NotesEditor projectId={projectId} />}
        {activeTab === 'settings' && (
          <ProjectSettings
            project={project}
            onUpdate={handleProjectUpdate}
            onDelete={handleProjectDelete}
          />
        )}
      </main>
    </div>
  );
}
