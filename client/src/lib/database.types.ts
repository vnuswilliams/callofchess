export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Table<T> = { Row: T; Insert: Partial<T>; Update: Partial<T>; Relationships: [] };

export type Database = {
  public: {
    Tables: {
      learning_levels: Table<{
        id: string;
        slug: string;
        title_fr: string;
        title_en: string;
        summary_fr: string;
        summary_en: string;
        milestone_fr: string;
        milestone_en: string;
        prerequisite_id: string | null;
        sort_order: number;
        created_at: string;
      }>;
      lessons: Table<{
        id: string;
        level_id: string | null;
        sort_order: number;
        title_fr: string;
        title_en: string;
        kicker_fr: string;
        kicker_en: string;
        headline_fr: string;
        headline_en: string;
        objective_fr: string;
        objective_en: string;
        starting_fen: string;
        steps: Json;
        solution_fr: string;
        solution_en: string;
        is_published: boolean;
        created_at: string;
        updated_at: string;
      }>;
      lesson_exercises: Table<{
        id: string;
        lesson_id: string | null;
        level_id: string | null;
        kind: string;
        sort_order: number;
        title_fr: string;
        title_en: string;
        goal_fr: string;
        goal_en: string;
        prompt_fr: string;
        prompt_en: string;
        solution_fr: string;
        solution_en: string;
        position_fen: string | null;
        expected_san: string | null;
        created_at: string;
      }>;
      lesson_progress: Table<{
        user_id: string;
        lesson_id: string;
        completed_steps: number;
        current_fen: string | null;
        move_history: Json;
        completed: boolean;
        updated_at: string;
      }>;
    };
    Views: Record<string, never>;
    Functions: {
      get_public_leaderboard: {
        Args: { p_limit?: number };
        Returns: Array<{ display_name: string; completed_lessons: number; total_steps: number; score: number; rank: number }>;
      };
      delete_current_user: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type TableRow<Name extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][Name]["Row"];
export type TableInsert<Name extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][Name]["Insert"];
