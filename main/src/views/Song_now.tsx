import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { FaDownload, FaHeart } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlayerContext } from '../controllers/context.tsx';
import { PlaylistContext } from '../controllers/playlistContext';
import Footer from '../layouts/Footer.tsx';
import Navbar from '../layouts/Navbar.tsx';
import Player from '../layouts/Player.tsx';
import Sidebar from '../layouts/Sidebar.tsx';
import { Song } from '../models/song.tsx';

const Song_now = () => {

    // const {audioRef, track} = useContext(PlayerContext);

    const navigate = useNavigate();
    const [songs, setSongs] = useState<Song[]>([]);
    const { audioRef } = useContext(PlayerContext);
    const { playlists, addSongToPlaylist, filterPlaylistsByUser } = useContext(PlaylistContext);
    const [showAdd, setShowAdd] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState<number | null>(null);
    const [adding, setAdding] = useState(false);
    const [favoriteSongs, setFavoriteSongs] = useState<number[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteInteractionId, setFavoriteInteractionId] = useState<number|null>(null);
    const [loadingFavorite, setLoadingFavorite] = useState(true);

    useEffect(() => {
        axios.get('http://13.215.205.59:8000/api/songs/')
            .then(res => setSongs(res.data))
            .catch(err => console.error("Lỗi khi lấy bài hát", err));
    }, []);

    useEffect(() => {
        const fav = localStorage.getItem('favoriteSongs');
        if (fav) setFavoriteSongs(JSON.parse(fav));
    }, []);

    const {id} = useParams<{id : string}>();
    const songId = Number(id);
    const Song_item = songs.find(song => song.id === songId);
    console.log(Song_item);

    useEffect(() => {
        const fetchFavorite = async () => {
            if (!Song_item) return;
            setLoadingFavorite(true);
            const userIdStr = localStorage.getItem('user_id');
            const userId = userIdStr ? Number(userIdStr) : null;
            if (!userId) {
                setIsFavorite(false);
                setFavoriteInteractionId(null);
                setLoadingFavorite(false);
                return;
            }
            try {
                const res = await axios.get('http://13.215.205.59:8000/api/interactions/');
                const found = res.data.find((interaction: any) =>
                    interaction.user === userId &&
                    interaction.song === Song_item.id &&
                    interaction.interaction_type === 'favor'
                );
                setIsFavorite(!!found);
                setFavoriteInteractionId(found ? found.id : null);
            } catch (e) {
                setIsFavorite(false);
                setFavoriteInteractionId(null);
            } finally {
                setLoadingFavorite(false);
            }
        };
        fetchFavorite();
    }, [Song_item]);

    // const track = `http://13.215.205.59/msa/track/${Song_item.audio_file}`;
    const image = `http://13.215.205.59/msa/track_img/${Song_item?.image}`;

    const handleAddToPlaylist = async () => {
        if (!selectedPlaylist || !Song_item) {
            toast.error('Vui lòng chọn playlist và đảm bảo bài hát tồn tại!');
            return;
        }
        setAdding(true);
        try {
            await addSongToPlaylist(selectedPlaylist, Song_item.id);
            toast.success('Đã thêm bài hát vào playlist!');
            setShowAdd(false);
        } catch (err) {
            toast.error('Thêm bài hát thất bại!');
        } finally {
            setAdding(false);
        }
    };

    const handleToggleFavorite = async () => {
        if (!Song_item) return;
        const userIdStr = localStorage.getItem('user_id');
        const userId = userIdStr ? Number(userIdStr) : null;
        if (!userId) {
            toast.error('Vui lòng đăng nhập để thêm bài hát vào yêu thích!');
            return;
        }
        setLoadingFavorite(true);
        try {
            if (isFavorite && favoriteInteractionId) {
                await axios.delete(`http://13.215.205.59:8000/api/interactions/${favoriteInteractionId}/`);
                setIsFavorite(false);
                setFavoriteInteractionId(null);
                toast.success('Đã xóa khỏi yêu thích!');
            } else if (!isFavorite) {
                const res = await axios.post('http://13.215.205.59:8000/api/interactions/', {
                    user: userId,
                    song: Song_item.id,
                    interaction_type: "favor",
                    timestamp: new Date().toISOString()
                });
                setIsFavorite(true);
                setFavoriteInteractionId(res.data.id);
                toast.success('Đã thêm vào yêu thích!');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật yêu thích!');
        } finally {
            setLoadingFavorite(false);
        }
    };

    const handleDownload = () => {
        if (!Song_item) return;
        const downloadUrl = `http://13.215.205.59/msa/track/${Song_item.audio_file}`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${Song_item.title}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Lấy userId từ localStorage
    const userIdStr = localStorage.getItem('user_id');
    const userId = userIdStr ? Number(userIdStr) : null;
    // Lọc playlist theo user
    const userPlaylists = userId ? filterPlaylistsByUser(userId) : [];

    if (!Song_item) {
        return (
            <>
                <Navbar />
                <div className="flex bg-black h-[80%] overflow-hidden">
                    <Sidebar />
                    <div className="bg-gray-800 h-[calc(100vh-23vh)] w-full m-2 rounded-2xl overflow-y-scroll flex items-center justify-center">
                        <span className="text-white text-xl">Không tìm thấy bài hát!</span>
                    </div>
                </div>
                <Player />
            </>
        );
    }

    return (<>
        <Navbar />
        <div className="flex bg-black h-[80%] overflow-hidden">
            <Sidebar />
            <div className="bg-gray-800 h-[calc(100vh-23vh)] w-full m-2 rounded-2xl overflow-y-scroll">
                <div className="mt-10 flex gap-8 flex-col md:flex-row md:item-end ml-8 mr-8 text-white">
                    <img className="w-48 rounded" src={image} alt="" />
                    <div className="flex flex-col">
                        <p>Bài hát</p>
                        <h2 className="text-5xl font-bold mb-4 md:text-7x1">{Song_item?.title}</h2>
                        <div className="flex items-center gap-4">
                            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-2" onClick={() => setShowAdd(v => !v)}>
                                Thêm vào Playlist
                            </button>
                            <button onClick={handleToggleFavorite} className="focus:outline-none" disabled={loadingFavorite}>
                                <FaHeart className={isFavorite ? 'text-red-500 text-2xl' : 'text-white text-2xl'} />
                            </button>
                            <button onClick={handleDownload} className="focus:outline-none">
                                <FaDownload className="text-white text-2xl hover:text-green-500" />
                            </button>
                        </div>
                        {showAdd && Song_item && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white rounded-xl p-8 w-96 flex flex-col items-center">
                                    <h2 className="text-xl font-bold mb-4 text-black">Thêm vào Playlist</h2>
                                    <label className="mb-1 text-sm text-black w-full text-left">Chọn playlist:</label>
                                    <select
                                        className="p-2 rounded text-black w-full mb-4"
                                        value={selectedPlaylist ?? ''}
                                        onChange={e => setSelectedPlaylist(Number(e.target.value))}
                                    >
                                        <option value="" disabled>-- Chọn playlist --</option>
                                        {userPlaylists.map(pl => (
                                            <option key={pl.id} value={pl.id}>{pl.title}</option>
                                        ))}
                                    </select>
                                    <div className="flex gap-2 w-full">
                                        <button
                                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                            onClick={handleAddToPlaylist}
                                            disabled={adding || !selectedPlaylist}
                                        >{adding ? 'Đang thêm...' : 'Xác nhận thêm'}</button>
                                        <button
                                            className="flex-1 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                                            onClick={() => setShowAdd(false)}
                                            disabled={adding}
                                        >Hủy</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-5">
                    <Footer />
                </div>
            </div>
        </div>
        
        <Player />
    </>)
}
export default Song_now;