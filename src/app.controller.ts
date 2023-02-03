import { Controller, Get, Param, Query, HttpStatus, HttpException } from '@nestjs/common';
import { Track } from './interface/track';
import { Error } from './interface/error';
import { ScrapperService } from './scrapper/scrapper.service'

@Controller()
export class AppController {
  constructor(private scrapperService: ScrapperService) {}

  @Get('scrapper')
  async search(@Query('name') name:string): Promise<Track | Error> {
    var data = await this.scrapperService.search(name)
    if(data instanceof Error) throw new HttpException(data.message, data.statusCode); 
    else return data
  }
}
