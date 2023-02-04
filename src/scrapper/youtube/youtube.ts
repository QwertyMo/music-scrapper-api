import { Error } from 'src/interface/error';
import { Track } from 'src/interface/track';
import * as youtube from 'yt-search';

var links = ['youtu.be', 'youtube.com'];

export default class YouTube {
  async search(name: string): Promise<Track | Error> {
    var videos = await (await youtube(name)).videos;
    if (videos.length > 0) {
      var video = videos[0];
      return {
        name: video.title,
        description: video.description,
        thumbnail: video.thumbnail,
        isPlaylist: false,
        tracks: [],
        duration: video.duration.seconds,
        provider: 'YouTube',
        url: video.url,
      }; 
    } else
    return new Error(
      500,
      "Something were wrong when search track",
      "SERVER_ERROR"
   ) 
  }

  async searchURL(url: string): Promise<Track | Error> {
    var id = '';
    var isPlaylist = false;
    var result = null;

    result = this.getPlaylistID(url);
    if (result != null) {
      id = result;
      isPlaylist = true;
    } else {
      result = this.getVideoID(url);
      if (result != null) {
        id = result;
        isPlaylist = false;
      } else return null;
    }

    if (isPlaylist) return await this.getPlaylist(id);
    else return await this.getTrack(id);
  }

  checkProvider(url: string): Boolean {
    for (let link of links) if (url.includes(link)) return true;
    return false;
  }

  private getPlaylistID(url: string): string | null {
    var id = /[&|\?]list=([a-zA-Z0-9_-]+)/gi.exec(url);
    return id && id.length > 0 ? id[1] : null;
  }

  private getVideoID(url: string): string | null {
    url = url.replace('shorts/', 'watch?v=');
    var id = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return id[2] !== undefined
      ? id[2].split(/[^0-9a-z_\-]/i)[0]
      : id[0] !== undefined
      ? id[0]
      : null;
  }

  private async getTrack(id: string): Promise<Track | Error> {
    try {
      var video = await youtube({ videoId: id });
      if (video === undefined)
      return new Error(
        404,
        "Wrong video ID",
        "WRONG_ID"
     ) 
      return {
        name: video.title,
        description: video.description,
        thumbnail: video.thumbnail,
        isPlaylist: false,
        tracks: [],
        duration: video.duration.seconds,
        provider: 'YouTube',
        url: video.url,
      };
    } catch (e) {
      return new Error(
        404,
        "Wrong video ID",
        "WRONG_ID"
     ) 
    }
  }

  private async getPlaylist(id: string): Promise<Track | Error> {
    try {
      var playlist = await youtube({ listId: id });
      var tracks: Track[] = [];
      var duration = 0;
      if (playlist == undefined)
      return new Error(
        404,
        "Wrong playlist ID",
        "WRONG_ID"
     ) 
      for (var video of playlist.videos) {
        // @ts-ignore
        duration += video.duration.seconds;
        tracks[tracks.length] = {
          name: video.title,
          description: '',
          thumbnail: video.thumbnail,
          isPlaylist: false,
          tracks: [],
          // @ts-ignore
          duration: video.duration.seconds,
          provider: 'YouTube',
          url: 'https://www.youtube.com/watch?v=' + video.videoId,
        };
      }
      return {
        name: playlist.title,
        description: '',
        thumbnail: playlist.thumbnail,
        isPlaylist: true,
        tracks: tracks,
        duration: duration,
        provider: 'YouTube',
        url: playlist.url,
      };
    } catch (e) {
      return new Error(
        404,
        "Wrong playlist ID",
        "WRONG_ID"
     ) 
    }
  }
}
