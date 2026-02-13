export interface PhotoMeta {
  key: string;
  year: string;
  monthNumber: number;
  monthName: string;
  url: string;
  filename: string;
  type: 'logo' | 'image' | 'video';
}

export interface PhotoItem {
  url: string;
  caption: string;
  span: string;
  type: 'image' | 'video';
}

export interface MonthGroup {
  name: string;
  number: number;
  photos: PhotoItem[];
}

export interface ApiPhotosResponse {
  photos: PhotoMeta[];
  error?: string;
  isLocal?: boolean;
}
