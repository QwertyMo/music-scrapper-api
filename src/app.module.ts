import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ScrapperService } from './scrapper/scrapper.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ScrapperService],
})
export class AppModule {}
