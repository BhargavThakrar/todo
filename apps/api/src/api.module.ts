import { Module } from '@nestjs/common';
import { DatabaseModule } from '@lib/database';
import { SharedConfigModule } from '@lib/shared-config';
import { TodosModule } from './modules/todos/todos.module';

@Module({
  imports: [SharedConfigModule, DatabaseModule, TodosModule],
})
export class ApiModule {}
