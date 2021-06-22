/**
 * News Model
 * @description
 * - 사용자가 북마크한 뉴스만 DB에 따로 저장
 */
import { NewsData } from '../../../domain/newsData';
import { Column, Entity, Index, ObjectID, ObjectIdColumn } from 'typeorm';
import Base from './Base.entity';

@Entity({ database: 'mongodb', name: 'News' })
export class News extends Base implements NewsData {
  @ObjectIdColumn()
  objId: ObjectID;
  /**
   * @property
   * news id
   * - api에서 제공하는 ID
   */
  @Index()
  @Column({ nullable: false })
  id: number;

  @Column({ nullable: false })
  headline: string;

  /**
   * @property
   * 뉴스 내용
   * - API에서 주는 기사 요약 정보
   * - 없는 경우도 많음
   */
  @Column({ default: '' })
  summary?: string;

  /**
   * 기사 분류
   * Company, General, Coin
   */
  @Column()
  category?: string;

  /**
   * 기사 작성일
   * UNIX timestamp
   * - JS datetime  = UNIX datetime * 1_000
   */
  @Column()
  datetime?: number;

  /**
   * 썸네일 이미지
   */
  @Column()
  image?: string;

  /**
   * 기사 제공처, 언론사
   */
  @Column()
  source?: string;

  /**
   * 원문 URL
   */
  @Column()
  url?: string;

  /**
   * @property
   * 좋아요 수
   */
  @Column({ default: 0 })
  likes: number;

  constructor(
    id: number,
    headline: string,
    summary?: string,
    category?: string,
    datetime?: number,
    image?: string,
    source?: string,
    url?: string,
    likes: number = 0,
  ) {
    super();
    this.id = id;
    this.headline = headline;
    this.summary = summary;
    this.category = category;
    this.datetime = datetime;
    this.image = image;
    this.source = source;
    this.url = url;
    this.likes = likes;
  }
}
