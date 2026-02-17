import { useState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Project } from '../lib/database.types';

interface ProjectSettingsProps {
  project: Project;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function ProjectSettings({ project, onUpdate, onDelete }: ProjectSettingsProps) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ title, description })
        .eq('id', project.id);

      if (error) throw error;
      setHasChanges(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this project? All tasks and notes will be permanently deleted.'
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase.from('projects').delete().eq('id', project.id);

      if (error) throw error;
      onDelete();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Project Settings</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Project Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setHasChanges(true);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setHasChanges(true);
              }}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-red-200 p-6">
        <h2 className="text-xl font-bold text-red-900 mb-2">Danger Zone</h2>
        <p className="text-gray-600 mb-4">
          Once you delete a project, there is no going back. All tasks and notes will be
          permanently deleted.
        </p>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Delete Project
        </button>
      </div>
    </div>
  );
}
