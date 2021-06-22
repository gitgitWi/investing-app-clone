import { News } from '../entity/News.entity';
import { MongoRepository, EntityRepository } from 'typeorm';
import { RepoError } from '../../utils/error/api';
import { NewsData } from '../../../domain/newsData';

/**
 * UserRepository DAO - TypeORM
 * @description
 * - 사용자 생성 인증 수정 삭제
 * - 사용자 댓글 id 배열 추가
 */
@EntityRepository(News)
export class NewsRepository extends MongoRepository<News> {
  constructor() {
    super();
  }

  /**
   * saveNews
   * @description
   * - 첫 북마크 되는 경우 DB에 내용 저장
   */
  public async insertNews(props: NewsData): Promise<void> {
    const { id, headline } = props;
    if (!id || !headline.trim().length) return;

    /** 중복체크 */
    const exist = await this.findOne({ id });
    if (exist) return;

    /** 반환값 불필요하므로 await 제거 */
    const news = this.create(props);
    this.save(news);
  }

  /**
   * selectNewsByIDs
   * - id 배열에 해당하는 뉴스 불러오기
   * - 사용자 북마크 전체 로딩
   */
  public selectNewsByIDs(ids: number[]): Promise<News[] | void> {
    return this.find({ where: { id: { $in: ids } }, order: { updatedAt: 'DESC' } });
  }

  /**
   * updateNewsLikes
   * 클라이언트에서 북마크 추가/삭제 시 DB 업데이트
   * @param id 뉴스 id
   * @param update 좋아요 +1 / -1
   */
  public async updateNewsLikes(id: number, update: number) {
    const { likes } = await this.findOne({ where: { id } });
    this.updateOne({ id }, { $set: { likes: likes + update } });
  }
}
