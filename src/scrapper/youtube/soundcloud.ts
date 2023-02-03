import { Error } from 'src/interface/error';
import { Track } from 'src/interface/track';
import * as SC from 'soundcloud-scraper'

var links = ['soundcloud.com'];

export default class SoundCloud{
    client = new SC.Client();

    async searchURL(url: string): Promise <Track | Error>{

        this.client.getSongInfo(url).then(async song =>{
            console.log(song);
            
        })
        return {
            message: "test",
            type: "SERVER_ERROR"
        }
    }

    checkProvider(url: string): Boolean {
        for (let link of links) if (url.includes(link)) return true;
        return false;
    }
}