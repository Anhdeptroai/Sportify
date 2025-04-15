export interface Participant {
    id: number;
    artist_name: string;
    role: string;
    song: number;
    artist: number;
  }
  
  export interface Song {
    id: number;
    title: string;
    duration: string;
    genre: string;
    audio_file: string;
    image: string;
    album: number;
    participants: Participant[];
    interactions: any[]; 
  }
  