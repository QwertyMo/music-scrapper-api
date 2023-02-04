export class Track{
    name: string;
    description: string;
    isPlaylist: boolean;
    duration: number;
    tracks: Track[];
    provider: "YouTube" | "SoundCloud" | "Yandex.Music";
    thumbnail: string | null;
    url: string;
  }