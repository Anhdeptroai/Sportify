export interface Interaction {
    id: number;
    interaction_type: string;
    timestamp: string;
    user: number;
    song: number;
}

export interface Participant {
    id: number;
    artist_name: string;
    role: string;
    song: number;
    artist: number;
}

export interface Song {
    id: number;
    participants: Participant[];
    interactions: Interaction[];
    title: string;
    duration: string;
    genre: string;
    audio_file: string;
    image: string;
    album: number;
}

export interface Album {
    id: number;
    songs: Song[];
    title: string;
    description: string;
    creation_date: string;
    publish_date: string;
    artist: number;
}
