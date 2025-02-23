import { User } from '../entity/User.entity';
import { CreateReplyProps } from '../types';
import { MongoRepository, EntityRepository } from 'typeorm';
import { RepoError } from '../../utils/error/api';

/**
 * UserRepository DAO - TypeORM
 * @description
 * - 사용자 생성 인증 수정 삭제
 * - 사용자 댓글 id 배열 추가
 */
@EntityRepository(User)
export class UserRepository extends MongoRepository<User> {
  private error = (msg: string, name: string) => new RepoError(`Fail to ${msg}`, `Repo:User:${name}: `);
  constructor() {
    super();
  }

  public async checkDuplicatedEmail(email: string): Promise<true | void> {
    const dupError = () => this.error(`Check Email Duplicated`, this.checkDuplicatedEmail.name);
    try {
      const findArr = await this.find({ email });
      if (findArr.length) throw dupError();
      return true;
    } catch (e) {
      return console.error(e);
    }
  }

  public async createUser(props) {
    const createError = () => this.error(`Create User`, this.createUser.name);
    try {
      const { nickname, email, password } = props;
      const isValidEmail = await this.checkDuplicatedEmail(email);
      if (!isValidEmail) throw createError();

      const newbie = this.create({ nickname, email, password });
      const result = await this.save(newbie);
      if (!result) throw createError();
      return true;
    } catch (e) {
      return console.error(e);
    }
  }

  public async checkValidUser(props) {
    const validError = () => this.error(`Check User Validation`, this.checkValidUser.name);
    try {
      const { email, password } = props;
      const userArr = await this.find({ email });
      if (userArr.length !== 1) throw validError();

      const [user] = userArr;
      const isValidPW = await user.comparePW(password);
      if (!isValidPW) throw validError();

      return true;
    } catch (e) {
      return console.error(e);
    }
  }

  /**
   * @todo user update
   */

  /**
   * @todo user delete
   */

  /**
   * updateBookmarkNews
   * 사용자 뉴스 북마크 저장 객체 업데이트
   * @param email 사용자 email
   * @param docId 뉴스 id
   */
  public async updateBookmarkNews(email: string, docId: number, update: number) {
    const { bookmarkNews } = await this.findOne({ email });

    if (update === 1) return this.updateOne({ email }, { $set: { bookmarkNews: { ...bookmarkNews, [docId]: docId } } });

    const markedIds = Object.keys(bookmarkNews);
    if (!markedIds.length) return;

    const strDocId = docId.toString();

    const rest = markedIds.reduce((acc, cur) => {
      if (strDocId !== cur) acc[cur] = cur;
      return acc;
    }, {});

    return this.updateOne({ email }, { $set: { bookmarkNews: rest } });
  }
}
