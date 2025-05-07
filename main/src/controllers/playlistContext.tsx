import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { Playlist } from '../models/playlist';
import { Playlist_songsong } from '../models/playlist_song';
import { Song } from '../models/song';

export type PlaylistContextType = {
    playlists: Playlist[];
    currentPlaylist: Playlist | null;
    setCurrentPlaylist: React.Dispatch<React.SetStateAction<Playlist | null>>;
    createPlaylist: (title: string, privacy_setting: string) => Promise<void>;
    deletePlaylist: (id: number) => Promise<void>;
    addSongToPlaylist: (playlistId: number, songId: number) => Promise<void>;
    removeSongFromPlaylist: (playlistId: number, songId: number) => Promise<void>;
    getPlaylistSongs: (playlistId: number) => Promise<Song[]>;
};

export const PlaylistContext = createContext<PlaylistContextType>(null!);

const PlaylistContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            const response = await axios.get('http://13.215.205.59:8000/api/playlists/');
            setPlaylists(response.data);
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    };

    const createPlaylist = async (title: string, privacy_setting: string) => {
        try {
            const isDuplicate = playlists.some(playlist => playlist.title.toLowerCase() === title.toLowerCase());
            if (isDuplicate) {
                throw new Error('Playlist name already exists');
            }
            const response = await axios.post('http://13.215.205.59:8000/api/playlists/', {
                title,
                privacy_setting,
                creation_date: new Date().toISOString(),
                user: 1 // TODO: Replace with actual user ID
            });
            setPlaylists([...playlists, response.data]);
        } catch (error) {
            console.error('Error creating playlist:', error);
            throw error;
        }
    };

    const deletePlaylist = async (id: number) => {
        try {
            await axios.delete(`http://13.215.205.59:8000/api/playlists/${id}/`);
            setPlaylists(playlists.filter(playlist => playlist.id !== id));
        } catch (error) {
            console.error('Error deleting playlist:', error);
        }
    };

    const addSongToPlaylist = async (playlistId: number, songId: number) => {
        try {
            await axios.post('http://13.215.205.59:8000/api/playlist_songs/', {
                playlist: playlistId,
                song: songId
            });
        } catch (error) {
            console.error('Error adding song to playlist:', error);
        }
    };

    const getPlaylistSongs = async (playlistId: number): Promise<Song[]> => {
        try {
            const playlistSongsRes = await axios.get('http://13.215.205.59:8000/api/playlist_songs/');
            const playlistSongs: Playlist_songsong[] = playlistSongsRes.data;
            const songIds = playlistSongs.filter(ps => ps.playlist === playlistId).map(ps => ps.song);
            const songsRes = await axios.get('http://13.215.205.59:8000/api/songs/');
            const allSongs: Song[] = songsRes.data;
            return allSongs.filter(song => songIds.includes(song.id));
        } catch (error) {
            console.error('Error fetching playlist songs:', error);
            return [];
        }
    };

    const removeSongFromPlaylist = async (playlistId: number, songId: number) => {
        try {
            const playlistSongsRes = await axios.get('http://13.215.205.59:8000/api/playlist_songs/');
            const playlistSongs: Playlist_songsong[] = playlistSongsRes.data;
            const toDelete = playlistSongs.find(ps => ps.playlist === playlistId && ps.song === songId);
            if (toDelete) {
                await axios.delete(`http://13.215.205.59:8000/api/playlist_songs/${toDelete.id}/`);
            }
        } catch (error) {
            console.error('Error removing song from playlist:', error);
        }
    };

    const contextValue: PlaylistContextType = {
        playlists,
        currentPlaylist,
        setCurrentPlaylist,
        createPlaylist,
        deletePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        getPlaylistSongs
    };

    return (
        <PlaylistContext.Provider value={contextValue}>
            {children}
        </PlaylistContext.Provider>
    );
};

export default PlaylistContextProvider; 