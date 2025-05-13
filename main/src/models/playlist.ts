export interface Playlist {
    id: number;
    title: string;
    privacy_setting: string;
    creation_date: string;
    user: number | { id: number };
} 