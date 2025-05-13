import axios from 'axios';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Playlist } from '../models/playlist';
import { Playlist_songsong } from '../models/playlist_song';
import { Song } from '../models/song';
import { AuthContext } from './authContext.tsx';

export type PlaylistContextType = {
    playlists: Playlist[];
    currentPlaylist: Playlist | null;
    setCurrentPlaylist: React.Dispatch<React.SetStateAction<Playlist | null>>;
    createPlaylist: (title: string, privacy_setting: string) => Promise<void>;
    deletePlaylist: (id: number) => Promise<void>;
    addSongToPlaylist: (playlistId: number, songId: number) => Promise<void>;
    removeSongFromPlaylist: (playlistId: number, songId: number) => Promise<void>;
    getPlaylistSongs: (playlistId: number) => Promise<Song[]>;
    filterPlaylistsByUser: (userId: number) => Playlist[];
    fetchPlaylists: () => Promise<void>;
    clearPlaylists: () => void;
};

export const PlaylistContext = createContext<PlaylistContextType>(null!);

const PlaylistContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
    const { user } = useContext(AuthContext);

    const clearPlaylists = useCallback(() => {
        setPlaylists([]);
        setCurrentPlaylist(null);
    }, []);

    const fetchPlaylists = useCallback(async () => {
        if (!user) {
            clearPlaylists();
            return;
        }

        try {
            console.log('PlaylistContext: Fetching playlists for user:', user);
            const token = localStorage.getItem('token');
            console.log('PlaylistContext: Token:', token);
            
            if (!token) {
                console.error('PlaylistContext: No token found');
                clearPlaylists();
                return;
            }

            const response = await axios.get('http://13.215.205.59:8000/api/playlists/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('PlaylistContext: All playlists from API:', response.data);
            setPlaylists(response.data);
        } catch (error) {
            console.error('PlaylistContext: Error fetching playlists:', error);
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                console.log('PlaylistContext: Token expired or invalid');
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                clearPlaylists();
            }
        }
    }, [user, clearPlaylists]);

    useEffect(() => {
        console.log('PlaylistContext: User changed', user);
        if (user) {
            fetchPlaylists();
        } else {
            clearPlaylists();
        }

        return () => {
            clearPlaylists();
        };
    }, [user, fetchPlaylists, clearPlaylists]);

    const filterPlaylistsByUser = (userId: number): Playlist[] => {
        console.log('PlaylistContext: Filtering playlists for user:', userId);
        console.log('PlaylistContext: All playlists:', playlists);
        const filtered = playlists.filter(playlist => {
            const userValue = playlist.user;
            const isOwner = typeof userValue === 'object' && userValue !== null 
                ? (userValue as { id: number }).id === userId 
                : userValue === userId;
            console.log('PlaylistContext: Checking playlist:', playlist.title, 'isOwner:', isOwner);
            return isOwner;
        });
        console.log('PlaylistContext: Filtered playlists:', filtered);
        return filtered;
    };

    const isPlaylistOwner = (playlist: Playlist, userId: number): boolean => {
        const userValue = playlist.user;
        return typeof userValue === 'object' && userValue !== null 
            ? (userValue as { id: number }).id === userId 
            : userValue === userId;
    };

    const createPlaylist = async (title: string, privacy_setting: string) => {
        if (!user) {
            throw new Error('User must be logged in to create a playlist');
        }

        try {
            const isDuplicate = playlists.some(playlist => playlist.title.toLowerCase() === title.toLowerCase());
            if (isDuplicate) {
                throw new Error('Playlist name already exists');
            }
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.post('http://13.215.205.59:8000/api/playlists/', {
                title,
                privacy_setting,
                creation_date: new Date().toISOString(),
                user: user.id
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('PlaylistContext: Created playlist:', response.data);
            await fetchPlaylists(); // Refresh playlists after creating
        } catch (error) {
            console.error('PlaylistContext: Error creating playlist:', error);
            throw error;
        }
    };

    const deletePlaylist = async (id: number) => {
        if (!user) {
            throw new Error('User must be logged in to delete a playlist');
        }

        try {
            const playlist = playlists.find(p => p.id === id);
            if (!playlist || !isPlaylistOwner(playlist, user.id)) {
                throw new Error('You do not have permission to delete this playlist');
            }

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            await axios.delete(`http://13.215.205.59:8000/api/playlists/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('PlaylistContext: Deleted playlist:', id);
            await fetchPlaylists(); // Refresh playlists after deleting
        } catch (error) {
            console.error('PlaylistContext: Error deleting playlist:', error);
            throw error;
        }
    };

    const addSongToPlaylist = async (playlistId: number, songId: number) => {
        if (!user) {
            throw new Error('User must be logged in to modify a playlist');
        }

        try {
            const playlist = playlists.find(p => p.id === playlistId);
            if (!playlist || !isPlaylistOwner(playlist, user.id)) {
                throw new Error('You do not have permission to modify this playlist');
            }

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            await axios.post('http://13.215.205.59:8000/api/playlist_songs/', {
                playlist: playlistId,
                song: songId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('PlaylistContext: Added song to playlist:', { playlistId, songId });
        } catch (error) {
            console.error('PlaylistContext: Error adding song to playlist:', error);
            throw error;
        }
    };

    const getPlaylistSongs = async (playlistId: number): Promise<Song[]> => {
        if (!user) {
            throw new Error('User must be logged in to view playlist songs');
        }

        try {
            const playlist = playlists.find(p => p.id === playlistId);
            if (!playlist || !isPlaylistOwner(playlist, user.id)) {
                throw new Error('You do not have permission to view this playlist');
            }

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const playlistSongsRes = await axios.get('http://13.215.205.59:8000/api/playlist_songs/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const playlistSongs: Playlist_songsong[] = playlistSongsRes.data;
            const songIds = playlistSongs.filter(ps => ps.playlist === playlistId).map(ps => ps.song);
            const songsRes = await axios.get('http://13.215.205.59:8000/api/songs/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const allSongs: Song[] = songsRes.data;
            const filteredSongs = allSongs.filter(song => songIds.includes(song.id));
            console.log('PlaylistContext: Got songs for playlist:', { playlistId, songs: filteredSongs });
            return filteredSongs;
        } catch (error) {
            console.error('PlaylistContext: Error fetching playlist songs:', error);
            return [];
        }
    };

    const removeSongFromPlaylist = async (playlistId: number, songId: number) => {
        if (!user) {
            throw new Error('User must be logged in to modify a playlist');
        }

        try {
            const playlist = playlists.find(p => p.id === playlistId);
            if (!playlist || !isPlaylistOwner(playlist, user.id)) {
                throw new Error('You do not have permission to modify this playlist');
            }

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const playlistSongsRes = await axios.get('http://13.215.205.59:8000/api/playlist_songs/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const playlistSongs: Playlist_songsong[] = playlistSongsRes.data;
            const toDelete = playlistSongs.find(ps => ps.playlist === playlistId && ps.song === songId);
            if (toDelete) {
                await axios.delete(`http://13.215.205.59:8000/api/playlist_songs/${toDelete.id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('PlaylistContext: Removed song from playlist:', { playlistId, songId });
            }
        } catch (error) {
            console.error('PlaylistContext: Error removing song from playlist:', error);
            throw error;
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
        getPlaylistSongs,
        filterPlaylistsByUser,
        fetchPlaylists,
        clearPlaylists
    };

    console.log("PlaylistContext: Current state:", {
        playlists,
        currentPlaylist,
        user
    });

    return (
        <PlaylistContext.Provider value={contextValue}>
            {children}
        </PlaylistContext.Provider>
    );
};

export default PlaylistContextProvider; 