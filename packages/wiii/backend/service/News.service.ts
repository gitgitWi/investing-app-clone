import { getCustomRepository } from 'typeorm';
import { Service } from 'zum-portal-core/backend/decorator/Alias';
import { Caching } from 'zum-portal-core/backend/decorator/Caching';
import { getDateString, times, WEEK_ONE } from '../../domain/date';
import { marketEnum, NewsData } from '../../domain/newsData';
import { NewsRepository, UserRepository } from '../db';
import { getCompanyNews, getMarketNews } from './news';
import tickerMap from './tickerMap';

@Service()
export class NewsService {
  constructor() {}

  /**
   * getMarketNewsList
   */
  // @Caching({
  //   ttl: times.caching,
  //   runOnStart: false,
  //   refreshCron: '*/30 * * * *',
  // })
  public async getMarketNewsList(category: marketEnum, email?: string) {
    const data = await getMarketNews(category);
    return this.setNewsDataWithBookmark(data, email);
  }

  /**
   * getCompanyNewsList
   */
  // @Caching({
  //   ttl: times.caching,
  //   runOnStart: false,
  // })
  public async getCompanyNewsList(symbol: string, from?: string, to?: string, email?: string): Promise<NewsData[]> {
    const now = new Date().getTime();
    if (symbol in tickerMap) symbol = tickerMap[symbol];

    const data = await getCompanyNews(symbol, from ?? getDateString(now - WEEK_ONE * 2), to ?? getDateString(now));
    return this.setNewsDataWithBookmark(data, email);
  }

  public createBookmarkNews(props: NewsData) {
    return getCustomRepository(NewsRepository).insertNews(props);
  }

  /**
   *
   * @param data API로 받은 데이터 원본
   * @param email 사용자 이메일
   * @returns Bookmark likes/userLike 추가된 데이터
   */
  private async setNewsDataWithBookmark(data: NewsData[], email?: string): Promise<NewsData[]> {
    const newsIds = [];
    /** newsId -> 인덱스 매핑, 북마크수 업데이트 위함 */
    const newsIdMap = {};
    data.forEach(({ id }, idx) => {
      newsIds.push(id);
      newsIdMap[id] = idx;
    });

    /** 북마크 갯수 추가 */
    const markeds = await getCustomRepository(NewsRepository).selectNewsByIDs(newsIds);
    // @ts-ignore
    const markedIdMap = markeds.reduce((acc, cur, idx) => {
      acc[cur.id] = idx;
      return acc;
    }, {});

    data.forEach((d) => {
      const { id } = d;
      d.likes = id in markedIdMap ? markeds[markedIdMap[id]].likes : 0;
    });

    /** 로그인 정보 있는 경우 bookmark 데이터 가공 */
    if (email || email !== '') {
      const { bookmarkNews } = await getCustomRepository(UserRepository).findOne({ email });
      data.forEach((d) => (d.userLike = d.id in bookmarkNews));
    }

    return data;
  }
}
