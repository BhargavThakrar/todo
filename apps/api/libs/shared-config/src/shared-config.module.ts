import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import sqliteConfiguration from './configurations/sqlite.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      load: [sqliteConfiguration],
    }),
  ],
  exports: [ConfigModule],
})
export class SharedConfigModule {}
