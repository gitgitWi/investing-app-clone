export interface NewsData {
  id: number;
  category?: string;
  headline: string;
  summary?: string;
  datetime?: number;
  image?: string;
  source?: string;
  url?: string;
  likes?: number;
  userLiked?: boolean;
}

export const enum marketEnum {
  general = 'general',
  crypto = 'crypto',
}
