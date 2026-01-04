
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  audioUrl: string;
  duration: string;
  genre: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  image: string;
}

export enum AppSection {
  HOME = 'HOME',
  DISCOVER = 'DISCOVER',
  GENRES = 'GENRES',
  LIBRARY = 'LIBRARY',
  MANIFESTO = 'MANIFESTO',
  RESEARCH = 'RESEARCH',
  RESOURCES = 'RESOURCES',
  CONTACT = 'CONTACT'
}
