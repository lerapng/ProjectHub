import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Task } from '../lib/database.types';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';

interface KanbanBoardProps {
  projectId: string;
}

type Status = 'todo' | 'in-progress' | 'done';

export default function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status>('todo');

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('position', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    deadline: string | null;
  }) => {
    try {
      const { error } = await supabase.from('tasks').insert({
        project_id: projectId,
        ...taskData,
        status: selectedStatus,
      });

      if (error) throw error;
      await loadTasks();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleMoveTask = async (taskId: string, newStatus: Status) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;
      await loadTasks();
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);

      if (error) throw error;
      await loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const columns: { status: Status; title: string; color: string }[] = [
    { status: 'todo', title: 'To Do', color: 'bg-gray-100 border-gray-300' },
    { status: 'in-progress', title: 'In Progress', color: 'bg-blue-50 border-blue-300' },
    { status: 'done', title: 'Done', color: 'bg-green-50 border-green-300' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.status);

        return (
          <div key={column.status} className="flex flex-col">
            <div className={`rounded-lg border-2 ${column.color} p-4 mb-4`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-900">
                  {column.title}
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({columnTasks.length})
                  </span>
                </h3>
                <button
                  onClick={() => {
                    setSelectedStatus(column.status);
                    setShowCreateModal(true);
                  }}
                  className="p-1 hover:bg-white rounded transition"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-3">
                {columnTasks.length === 0 ? (
                  <p className="text-center text-gray-500 text-sm py-8">No tasks yet</p>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onMove={handleMoveTask}
                      onDelete={handleDeleteTask}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        );
      })}

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTask}
        />
      )}
    </div>
  );
}
