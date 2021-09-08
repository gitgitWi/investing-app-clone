import { Request, Response } from 'express';
import { Inject } from 'zum-portal-core/backend/decorator/Alias';
import { Controller, GetMapping, PostMapping } from 'zum-portal-core/backend/decorator/Controller';

import { verifyToken } from '../../backend/utils/auth/jwt';
import { marketEnum } from '../../domain/newsData';
import { TOKEN_COOKIE_KEY } from '../config/auth';
import { NewsService } from '../service/News.service';
import { VerifiedToken } from './Reply.controller';

/**
 * @description
 * 뉴스 리스트 API
 * /api/news/
 */
@Controller({ path: '/api/news' })
export class MarketController {
  constructor(@Inject(NewsService) private newsService: NewsService) {}

  /**
   * 시장 전체 뉴스 리스트 응답
   * @example
   * /api/news/market/general
   * /api/news/market/crypto
   */
  @GetMapping({ path: ['/market/:category'] })
  public async sendMarketNewsList({ params, cookies }: Request, res: Response) {
    try {
      let email = '';
      const token = cookies[TOKEN_COOKIE_KEY];
      if (token) {
        const verified = verifyToken(token) as VerifiedToken;
        email = verified.data;
      }

      const data = await this.newsService.getMarketNewsList(params.category as marketEnum, email);
      res.send(data);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }

  /**
   * 특정 기업 뉴스 리스트 응답
   * @example
   * /api/news/company/AAPL
   * /api/news/company/005930
   */
  @GetMapping({ path: ['/company/:symbol'] })
  public async sendCompanyNewsList({ params, query, cookies }: Request, res: Response) {
    try {
      const { symbol } = params;
      const { dateFrom, dateTo } = query;

      let email = '';
      const token = cookies[TOKEN_COOKIE_KEY];
      if (token) {
        const verified = verifyToken(token) as VerifiedToken;
        email = verified.data;
      }

      const data = await this.newsService.getCompanyNewsList(symbol, dateFrom as string, dateTo as string, email);

      res.send(data);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }

  /**
   * 신규 북마크 뉴스 생성
   * @example
   * /api/news/
   */
  @PostMapping({ path: ['/'] })
  public setBookmarkNews({ body }: Request, res: Response) {
    try {
      this.newsService.createBookmarkNews(body);
      res.sendStatus(200);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }
}
