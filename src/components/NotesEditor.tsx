import { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Note } from '../lib/database.types';

interface NotesEditorProps {
  projectId: string;
}

export default function NotesEditor({ projectId }: NotesEditorProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [projectId]);

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('project_id', projectId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleSelectNote = (note: Note) => {
    if (hasChanges && !confirm('You have unsaved changes. Discard them?')) {
      return;
    }
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setHasChanges(false);
  };

  const handleCreateNote = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          project_id: projectId,
          title: 'Untitled Note',
          content: '',
        })
        .select()
        .single();

      if (error) throw error;
      await loadNotes();
      setSelectedNote(data);
      setTitle(data.title);
      setContent(data.content);
      setHasChanges(false);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedNote) return;

    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title,
          content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedNote.id);

      if (error) throw error;
      await loadNotes();
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNote || !confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', selectedNote.id);

      if (error) throw error;
      await loadNotes();
      setSelectedNote(null);
      setTitle('');
      setContent('');
      setHasChanges(false);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Notes</h3>
            <button
              onClick={handleCreateNote}
              className="p-1 hover:bg-gray-100 rounded transition"
              title="New note"
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-2">
            {notes.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-8">No notes yet</p>
            ) : (
              notes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => handleSelectNote(note)}
                  className={`w-full text-left p-3 rounded-lg border transition ${
                    selectedNote?.id === note.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <h4 className="font-semibold text-sm text-gray-900 mb-1 truncate">
                    {note.title}
                  </h4>
                  <p className="text-xs text-gray-500">{formatDate(note.updated_at)}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-3">
        {selectedNote ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setHasChanges(true);
                }}
                className="flex-1 text-2xl font-bold text-gray-900 border-0 border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition"
                placeholder="Note title"
              />
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={handleSaveNote}
                  disabled={!hasChanges}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleDeleteNote}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setHasChanges(true);
              }}
              className="w-full h-[500px] border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Start typing your note..."
            />

            {hasChanges && (
              <p className="text-sm text-amber-600 mt-2">You have unsaved changes</p>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No note selected</h3>
            <p className="text-gray-600 mb-6">Select a note from the sidebar or create a new one</p>
            <button
              onClick={handleCreateNote}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
