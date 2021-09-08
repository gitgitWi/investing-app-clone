import { config } from 'dotenv';
import { resolve } from 'path';
import { ConnectionOptions } from 'typeorm';

import { User } from '../db/entity/User.entity';
import { Reply } from '../db/entity/Reply.entity';
import { News } from '../db/entity/News.entity';
import { ClientOpts } from 'redis';

config({ path: resolve(__dirname, './.db.env') });

export const SECRET_KEY = process.env.SECRET_KEY;

export const SALT_ROUND = Number(process.env.SALT_ROUND);

export const RedisConnOptions = {
  host: process.env.DOCKER_REDIS_HOST,
  port: Number(process.env.DOCKER_REDIS_PORT),
} as ClientOpts;

export const MongoDBConnOptions: ConnectionOptions = {
  type: 'mongodb',
  host: process.env.DOCKER_MONGO_HOST,
  port: +process.env.DOCKER_MONGO_PORT,
  database: process.env.DOCKER_MONGO_DB,
  username: process.env.DOCKER_MONGO_USER,
  password: process.env.DOCKER_MONGO_PASS,
  logging: true,
  cache: true,
  entities: [User, Reply, News],
  // synchronize: process.env.NODE_ENV === 'production' ? false : true,
  useUnifiedTopology: true,
};
