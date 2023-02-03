import { Injectable } from '@nestjs/common';
import { Track } from 'src/interface/track';
import { Error } from 'src/interface/error';
import YouTube from './youtube/youtube';
import SoundCloud from './youtube/soundcloud';

@Injectable()
export class ScrapperService {
    youtube: YouTube = new YouTube()
    soundcloud: SoundCloud = new SoundCloud()

    async search(name: string):Promise<Track | Error>{
        var provider = this.getProvider(name) 
        if(provider == 'YouTube') return await this.youtube.searchURL(name)
        if(provider == 'SoundCloud') return await this.soundcloud.searchURL(name)
        else return await this.youtube.search(name)
    }
    
    private getProvider(url:string): 'YouTube' | 'SoundCloud' | null{
        if(this.youtube.checkProvider(url)) return 'YouTube'
        if(this.soundcloud.checkProvider(url)) return 'SoundCloud'
        return null
    }
}
