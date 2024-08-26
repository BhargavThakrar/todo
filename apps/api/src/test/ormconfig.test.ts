import { Todo } from '@lib/database/entities/todo.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTestDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  entities: [Todo],
  synchronize: true,
  logging: false,
});
