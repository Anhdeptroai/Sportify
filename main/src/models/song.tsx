export interface Participant {
    id: number;
    artist_name: string;
    role: string;
    song: number;
    artist: number;
}

export interface Interaction {
    id: number;
    interaction_type: string;
    timestamp: string;
    user: number;
    song: number;
}

export interface Song {
    id: number;
    title: string;
    duration: string;
    genre: string;
    audio_file: string;
    video_file: string;
    image: string;
    album: number;
    participants: Participant[];
    interactions: Interaction[];
}
  