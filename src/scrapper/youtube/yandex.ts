import { Error } from 'src/interface/error';
import { Track } from 'src/interface/track';
import axios from 'axios';
import { response } from 'express';

var apiurl = "https://api.music.yandex.net/"

var token = ""

var links = ['music.yandex.ru', 'music.yandex.by'];

export default class Yandex{

    async searchURL(url: string): Promise <Track | Error>{
        url.replace(".by", ".ru")
        var track = url.split("track/")[1]
        var album = url.split("album/")[1]
        if(album!= undefined && album.includes("/")) album = album.split("/")[0]
        var user = url.split("users/")[1]
        if(user!= undefined && user.includes("/")) user = user.split("/")[0]
        var playlist = url.split("playlists/")[1]

        try{
            if(album!=undefined){
                if(track!=undefined){
                    const params = new URLSearchParams();
                    params.append("track-ids", track)
                    var data = (await axios.post(apiurl + "/tracks/", params)).data
                    return {
                        name: data.result[0].title,
                        description: "",
                        thumbnail: "https://" + data.result[0].coverUri.replace("%%", "400x400"),
                        isPlaylist: false,
                        tracks: [],
                        duration: Math.round(data.result[0].durationMs / 1000),
                        provider: 'Yandex.Music',
                        url: url,
                      };
                }
                else{
                    var data = (await axios.get(apiurl + "/albums/" + album + "/with-tracks")).data
                    var tracks: Track[] = [];
                    var time = 0
                    for (var t of data.result.volumes[0]) {
                        time+=Math.round(t.durationMs / 1000)
                        tracks[tracks.length] = {
                            name: t.title,
                            description: "",
                            thumbnail: "https://" + t.coverUri.replace("%%", "400x400"),
                            isPlaylist: false,
                            tracks: [],
                            duration: Math.round(t.durationMs / 1000),
                            provider: 'Yandex.Music',
                            url: "https://music.yandex.ru/album/" + album + "/track/" + t.id
                        }
                    }
                    return{
                        name: (data.result.title),
                        description: "",
                        thumbnail: "https://" + data.result.coverUri.replace("%%", "400x400"),
                        isPlaylist: true,
                        tracks: tracks,
                        duration: time,
                        provider: 'Yandex.Music',
                        url: url
                    }
                }
            }
            else if(user!=undefined && playlist!=undefined){
                var data = (await axios.get(apiurl + "/users/" + user + "/playlists/" + playlist)).data 
                var tracks: Track[] = [];
                for (var t of data.result.tracks) {
                    tracks[tracks.length] = {
                        name: t.track.title,
                        description: "",
                        thumbnail: "https://" + t.track.coverUri.replace("%%", "400x400"),
                        isPlaylist: false,
                        tracks: [],
                        duration: Math.round(t.track.durationMs / 1000),
                        provider: 'Yandex.Music',
                        url: "https://music.yandex.ru/album/" + t.track.albums[0].id + "/track/" + t.id
                    }
                }
                return{
                    name: (data.result.title==""?"Liked":data.result.title),
                    description: "",
                    thumbnail: "",
                    isPlaylist: true,
                    tracks: tracks,
                    duration: Math.round(data.result.durationMs / 1000),
                    provider: 'Yandex.Music',
                    url: url
                }
            }
            else {
                return new Error(
                    404,
                    "Can't get data from this link",
                    "WRONG_LINK"
                 ) 
            }
        }catch(e){
            return new Error(
                404,
                "Wrong link",
                "WRONG_LINK"
             )
        }
    }

    checkProvider(url: string): Boolean {
        for (let link of links) if (url.includes(link)) return true;
        return false;
    }
}
