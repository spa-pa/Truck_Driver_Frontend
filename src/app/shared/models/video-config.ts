export interface VideoData {
  video_id: number;
  language_id: number;
  path: string;
  is_active: boolean;
  created_by: number;
  created_at: string;
  modified_by: number | null;
  modified_at: string | null;
  deleted_by: number | null;
  deleted_at: string | null;
}

export interface VideoResponse {
  dataValues: VideoData;
  _previousDataValues: VideoData;
  uniqno: number;
  _changed: {};
  _options: {};
  isNewRecord: boolean;
  path: string; // Full URL
}

export interface Language {
  language_id: number;
  language_name: string;
  language_code: string;
  is_active: number;
  created_by: number;
  created_at: string;
  modified_by: number | null;
  modified_at: string | null;
}