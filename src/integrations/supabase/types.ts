export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      banners: {
        Row: {
          catalogue_id: string | null
          cliques: number | null
          conteudo_vinculado_id: string | null
          created_at: string
          data_fim: string
          data_inicio: string
          exibir_botao: boolean | null
          id: string
          layout_banner: string
          midia_tipo: string | null
          midia_url: string | null
          ordem: number | null
          planos_permitidos: string[] | null
          status: boolean | null
          tempo_total_reproducao: number | null
          texto_botao: string | null
          tipo_conteudo: string
          titulo: string
          updated_at: string
          url_acao: string | null
          visualizacoes: number | null
        }
        Insert: {
          catalogue_id?: string | null
          cliques?: number | null
          conteudo_vinculado_id?: string | null
          created_at?: string
          data_fim: string
          data_inicio: string
          exibir_botao?: boolean | null
          id?: string
          layout_banner: string
          midia_tipo?: string | null
          midia_url?: string | null
          ordem?: number | null
          planos_permitidos?: string[] | null
          status?: boolean | null
          tempo_total_reproducao?: number | null
          texto_botao?: string | null
          tipo_conteudo: string
          titulo: string
          updated_at?: string
          url_acao?: string | null
          visualizacoes?: number | null
        }
        Update: {
          catalogue_id?: string | null
          cliques?: number | null
          conteudo_vinculado_id?: string | null
          created_at?: string
          data_fim?: string
          data_inicio?: string
          exibir_botao?: boolean | null
          id?: string
          layout_banner?: string
          midia_tipo?: string | null
          midia_url?: string | null
          ordem?: number | null
          planos_permitidos?: string[] | null
          status?: boolean | null
          tempo_total_reproducao?: number | null
          texto_botao?: string | null
          tipo_conteudo?: string
          titulo?: string
          updated_at?: string
          url_acao?: string | null
          visualizacoes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "banners_catalogue_id_fkey"
            columns: ["catalogue_id"]
            isOneToOne: false
            referencedRelation: "catalogues"
            referencedColumns: ["id"]
          },
        ]
      }
      catalogues: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          ordem_exibicao: number
          status: boolean
          tipo_catalogo: Database["public"]["Enums"]["catalogue_type"]
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          ordem_exibicao?: number
          status?: boolean
          tipo_catalogo?: Database["public"]["Enums"]["catalogue_type"]
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          ordem_exibicao?: number
          status?: boolean
          tipo_catalogo?: Database["public"]["Enums"]["catalogue_type"]
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      championships: {
        Row: {
          created_at: string
          end_date: string
          id: string
          matches_count: number | null
          name: string
          phase: string | null
          start_date: string
          status: string | null
          teams_count: number | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          matches_count?: number | null
          name: string
          phase?: string | null
          start_date: string
          status?: string | null
          teams_count?: number | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          matches_count?: number | null
          name?: string
          phase?: string | null
          start_date?: string
          status?: string | null
          teams_count?: number | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          age: number | null
          assists: number | null
          avatar_url: string | null
          created_at: string
          goals: number | null
          id: string
          market_value: string | null
          matches: number | null
          name: string
          nationality: string | null
          number: number | null
          position: string
          status: string | null
          team_id: string | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          assists?: number | null
          avatar_url?: string | null
          created_at?: string
          goals?: number | null
          id?: string
          market_value?: string | null
          matches?: number | null
          name: string
          nationality?: string | null
          number?: number | null
          position: string
          status?: string | null
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          assists?: number | null
          avatar_url?: string | null
          created_at?: string
          goals?: number | null
          id?: string
          market_value?: string | null
          matches?: number | null
          name?: string
          nationality?: string | null
          number?: number | null
          position?: string
          status?: string | null
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          category: string
          coach: string | null
          created_at: string
          division: string
          draws: number | null
          founded: string | null
          id: string
          logo_url: string | null
          losses: number | null
          matches: number | null
          name: string
          players_count: number | null
          points: number | null
          updated_at: string
          wins: number | null
        }
        Insert: {
          category: string
          coach?: string | null
          created_at?: string
          division: string
          draws?: number | null
          founded?: string | null
          id?: string
          logo_url?: string | null
          losses?: number | null
          matches?: number | null
          name: string
          players_count?: number | null
          points?: number | null
          updated_at?: string
          wins?: number | null
        }
        Update: {
          category?: string
          coach?: string | null
          created_at?: string
          division?: string
          draws?: number | null
          founded?: string | null
          id?: string
          logo_url?: string | null
          losses?: number | null
          matches?: number | null
          name?: string
          players_count?: number | null
          points?: number | null
          updated_at?: string
          wins?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_catalogue_content_count: {
        Args: { catalogue_uuid: string }
        Returns: number
      }
    }
    Enums: {
      catalogue_type: "serie" | "colecao" | "playlist" | "outro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      catalogue_type: ["serie", "colecao", "playlist", "outro"],
    },
  },
} as const
