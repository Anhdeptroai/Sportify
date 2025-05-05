import React, { useContext, useState } from 'react';
import { PlayerContext } from '../controllers/context';
import { PlaylistContext } from '../controllers/playlistContext';
import { Song } from '../models/song';

const Playlist: React.FC = () => {
    const { 
        playlists, 
        currentPlaylist, 
        setCurrentPlaylist,
        createPlaylist, 
        deletePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        getPlaylistSongs 
    } = useContext(PlaylistContext);
    
    const { playWithId } = useContext(PlayerContext);
    const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
    const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleCreatePlaylist = async () => {
        if (newPlaylistTitle.trim()) {
            await createPlaylist(newPlaylistTitle, 'public');
            setNewPlaylistTitle('');
            setShowCreateForm(false);
        }
    };

    const handlePlaylistSelect = async (playlist: any) => {
        setCurrentPlaylist(playlist);
        const songs = await getPlaylistSongs(playlist.id);
        setPlaylistSongs(songs);
    };

    const handlePlaySong = (songId: number) => {
        playWithId(songId);
    };

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-bold text-white">Your Playlists</h2>
                <button 
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="px-4 py-2 bg-[#1db954] text-white rounded-full font-bold hover:bg-[#1ed760] transition-colors"
                >
                    Create New Playlist
                </button>
            </div>

            {showCreateForm && (
                <div className="flex gap-2.5 mb-5 p-4 bg-[#282828] rounded-lg">
                    <input
                        type="text"
                        value={newPlaylistTitle}
                        onChange={(e) => setNewPlaylistTitle(e.target.value)}
                        placeholder="Enter playlist name"
                        className="flex-1 px-3 py-2 border border-[#404040] rounded bg-[#404040] text-white focus:outline-none focus:border-[#1db954]"
                    />
                    <button 
                        onClick={handleCreatePlaylist}
                        className="px-4 py-2 bg-[#1db954] text-white rounded hover:bg-[#1ed760] transition-colors"
                    >
                        Create
                    </button>
                    <button 
                        onClick={() => setShowCreateForm(false)}
                        className="px-4 py-2 bg-[#404040] text-white rounded hover:bg-[#505050] transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">
                {playlists.map((playlist) => (
                    <div 
                        key={playlist.id} 
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                            currentPlaylist?.id === playlist.id 
                                ? 'bg-[#404040]' 
                                : 'bg-[#282828] hover:bg-[#383838]'
                        }`}
                        onClick={() => handlePlaylistSelect(playlist)}
                    >
                        <h3 className="text-lg font-semibold text-white mb-2.5">{playlist.title}</h3>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                deletePlaylist(playlist.id);
                            }}
                            className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {currentPlaylist && (
                <div className="bg-[#282828] p-5 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Songs in {currentPlaylist.title}</h3>
                    {playlistSongs.map((song) => (
                        <div 
                            key={song.id} 
                            className="flex items-center justify-between py-2.5 border-b border-[#404040] last:border-0"
                        >
                            <span className="text-white flex-1">{song.title}</span>
                            <div className="flex gap-2.5">
                                <button 
                                    onClick={() => handlePlaySong(song.id)}
                                    className="px-3 py-1.5 bg-[#1db954] text-white rounded hover:bg-[#1ed760] transition-colors"
                                >
                                    Play
                                </button>
                                <button 
                                    onClick={() => removeSongFromPlaylist(currentPlaylist.id, song.id)}
                                    className="px-3 py-1.5 bg-[#404040] text-white rounded hover:bg-[#505050] transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Playlist; 