import path from 'path';
import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [path.join(__dirname, './entities/*')],
  migrations: [path.join(__dirname, './migrations/*')],
  cli: {
    migrationsDir: path.join(__dirname, './migrations'),
  },
  ssl: {
    rejectUnauthorized: false,
  },
} as ConnectionOptions;
