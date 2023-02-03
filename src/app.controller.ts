import { Controller, Get, Param, Query } from '@nestjs/common';
import { Track } from './interface/track';
import { Error } from './interface/error';
import { ScrapperService } from './scrapper/scrapper.service'

@Controller()
export class AppController {
  constructor(private scrapperService: ScrapperService) {}

  @Get('scrapper')
  async jopa(@Query('name') name:string): Promise<Track | Error> {
    return await this.scrapperService.search(name)
  }
}
