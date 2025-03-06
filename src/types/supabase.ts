
export type HazardType = "pothole" | "waterlogging" | "other";
export type HazardStatus = "active" | "investigating" | "resolved";

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface HazardReport {
  id: string;
  type: HazardType;
  description: string;
  location: Location;
  reported_by: string;
  reported_at: string;
  status: HazardStatus;
  votes: number;
  comments: number;
  image_url?: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          full_name: string;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          full_name: string;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          full_name?: string;
          avatar_url?: string | null;
        };
      };
      hazard_reports: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          type: HazardType;
          description: string;
          lat: number;
          lng: number;
          address: string;
          reported_by: string;
          status: HazardStatus;
          votes: number;
          comments: number;
          image_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          type: HazardType;
          description: string;
          lat: number;
          lng: number;
          address: string;
          reported_by: string;
          status?: HazardStatus;
          votes?: number;
          comments?: number;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          type?: HazardType;
          description?: string;
          lat?: number;
          lng?: number;
          address?: string;
          reported_by?: string;
          status?: HazardStatus;
          votes?: number;
          comments?: number;
          image_url?: string | null;
        };
      };
      hazard_votes: {
        Row: {
          id: string;
          created_at: string;
          hazard_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          hazard_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          hazard_id?: string;
          user_id?: string;
        };
      };
      hazard_comments: {
        Row: {
          id: string;
          created_at: string;
          hazard_id: string;
          user_id: string;
          content: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          hazard_id: string;
          user_id: string;
          content: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          hazard_id?: string;
          user_id?: string;
          content?: string;
        };
      };
    };
  };
}
