import { Calendar } from 'lucide-react';
import type { Project } from '../lib/database.types';

interface ProjectCardProps {
  project: Project;
  onOpen: () => void;
}

export default function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
        {project.title}
      </h3>

      <p className="text-gray-600 mb-4 line-clamp-3 min-h-[60px]">
        {project.description || 'No description'}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          {formatDate(project.created_at)}
        </div>

        <button
          onClick={onOpen}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
        >
          Open
        </button>
      </div>
    </div>
  );
}
