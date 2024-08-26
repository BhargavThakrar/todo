import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Todo } from './entities/todo.entity';
import { SQLITE_CONFIG_TOKEN } from '@lib/shared-config';
import { TODO_REPOSITORY_TOKEN } from './constants';
import { TodoRepository } from './repositories/todo.repository';

const todoRepositoryProvider = {
  provide: TODO_REPOSITORY_TOKEN,
  useClass: TodoRepository,
};

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Todo]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          ...config.get(SQLITE_CONFIG_TOKEN),
          entities: [Todo],
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [todoRepositoryProvider],
  exports: [todoRepositoryProvider],
})
export class DatabaseModule {}
