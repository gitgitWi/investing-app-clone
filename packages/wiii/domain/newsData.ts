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
  userLike?: boolean;
}

export const enum marketEnum {
  general = 'general',
  crypto = 'crypto',
}
