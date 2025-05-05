import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import clock_icon from '../assets/image/clock_icon.png';
import imgDefault from '../assets/image/img1.jpg';
import { PlayerContext } from '../controllers/context.tsx';
import { PlaylistContext } from '../controllers/playlistContext.tsx';
import Footer from '../layouts/Footer.tsx';
import Navbar from '../layouts/Navbar.tsx';
import Player from '../layouts/Player.tsx';
import Sidebar from '../layouts/Sidebar.tsx';
import { Playlist } from '../models/playlist.tsx';
import { Song } from '../models/song.tsx';

const PlaylistView = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
    const { audioRef } = useContext(PlayerContext);
    const { 
        playlists,
        getPlaylistSongs,
        addSongToPlaylist,
        removeSongFromPlaylist,
        createPlaylist,
        deletePlaylist
    } = useContext(PlaylistContext);

    useEffect(() => {
        if (id) {
            axios.get(`http://18.142.50.220:8000/api/playlists/${id}/`)
                .then(res => {
                    setCurrentPlaylist(res.data);
                    return getPlaylistSongs(res.data.id);
                })
                .then(songs => setSongs(songs))
                .catch(err => {
                    setCurrentPlaylist(null);
                    setSongs([]);
                    navigate('/playlist');
                });
        } else {
            // Fetch all songs for creating new playlist
            axios.get('http://18.142.50.220:8000/api/songs/')
                .then(res => setSongs(res.data))
                .catch(err => console.error("Error fetching songs:", err));
        }
    }, [id, getPlaylistSongs, navigate]);

    const handleAddToPlaylist = async (songId: number) => {
        if (currentPlaylist) {
            await addSongToPlaylist(currentPlaylist.id, songId);
            const updatedSongs = await getPlaylistSongs(currentPlaylist.id);
            setSongs(updatedSongs);
        }
    };

    const handleRemoveFromPlaylist = async (songId: number) => {
        if (currentPlaylist) {
            await removeSongFromPlaylist(currentPlaylist.id, songId);
            const updatedSongs = await getPlaylistSongs(currentPlaylist.id);
            setSongs(updatedSongs);
        }
    };

    const handleCreatePlaylist = async (title: string) => {
        await createPlaylist(title, 'public');
        navigate('/playlist');
    };

    const handleDeletePlaylist = async () => {
        if (currentPlaylist) {
            try {
                await deletePlaylist(currentPlaylist.id);
                navigate('/playlist');
            } catch (err) {
                toast.error('Xóa playlist thất bại!');
                console.error('Delete playlist error:', err);
            }
        }
    };

    if (!currentPlaylist && id) return <p>Loading playlist...</p>;
    if (!songs) return <p>Loading songs...</p>;

    return (
        <>
            <Navbar />
            <div className="flex bg-black h-[80%] overflow-hidden">
                <Sidebar />
                <div className="bg-gray-800 h-[calc(100vh-23vh)] w-full m-2 rounded-2xl overflow-y-scroll">
                    {currentPlaylist ? (
                        <>
                            <div className="mt-10 flex gap-8 flex-col md:flex-row md:item-end ml-8 mr-8">
                                <img 
                                    className="w-48 h-48 object-cover rounded shadow-lg" 
                                    src={songs[0]?.image ? `http://18.142.50.220/msa/track_img/${songs[0].image}` : imgDefault} 
                                    alt="Playlist cover" 
                                />
                                <div className="flex flex-col">
                                    <p>Playlist</p>
                                    <h2 className="text-5xl font-bold mb-4 md:text-7x1">{currentPlaylist.title}</h2>
                                    <p>{songs.length} songs</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-8 text-[#a7a7a7]">
                                <p><b className='mr-4'>#</b>Title</p>
                                <p>Album</p>
                                <p className='hidden sm:block'>Date Added</p>
                                <img className='m-auto w-4' src={clock_icon} alt="" />
                            </div>

                            <div className="mt-5">
                                {songs.length === 0 ? (
                                    <div className="text-center text-gray-100 py-8">
                                        Playlist này chưa có bài hát nào.
                                    </div>
                                ) : (
                                    songs.map((song, index) => (
                                        <div 
                                            key={song.id} 
                                            className="grid grid-cols-3 sm:grid-cols-4 items-center p-4 hover:bg-gray-700 text-white"
                                        >
                                            <div className="flex items-center">
                                                <span className="mr-4">{index + 1}</span>
                                                <span>{song.title}</span>
                                            </div>
                                            <p>{song.album}</p>
                                            <p className="hidden sm:block">{new Date().toLocaleDateString()}</p>
                                            <div className="flex justify-center">
                                                <button 
                                                    onClick={() => handleRemoveFromPlaylist(song.id)}
                                                    className="text-white-500 hover:text-white-700"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="p-8">
                            <h2 className="text-2xl font-bold mb-4">Create New Playlist</h2>
                            <div className="mb-8">
                                <input
                                    type="text"
                                    placeholder="Enter playlist name"
                                    className="px-4 py-2 rounded bg-gray-700 text-white"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCreatePlaylist((e.target as HTMLInputElement).value);
                                        }
                                    }}
                                />
                            </div>
                            <h3 className="text-xl font-bold mb-4">Available Songs</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 mb-4 text-[#a7a7a7]">
                                <p><b className='mr-4'>#</b>Title</p>
                                <p>Album</p>
                                <p className='hidden sm:block'>Duration</p>
                                <p>Action</p>
                            </div>
                            {songs.map((song, index) => (
                                <div 
                                    key={song.id} 
                                    className="grid grid-cols-3 sm:grid-cols-4 items-center p-4 hover:bg-gray-700"
                                >
                                    <div className="flex items-center">
                                        <span className="mr-4">{index + 1}</span>
                                        <span>{song.title}</span>
                                    </div>
                                    <p>{song.album}</p>
                                    <p className="hidden sm:block">{song.duration}</p>
                                    <div className="flex justify-center">
                                        <button 
                                            onClick={() => handleAddToPlaylist(song.id)}
                                            className="text-green-500 hover:text-green-700"
                                        >
                                            Add to Playlist
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-5">
                        <Footer />
                    </div>
                </div>
            </div>
            <Player />
        </>
    );
};

export default PlaylistView;