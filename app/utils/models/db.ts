import cls from 'cls-hooked';
import { Sequelize, type Dialect } from 'sequelize';
import pg from 'pg';

import { sqlLogger } from '../logger';

const namespace = cls.createNamespace('my-blog-ai');
// eslint-disable-next-line react-hooks/rules-of-hooks
Sequelize.useCLS(namespace);

export const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: (process.env.DB_DIALECT || 'postgres') as Dialect,
    dialectModule: pg,
    logging: msg => {
      sqlLogger.debug(msg);
    },
    pool: {
      max: 3,
      min: 0,
      idle: 10000,
      acquire: 30000,
    },
  }
);
