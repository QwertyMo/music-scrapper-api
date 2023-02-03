export class Track{
    name: string;
    description: string;
    isPlaylist: boolean;
    duration: number;
    tracks: Track[];
    provider: "YouTube" | "SoundCloud";
    thumbnail: string | null;
    url: string;
  }