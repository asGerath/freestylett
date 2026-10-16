export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      battle_participants: {
        Row: {
          battle_id: string
          created_at: string
          created_by: string | null
          freestyler_id: string
          id: string
          score: number | null
          side_number: number
          slot_number: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          battle_id: string
          created_at?: string
          created_by?: string | null
          freestyler_id: string
          id?: string
          score?: number | null
          side_number: number
          slot_number: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          battle_id?: string
          created_at?: string
          created_by?: string | null
          freestyler_id?: string
          id?: string
          score?: number | null
          side_number?: number
          slot_number?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "battle_participants_battle_id_fkey"
            columns: ["battle_id"]
            isOneToOne: false
            referencedRelation: "battles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_participants_freestyler_id_fkey"
            columns: ["freestyler_id"]
            isOneToOne: false
            referencedRelation: "freestylers"
            referencedColumns: ["id"]
          },
        ]
      }
      battles: {
        Row: {
          battle_format: Database["public"]["Enums"]["battle_format"]
          battle_order: number
          battle_status: Database["public"]["Enums"]["event_status"]
          created_at: string
          created_by: string | null
          decision_type:
            | Database["public"]["Enums"]["battle_decision_type"]
            | null
          editorial_status: Database["public"]["Enums"]["editorial_status"]
          event_id: string
          id: string
          published_at: string | null
          season_id: string | null
          slug: string
          source_url: string
          stage: Database["public"]["Enums"]["battle_stage"]
          title: string
          updated_at: string
          updated_by: string | null
          video_url: string | null
          winner_side: number | null
        }
        Insert: {
          battle_format: Database["public"]["Enums"]["battle_format"]
          battle_order: number
          battle_status?: Database["public"]["Enums"]["event_status"]
          created_at?: string
          created_by?: string | null
          decision_type?:
            | Database["public"]["Enums"]["battle_decision_type"]
            | null
          editorial_status?: Database["public"]["Enums"]["editorial_status"]
          event_id: string
          id?: string
          published_at?: string | null
          season_id?: string | null
          slug: string
          source_url: string
          stage: Database["public"]["Enums"]["battle_stage"]
          title: string
          updated_at?: string
          updated_by?: string | null
          video_url?: string | null
          winner_side?: number | null
        }
        Update: {
          battle_format?: Database["public"]["Enums"]["battle_format"]
          battle_order?: number
          battle_status?: Database["public"]["Enums"]["event_status"]
          created_at?: string
          created_by?: string | null
          decision_type?:
            | Database["public"]["Enums"]["battle_decision_type"]
            | null
          editorial_status?: Database["public"]["Enums"]["editorial_status"]
          event_id?: string
          id?: string
          published_at?: string | null
          season_id?: string | null
          slug?: string
          source_url?: string
          stage?: Database["public"]["Enums"]["battle_stage"]
          title?: string
          updated_at?: string
          updated_by?: string | null
          video_url?: string | null
          winner_side?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "battles_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battles_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          created_at: string
          created_by: string | null
          display_order: number
          flag_emoji: string | null
          id: string
          is_active: boolean
          iso_code: string
          name: string
          slug: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          display_order?: number
          flag_emoji?: string | null
          id?: string
          is_active?: boolean
          iso_code: string
          name: string
          slug: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          display_order?: number
          flag_emoji?: string | null
          id?: string
          is_active?: boolean
          iso_code?: string
          name?: string
          slug?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      event_leagues: {
        Row: {
          created_at: string
          created_by: string | null
          event_id: string
          is_primary: boolean
          league_id: string
          season_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          event_id: string
          is_primary?: boolean
          league_id: string
          season_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          event_id?: string
          is_primary?: boolean
          league_id?: string
          season_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_leagues_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_leagues_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_leagues_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          created_at: string
          created_by: string | null
          display_name: string
          display_order: number
          event_id: string
          freestyler_id: string | null
          id: string
          role: Database["public"]["Enums"]["participant_role"]
          seed: number | null
          team_name: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          display_name: string
          display_order?: number
          event_id: string
          freestyler_id?: string | null
          id?: string
          role: Database["public"]["Enums"]["participant_role"]
          seed?: number | null
          team_name?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          display_name?: string
          display_order?: number
          event_id?: string
          freestyler_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["participant_role"]
          seed?: number | null
          team_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_freestyler_id_fkey"
            columns: ["freestyler_id"]
            isOneToOne: false
            referencedRelation: "freestylers"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          city: string
          country_id: string
          created_at: string
          created_by: string | null
          description: string | null
          editorial_status: Database["public"]["Enums"]["editorial_status"]
          ends_at: string | null
          event_status: Database["public"]["Enums"]["event_status"]
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          official_url: string | null
          organization_id: string | null
          poster_path: string | null
          published_at: string | null
          slug: string
          source_url: string | null
          starts_at: string
          stream_url: string | null
          ticket_url: string | null
          time_zone: string
          title: string
          updated_at: string
          updated_by: string | null
          venue_id: string | null
          venue_name: string | null
          verified_at: string | null
        }
        Insert: {
          city: string
          country_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          editorial_status?: Database["public"]["Enums"]["editorial_status"]
          ends_at?: string | null
          event_status?: Database["public"]["Enums"]["event_status"]
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          official_url?: string | null
          organization_id?: string | null
          poster_path?: string | null
          published_at?: string | null
          slug: string
          source_url?: string | null
          starts_at: string
          stream_url?: string | null
          ticket_url?: string | null
          time_zone: string
          title: string
          updated_at?: string
          updated_by?: string | null
          venue_id?: string | null
          venue_name?: string | null
          verified_at?: string | null
        }
        Update: {
          city?: string
          country_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          editorial_status?: Database["public"]["Enums"]["editorial_status"]
          ends_at?: string | null
          event_status?: Database["public"]["Enums"]["event_status"]
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          official_url?: string | null
          organization_id?: string | null
          poster_path?: string | null
          published_at?: string | null
          slug?: string
          source_url?: string | null
          starts_at?: string
          stream_url?: string | null
          ticket_url?: string | null
          time_zone?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
          venue_id?: string | null
          venue_name?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      freestylers: {
        Row: {
          aka: string | null
          bio: string | null
          birth_date: string | null
          city: string | null
          country_id: string | null
          created_at: string
          created_by: string | null
          editorial_status: Database["public"]["Enums"]["editorial_status"]
          id: string
          instagram_url: string | null
          photo_path: string | null
          published_at: string | null
          real_name: string | null
          slug: string
          stage_name: string
          tiktok_url: string | null
          twitch_url: string | null
          updated_at: string
          updated_by: string | null
          x_url: string | null
          youtube_url: string | null
        }
        Insert: {
          aka?: string | null
          bio?: string | null
          birth_date?: string | null
          city?: string | null
          country_id?: string | null
          created_at?: string
          created_by?: string | null
          editorial_status?: Database["public"]["Enums"]["editorial_status"]
          id?: string
          instagram_url?: string | null
          photo_path?: string | null
          published_at?: string | null
          real_name?: string | null
          slug: string
          stage_name: string
          tiktok_url?: string | null
          twitch_url?: string | null
          updated_at?: string
          updated_by?: string | null
          x_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          aka?: string | null
          bio?: string | null
          birth_date?: string | null
          city?: string | null
          country_id?: string | null
          created_at?: string
          created_by?: string | null
          editorial_status?: Database["public"]["Enums"]["editorial_status"]
          id?: string
          instagram_url?: string | null
          photo_path?: string | null
          published_at?: string | null
          real_name?: string | null
          slug?: string
          stage_name?: string
          tiktok_url?: string | null
          twitch_url?: string | null
          updated_at?: string
          updated_by?: string | null
          x_url?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "freestylers_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      league_countries: {
        Row: {
          country_id: string
          created_at: string
          is_primary: boolean
          league_id: string
        }
        Insert: {
          country_id: string
          created_at?: string
          is_primary?: boolean
          league_id: string
        }
        Update: {
          country_id?: string
          created_at?: string
          is_primary?: boolean
          league_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "league_countries_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_countries_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      league_season_participants: {
        Row: {
          created_at: string
          created_by: string | null
          freestyler_id: string
          id: string
          is_active: boolean
          season_id: string
          seed: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          freestyler_id: string
          id?: string
          is_active?: boolean
          season_id: string
          seed?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          freestyler_id?: string
          id?: string
          is_active?: boolean
          season_id?: string
          seed?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "league_season_participants_freestyler_id_fkey"
            columns: ["freestyler_id"]
            isOneToOne: false
            referencedRelation: "freestylers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_season_participants_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      league_seasons: {
        Row: {
          created_at: string
          created_by: string | null
          editorial_status: Database["public"]["Enums"]["editorial_status"]
          ends_on: string | null
          id: string
          league_id: string
          name: string
          published_at: string | null
          slug: string
          starts_on: string | null
          updated_at: string
          updated_by: string | null
          year: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          editorial_status?: Database["public"]["Enums"]["editorial_status"]
          ends_on?: string | null
          id?: string
          league_id: string
          name: string
          published_at?: string | null
          slug: string
          starts_on?: string | null
          updated_at?: string
          updated_by?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          editorial_status?: Database["public"]["Enums"]["editorial_status"]
          ends_on?: string | null
          id?: string
          league_id?: string
          name?: string
          published_at?: string | null
          slug?: string
          starts_on?: string | null
          updated_at?: string
          updated_by?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "league_seasons_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      leagues: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          editorial_status: Database["public"]["Enums"]["editorial_status"]
          id: string
          instagram_url: string | null
          logo_path: string | null
          name: string
          organization_id: string | null
          published_at: string | null
          short_name: string | null
          slug: string
          updated_at: string
          updated_by: string | null
          website_url: string | null
          youtube_url: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          editorial_status?: Database["public"]["Enums"]["editorial_status"]
          id?: string
          instagram_url?: string | null
          logo_path?: string | null
          name: string
          organization_id?: string | null
          published_at?: string | null
          short_name?: string | null
          slug: string
          updated_at?: string
          updated_by?: string | null
          website_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          editorial_status?: Database["public"]["Enums"]["editorial_status"]
          id?: string
          instagram_url?: string | null
          logo_path?: string | null
          name?: string
          organization_id?: string | null
          published_at?: string | null
          short_name?: string | null
          slug?: string
          updated_at?: string
          updated_by?: string | null
          website_url?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leagues_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          country_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          editorial_status: Database["public"]["Enums"]["editorial_status"]
          id: string
          instagram_url: string | null
          logo_path: string | null
          name: string
          published_at: string | null
          slug: string
          updated_at: string
          updated_by: string | null
          website_url: string | null
          youtube_url: string | null
        }
        Insert: {
          country_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          editorial_status?: Database["public"]["Enums"]["editorial_status"]
          id?: string
          instagram_url?: string | null
          logo_path?: string | null
          name: string
          published_at?: string | null
          slug: string
          updated_at?: string
          updated_by?: string | null
          website_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          country_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          editorial_status?: Database["public"]["Enums"]["editorial_status"]
          id?: string
          instagram_url?: string | null
          logo_path?: string | null
          name?: string
          published_at?: string | null
          slug?: string
          updated_at?: string
          updated_by?: string | null
          website_url?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      post_categories: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          content_markdown: string
          cover_path: string | null
          created_at: string
          created_by: string | null
          editorial_status: Database["public"]["Enums"]["editorial_status"]
          excerpt: string
          id: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          source_url: string | null
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content_markdown?: string
          cover_path?: string | null
          created_at?: string
          created_by?: string | null
          editorial_status?: Database["public"]["Enums"]["editorial_status"]
          excerpt: string
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          source_url?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content_markdown?: string
          cover_path?: string | null
          created_at?: string
          created_by?: string | null
          editorial_status?: Database["public"]["Enums"]["editorial_status"]
          excerpt?: string
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          source_url?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "post_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_path: string | null
          created_at: string
          display_name: string
          id: string
          updated_at: string
        }
        Insert: {
          avatar_path?: string | null
          created_at?: string
          display_name: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_path?: string | null
          created_at?: string
          display_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      ranking_entries: {
        Row: {
          battle_losses: number
          battle_losses_after_replica: number
          battle_wins: number
          battle_wins_after_replica: number
          created_at: string
          created_by: string | null
          id: string
          matches_played: number
          participant_id: string
          penalty_points: number
          points: number
          position: number
          ranking_group: string
          score_total: number
          snapshot_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          battle_losses?: number
          battle_losses_after_replica?: number
          battle_wins?: number
          battle_wins_after_replica?: number
          created_at?: string
          created_by?: string | null
          id?: string
          matches_played?: number
          participant_id: string
          penalty_points?: number
          points?: number
          position: number
          ranking_group?: string
          score_total?: number
          snapshot_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          battle_losses?: number
          battle_losses_after_replica?: number
          battle_wins?: number
          battle_wins_after_replica?: number
          created_at?: string
          created_by?: string | null
          id?: string
          matches_played?: number
          participant_id?: string
          penalty_points?: number
          points?: number
          position?: number
          ranking_group?: string
          score_total?: number
          snapshot_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ranking_entries_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "league_season_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ranking_entries_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "ranking_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      ranking_snapshots: {
        Row: {
          captured_at: string
          created_at: string
          created_by: string | null
          editorial_status: Database["public"]["Enums"]["editorial_status"]
          event_id: string | null
          id: string
          is_current: boolean
          name: string
          published_at: string | null
          season_id: string
          source_url: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          captured_at: string
          created_at?: string
          created_by?: string | null
          editorial_status?: Database["public"]["Enums"]["editorial_status"]
          event_id?: string | null
          id?: string
          is_current?: boolean
          name: string
          published_at?: string | null
          season_id: string
          source_url: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          captured_at?: string
          created_at?: string
          created_by?: string | null
          editorial_status?: Database["public"]["Enums"]["editorial_status"]
          event_id?: string | null
          id?: string
          is_current?: boolean
          name?: string
          published_at?: string | null
          season_id?: string
          source_url?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ranking_snapshots_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ranking_snapshots_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "league_seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          address: string | null
          city: string
          country_id: string
          created_at: string
          created_by: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          region: string | null
          slug: string
          updated_at: string
          updated_by: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          city: string
          country_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          region?: string | null
          slug: string
          updated_at?: string
          updated_by?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          city?: string
          country_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          region?: string | null
          slug?: string
          updated_at?: string
          updated_by?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venues_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "editor"
      battle_decision_type:
        | "direct"
        | "replica"
        | "jury"
        | "technical"
        | "walkover"
        | "draw"
      battle_format:
        | "one_vs_one"
        | "two_vs_two"
        | "three_vs_three"
        | "crew"
        | "other"
      battle_stage:
        | "group_stage"
        | "play_in"
        | "round_of_32"
        | "round_of_16"
        | "quarterfinal"
        | "semifinal"
        | "third_place"
        | "final"
        | "regular_round"
        | "exhibition"
        | "other"
      editorial_status: "draft" | "published" | "archived"
      event_status:
        | "scheduled"
        | "live"
        | "finished"
        | "cancelled"
        | "postponed"
      event_type:
        | "league_round"
        | "qualifier"
        | "regional"
        | "national_final"
        | "international_final"
        | "tournament"
        | "exhibition"
        | "other"
      participant_role:
        | "competitor"
        | "host"
        | "judge"
        | "dj"
        | "guest"
        | "caster"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "editor"],
      battle_decision_type: [
        "direct",
        "replica",
        "jury",
        "technical",
        "walkover",
        "draw",
      ],
      battle_format: [
        "one_vs_one",
        "two_vs_two",
        "three_vs_three",
        "crew",
        "other",
      ],
      battle_stage: [
        "group_stage",
        "play_in",
        "round_of_32",
        "round_of_16",
        "quarterfinal",
        "semifinal",
        "third_place",
        "final",
        "regular_round",
        "exhibition",
        "other",
      ],
      editorial_status: ["draft", "published", "archived"],
      event_status: ["scheduled", "live", "finished", "cancelled", "postponed"],
      event_type: [
        "league_round",
        "qualifier",
        "regional",
        "national_final",
        "international_final",
        "tournament",
        "exhibition",
        "other",
      ],
      participant_role: [
        "competitor",
        "host",
        "judge",
        "dj",
        "guest",
        "caster",
      ],
    },
  },
} as const

