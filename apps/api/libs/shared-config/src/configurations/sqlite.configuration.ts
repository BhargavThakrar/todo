import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SQLITE_CONFIG_TOKEN } from '../constants';

export default registerAs(
  SQLITE_CONFIG_TOKEN,
  (): TypeOrmModuleOptions => ({
    type: 'sqlite',
    database: 'todo',
    dropSchema: true,
    synchronize: true,
  }),
);
