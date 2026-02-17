export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string
          status: 'todo' | 'in-progress' | 'done'
          priority: 'low' | 'medium' | 'high'
          deadline: string | null
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string
          status?: 'todo' | 'in-progress' | 'done'
          priority?: 'low' | 'medium' | 'high'
          deadline?: string | null
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string
          status?: 'todo' | 'in-progress' | 'done'
          priority?: 'low' | 'medium' | 'high'
          deadline?: string | null
          position?: number
          created_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          project_id: string
          title: string
          content: string
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title?: string
          content?: string
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          content?: string
          updated_at?: string
          created_at?: string
        }
      }
    }
  }
}

export type Project = Database['public']['Tables']['projects']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type Note = Database['public']['Tables']['notes']['Row']
