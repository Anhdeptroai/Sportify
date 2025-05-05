import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
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
    const { playlists, addSongToPlaylist } = useContext(PlaylistContext);
    const [showAdd, setShowAdd] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState<number | null>(null);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        axios.get('http://18.142.50.220:8000/api/songs/')
            .then(res => setSongs(res.data))
            .catch(err => console.error("Lỗi khi lấy bài hát", err));
    }, []);
    
    if (songs.length === 0) return <p>Đang tải danh sách bài hát...</p>;

    const {id} = useParams<{id : string}>();
    const songIndex = Number(id);
    const Song_item = songs[songIndex-2];
    console.log(Song_item);

    // const track = `http://18.142.50.220/msa/track/${Song_item.audio_file}`;
    const image = `http://18.142.50.220/msa/track_img/${Song_item.image}`;

    const handleAddToPlaylist = async () => {
        if (!selectedPlaylist) {
            toast.error('Vui lòng chọn playlist!');
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

    return (<>
        <Navbar />
        <div className="flex bg-black h-[80%] overflow-hidden">
            <Sidebar />
            <div className="bg-gray-800 h-[calc(100vh-23vh)] w-full m-2 rounded-2xl overflow-y-scroll">
                <div className="mt-10 flex gap-8 flex-col md:flex-row md:item-end ml-8 mr-8 text-white">
                    <img className="w-48 rounded" src={image} alt="" />
                    <div className="flex flex-col">
                        <p>Bài hát</p>
                        <h2 className="text-5xl font-bold mb-4 md:text-7x1">{Song_item.title}</h2>
                        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-2" onClick={() => setShowAdd(v => !v)}>
                            Thêm vào Playlist
                        </button>
                        {showAdd && (
                            <div className="mt-2 bg-gray-900 p-4 rounded-lg shadow-lg flex flex-col gap-2 w-64">
                                <label className="mb-1 text-sm">Chọn playlist:</label>
                                <select
                                    className="p-2 rounded text-black"
                                    value={selectedPlaylist ?? ''}
                                    onChange={e => setSelectedPlaylist(Number(e.target.value))}
                                >
                                    <option value="" disabled>-- Chọn playlist --</option>
                                    {playlists.map(pl => (
                                        <option key={pl.id} value={pl.id}>{pl.title}</option>
                                    ))}
                                </select>
                                <button
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                    onClick={handleAddToPlaylist}
                                    disabled={adding || !selectedPlaylist}
                                >{adding ? 'Đang thêm...' : 'Xác nhận thêm'}</button>
                                <button
                                    className="mt-2 px-4 py-2 bg-gray-400 text-black rounded hover:bg-gray-500"
                                    onClick={() => setShowAdd(false)}
                                    disabled={adding}
                                >Hủy</button>
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