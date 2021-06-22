import { Controller, GetMapping, PostMapping } from 'zum-portal-core/backend/decorator/Controller';
import { Inject } from 'zum-portal-core/backend/decorator/Alias';
import { Request, Response } from 'express';
import { UserService } from '../service/User.service';
import { ApiError } from '../utils/error/api';
import { TOKEN_COOKIE_KEY } from '../config/auth';
import { VerifiedToken } from './Reply.controller';
import { verifyToken } from '../../backend/utils/auth/jwt';

export const enum BookmarkTypes {
  news = 'news',
  market = 'market',
}

/**
 * @description
 * 회원관리 관련 api controller
 * - 회원가입
 * - logIn, logOut
 * @todo
 * - path enum
 */
@Controller({ path: '/api/user' })
export class UserController {
  private error = (msg: string, funcName: string) => new ApiError(`Fail to ${msg}`, `---Ctrl:User:${funcName}: `);

  constructor(@Inject(UserService) private service: UserService) {}

  /**
   * 회원 가입; Post
   * @todo
   * - middleware; validate
   */
  @PostMapping({ path: '/' })
  public async postSignIn({ body }: Request, res: Response) {
    const joinErr = () => this.error(`Post Sign In`, this.postSignIn.name);
    try {
      const { nickname, email, password } = body;
      const result = await this.service.createUser({ nickname, email, password });
      if (!result) throw joinErr();
      res.status(200).json({ message: 'Success to Sign-up' });
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: 'Fail to Sign-up' });
    }
  }

  /**
   * @todo
   * 회원 정보 조회; Get
   */
  @GetMapping({ path: '/' })
  public async getUserInfo({ cookies }: Request, res: Response) {
    const getErr = () => this.error(`Get User Info`, this.getUserInfo.name);
    try {
      const token = cookies[TOKEN_COOKIE_KEY];
      if (!token) throw getErr();

      /** @todo */
      const info = {};

      res.json(info);
    } catch (e) {
      console.error(e);
      res.status(400).send({ message: 'Fail to Get User Info' });
    }
  }

  /**
   * @todo
   * 회원 수정; Put
   */

  /**
   * @todo
   * 회원 수정; Delete
   */

  /**
   * 북마크
   * setNewsLikes
   * setMarketLikes
   * 반환값 필요 없으므로 async-await 사용 X
   * @todo 댓글 controller에 있는 댓글 좋아요 기능과 통합
   * @example
   * /api/user/likes/news
   */
  @PostMapping({ path: ['/likes/:type'] })
  public setBookmarks({ body: { id, update }, params: { type }, cookies }: Request, res: Response) {
    if (!id || !type || !update) res.status(404).send({ message: `종목명/뉴스 아이디 또는 북마크 숫자가 없습니다` });

    const token = cookies[TOKEN_COOKIE_KEY];
    if (!token) res.status(401).send({ messsage: `로그인 정보가 없습니다` });

    const { data: email } = verifyToken(token) as VerifiedToken;
    if (!email) res.status(401).send({ messsage: `로그인 정보가 없습니다` });

    const bookmarkServieMap = {
      [BookmarkTypes.news]: this.service.setNewsLikes,
      [BookmarkTypes.market]: this.service.setMarketLikes,
    };

    try {
      bookmarkServieMap[type as BookmarkTypes](email, id, Number(update));
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }
}
