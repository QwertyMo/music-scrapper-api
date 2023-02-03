import { Error } from 'src/interface/error';
import { Track } from 'src/interface/track';
import * as SC from 'soundcloud-scraper'

var links = ['soundcloud.com'];

export default class SoundCloud{
    
    client = new SC.Client();

    async searchURL(url: string): Promise <Track | Error>{

        return new Error(
            500,
            "Can't get data from sound cloud :(",
            "SERVER_ERROR"
         ) 

        this.client.getSongInfo(url).then(async song =>{
            console.log(song);
            
        })
        
    }

    checkProvider(url: string): Boolean {
        for (let link of links) if (url.includes(link)) return true;
        return false;
    }
}