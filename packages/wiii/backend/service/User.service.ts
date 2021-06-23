import { getCustomRepository } from 'typeorm';
import { Service } from 'zum-portal-core/backend/decorator/Alias';

import { NewsRepository, ReplyRepository, UserRepository } from '../db/';
import { ApiError } from '../utils/error/api';

/**
 * @description
 * - 회원 가입 조회 수정 삭제 서비스
 * - `controller/User.controller.ts`에서 호출
 */
@Service()
export class UserService {
  private error = (msg: string, name: string) => new ApiError(`Fail to ${msg}`, `---Service:User:${name}: `);

  constructor() {}

  /**
   * 생성 및 수정
   * @return DB 쿼리 결과에 따라 true/void
   */
  public async createUser({ nickname, email, password }) {
    const result = await getCustomRepository(UserRepository).createUser({ nickname, email, password });
    if (!result) return;
    return true;
  }

  /**
   * @todo getOneUser
   */

  /**
   * @todo deleteUser
   */

  /**
   * setNewsLikes
   * 뉴스 북마크
   */
  public setNewsLikes(email: string, id: any, update: number) {
    getCustomRepository(UserRepository).updateBookmarkNews(email, Number(id), update);
    getCustomRepository(NewsRepository).updateNewsLikes(Number(id), update);
  }

  /**
   * setMarketLikes
   * 개별 종목 북마크
   */
  public setMarketLikes(email: string, docId: string, update: number) {
    //
  }

  /**
   * getAllBookmarks
   * 사용자 페이지에서 사용자 전체 북마크, 좋아요 확인하기 위함
   */
  public async getAllBookmarks(email: string) {
    const { likes, bookmarkNews, bookmarkTickers } = await getCustomRepository(UserRepository).findOne({ email });

    const repos = [
      'reply',
      'news',
      // 'ticker'
    ];

    const getters = {
      reply: getCustomRepository(ReplyRepository).selectReplyByIDs(Object.keys(likes)),
      news: getCustomRepository(NewsRepository).selectNewsByIDs(Object.keys(bookmarkNews).map(Number)),
    };

    const bookmarks = {
      reply: [],
      news: [],
      ticker: [],
    };

    for await (const repo of repos) {
      bookmarks[repo] = await getters[repo];
    }

    return bookmarks;
  }
}
