/**
 * Supabase Database Types
 * Generated types for the database schema
 * 
 * Note: In a production setup, you would generate these automatically using:
 * npx supabase gen types TypeScript --project-id tjvfbmtprqxnyweziiqg > src/services/supabase/supabaseTypes.ts
 */

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          name: string;
          slug: string;
          avatar_url: string | null;
          brand_color: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          avatar_url?: string | null;
          brand_color?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          avatar_url?: string | null;
          brand_color?: string | null;
          description?: string | null;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'admin' | 'client';
          client_id: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: 'admin' | 'client';
          client_id?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          role?: 'admin' | 'client';
          client_id?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      content: {
        Row: {
          id: string;
          client_id: string;
          type: 'post' | 'story' | 'reel' | 'carousel';
          status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
          platform: 'instagram' | 'tiktok' | 'facebook' | null;
          source: 'calendar' | 'grid';
          scheduled_date: string | null;
          scheduled_time: string | null;
          caption: string | null;
          creative_description: string | null;
          cover_image_url: string | null;
          thumbnail_url: string | null;
          notes: string | null;
          technical_instructions: string | null;
          rejection_reason: string | null;
          grid_order: number;
          grid_zoom: number;
          grid_offset_x: number;
          grid_offset_y: number;
          created_by: string | null;
          approved_by: string | null;
          approved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          type: 'post' | 'story' | 'reel' | 'carousel';
          status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
          platform?: 'instagram' | 'tiktok' | 'facebook' | null;
          source?: 'calendar' | 'grid';
          scheduled_date?: string | null;
          scheduled_time?: string | null;
          caption?: string | null;
          creative_description?: string | null;
          cover_image_url?: string | null;
          thumbnail_url?: string | null;
          notes?: string | null;
          technical_instructions?: string | null;
          rejection_reason?: string | null;
          grid_order?: number;
          grid_zoom?: number;
          grid_offset_x?: number;
          grid_offset_y?: number;
          created_by?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          client_id?: string;
          type?: 'post' | 'story' | 'reel' | 'carousel';
          status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
          platform?: 'instagram' | 'tiktok' | 'facebook' | null;
          source?: 'calendar' | 'grid';
          scheduled_date?: string | null;
          scheduled_time?: string | null;
          caption?: string | null;
          creative_description?: string | null;
          cover_image_url?: string | null;
          thumbnail_url?: string | null;
          notes?: string | null;
          technical_instructions?: string | null;
          rejection_reason?: string | null;
          grid_order?: number;
          grid_zoom?: number;
          grid_offset_x?: number;
          grid_offset_y?: number;
          approved_by?: string | null;
          approved_at?: string | null;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          client_id: string;
          title: string;
          description: string | null;
          event_date: string;
          color: 'red' | 'blue' | 'beige' | 'brown' | 'black';
          item_type: 'event' | 'task';
          is_completed: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          title: string;
          description?: string | null;
          event_date: string;
          color?: 'red' | 'blue' | 'beige' | 'brown' | 'black';
          item_type?: 'event' | 'task';
          is_completed?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          client_id?: string;
          title?: string;
          description?: string | null;
          event_date?: string;
          color?: 'red' | 'blue' | 'beige' | 'brown' | 'black';
          item_type?: 'event' | 'task';
          is_completed?: boolean;
          updated_at?: string;
        };
      };
      event_requests: {
        Row: {
          id: string;
          client_id: string;
          requested_by: string;
          title: string;
          description: string | null;
          requested_date: string;
          status: 'pending' | 'approved' | 'rejected';
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          requested_by: string;
          title: string;
          description?: string | null;
          requested_date: string;
          status?: 'pending' | 'approved' | 'rejected';
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          requested_date?: string;
          status?: 'pending' | 'approved' | 'rejected';
          reviewed_by?: string | null;
          reviewed_at?: string | null;
        };
      };
      monthly_themes: {
        Row: {
          id: string;
          client_id: string;
          month: number;
          year: number;
          theme_text: string | null;
          backdrop_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          month: number;
          year: number;
          theme_text?: string | null;
          backdrop_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          theme_text?: string | null;
          backdrop_url?: string | null;
          updated_at?: string;
        };
      };
      stickers: {
        Row: {
          id: string;
          client_id: string;
          month: number;
          year: number;
          sticker_type: string;
          lucide_icon: string | null;
          icon_type: 'lucide' | 'custom';
          color: string | null;
          label: string | null;
          position_x: number;
          position_y: number;
          rotation: number;
          scale: number;
          custom_image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          month: number;
          year: number;
          sticker_type: string;
          lucide_icon?: string | null;
          icon_type?: 'lucide' | 'custom';
          color?: string | null;
          label?: string | null;
          position_x: number;
          position_y: number;
          rotation?: number;
          scale?: number;
          custom_image_url?: string | null;
          created_at?: string;
        };
        Update: {
          sticker_type?: string;
          lucide_icon?: string | null;
          icon_type?: 'lucide' | 'custom';
          color?: string | null;
          label?: string | null;
          position_x?: number;
          position_y?: number;
          rotation?: number;
          scale?: number;
          custom_image_url?: string | null;
        };
      };
      custom_sticker_bank: {
        Row: {
          id: string;
          client_id: string;
          image_url: string;
          label: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          image_url: string;
          label: string;
          created_at?: string;
        };
        Update: {
          image_url?: string;
          label?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'content_pending' | 'publish_reminder' | 'content_approved' | 'new_request' | 'event_request' | 'new_comment';
          title: string;
          message: string | null;
          content_id: string | null;
          comment_id: string | null;
          event_request_id: string | null;
          client_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'content_pending' | 'publish_reminder' | 'content_approved' | 'new_request' | 'event_request' | 'new_comment';
          title: string;
          message?: string | null;
          content_id?: string | null;
          comment_id?: string | null;
          event_request_id?: string | null;
          client_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          type?: 'content_pending' | 'publish_reminder' | 'content_approved' | 'new_request' | 'event_request' | 'new_comment';
          title?: string;
          message?: string | null;
          comment_id?: string | null;
          is_read?: boolean;
        };
      };
      content_comments: {
        Row: {
          id: string;
          content_id: string;
          user_id: string;
          message: string;
          author_name: string | null;
          author_role: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          content_id: string;
          user_id: string;
          message: string;
          author_name?: string | null;
          author_role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          message?: string;
          author_name?: string | null;
          author_role?: string | null;
          updated_at?: string;
        };
      };
      content_media: {
        Row: {
          id: string;
          content_id: string;
          media_url: string;
          media_type: 'image' | 'video';
          storage_key: string | null;
          sort_order: number;
          width: number | null;
          height: number | null;
          file_size: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          content_id: string;
          media_url: string;
          media_type?: 'image' | 'video';
          storage_key?: string | null;
          sort_order?: number;
          width?: number | null;
          height?: number | null;
          file_size?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          media_url?: string;
          media_type?: 'image' | 'video';
          storage_key?: string | null;
          sort_order?: number;
          width?: number | null;
          height?: number | null;
          file_size?: number | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      get_my_client_id: {
        Args: Record<string, never>;
        Returns: string | null;
      };
      get_my_role: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];

// Convenience type aliases
export type ClientRow = Tables<'clients'>;
export type ProfileRow = Tables<'profiles'>;
export type ContentRow = Tables<'content'>;
export type ContentMediaRow = Tables<'content_media'>;
export type EventRow = Tables<'events'>;
export type EventRequestRow = Tables<'event_requests'>;
export type NotificationRow = Tables<'notifications'>;
export type ContentCommentRow = Tables<'content_comments'>;
