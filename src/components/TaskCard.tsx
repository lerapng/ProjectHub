import { ArrowLeft, ArrowRight, Trash2, Calendar } from 'lucide-react';
import type { Task } from '../lib/database.types';

interface TaskCardProps {
  task: Task;
  onMove: (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => void;
  onDelete: (taskId: string) => void;
}

export default function TaskCard({ task, onMove, onDelete }: TaskCardProps) {
  const priorityColors = {
    low: 'bg-gray-100 text-gray-700 border-gray-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    high: 'bg-red-100 text-red-700 border-red-300',
  };

  const canMoveLeft = task.status !== 'todo';
  const canMoveRight = task.status !== 'done';

  const getNewStatus = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      return task.status === 'done' ? 'in-progress' : 'todo';
    } else {
      return task.status === 'todo' ? 'in-progress' : 'done';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 flex-1">{task.title}</h4>
        <span
          className={`text-xs font-medium px-2 py-1 rounded border ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      {task.deadline && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <Calendar className="w-3 h-3" />
          {formatDate(task.deadline)}
        </div>
      )}

      <div className="flex items-center gap-2">
        {canMoveLeft && (
          <button
            onClick={() => onMove(task.id, getNewStatus('left'))}
            className="p-1 hover:bg-gray-100 rounded transition"
            title="Move left"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {canMoveRight && (
          <button
            onClick={() => onMove(task.id, getNewStatus('right'))}
            className="p-1 hover:bg-gray-100 rounded transition"
            title="Move right"
          >
            <ArrowRight className="w-4 h-4 text-gray-600" />
          </button>
        )}

        <div className="flex-1" />

        <button
          onClick={() => onDelete(task.id)}
          className="p-1 hover:bg-red-50 rounded transition"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );
}
