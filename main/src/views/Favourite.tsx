import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import clock_icon from '../assets/image/clock_icon.png';
import imgDefault from '../assets/image/img1.jpg';
import { AuthContext } from '../controllers/authContext.tsx';
import { PlayerContext } from '../controllers/context.tsx';
import Footer from '../layouts/Footer.tsx';
import Navbar from '../layouts/Navbar.tsx';
import Player from '../layouts/Player.tsx';
import Sidebar from '../layouts/Sidebar.tsx';
import { Song } from '../models/song.tsx';

const Favourite = () => {
    const navigate = useNavigate();
    const [songs, setSongs] = useState<Song[]>([]);
    const { audioRef } = useContext(PlayerContext);
    const { setTrack } = useContext(PlayerContext);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user && user.id) {
            axios.get(`http://13.215.205.59:8000/api/interactions/`)
                .then(res => {
                    // Lọc các interaction của user hiện tại và interaction_type là 'favor'
                    const userInteractions = res.data.filter(
                      (interaction: any) => interaction.user === user.id && interaction.interaction_type === "favor"
                    );
                    const songPromises = userInteractions.map((interaction: any) =>
                        axios.get(`http://13.215.205.59:8000/api/songs/${interaction.song}/`)
                    );
                    return Promise.all(songPromises);
                })
                .then(responses => {
                    const songsData = responses.map(res => res.data);
                    setSongs(songsData);
                })
                .catch(err => {
                    console.error("Lỗi khi lấy danh sách bài hát yêu thích:", err);
                    setSongs([]);
                    toast.error("Không thể tải danh sách bài hát yêu thích");
                });
        }
    }, [user]);

    const handleRemoveFromFavourites = async (songId: number) => {
        if (!user) return;

        try {
            // 1. Lấy tất cả interaction của user hiện tại và bài hát này
            const res = await axios.get('http://13.215.205.59:8000/api/interactions/');
            const interaction = res.data.find(
                (item: any) =>
                    item.user === user.id &&
                    item.song === songId &&
                    item.interaction_type === "favor"
            );

            if (!interaction) {
                toast.error("Không tìm thấy interaction yêu thích để xóa!");
                return;
            }

            // 2. Gọi DELETE đúng endpoint
            await axios.delete(`http://13.215.205.59:8000/api/interactions/${interaction.id}/`);
            setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
            toast.success("Đã xóa khỏi danh sách yêu thích!");
        } catch (error) {
            toast.error("Không thể xóa khỏi danh sách yêu thích!");
        }
    };

    const handlePlaySong = async (song: Song) => {
        try {
            if (!song) {
                console.error("Không tìm thấy bài hát");
                toast.error("Không tìm thấy bài hát");
                return;
            }

            await setTrack(song);

            if (!audioRef.current) {
                console.error("Audio element không tồn tại");
                toast.error("Không thể phát nhạc");
                return;
            }

            audioRef.current.src = `http://13.215.205.59/msa/track/${song.audio_file}`;
            await audioRef.current.load();

            try {
                await audioRef.current.play();
            } catch (error) {
                console.error("Lỗi khi phát nhạc:", error);
                toast.error("Không thể phát bài hát này");
            }
        } catch (error) {
            console.error("Lỗi khi xử lý bài hát:", error);
            toast.error("Có lỗi xảy ra khi phát nhạc");
        }
    };

    if (!songs) return <p>Đang tải...</p>;

    return (
        <>
            <Navbar />
            <div className="flex bg-black h-[80%] overflow-hidden">
                <Sidebar />
                <div className="bg-gray-800 h-[calc(100vh-23vh)] w-full m-2 rounded-2xl overflow-y-scroll">
                    <div className="mt-10 flex gap-8 flex-col md:flex-row md:item-end ml-8 mr-8">
                        <img 
                            className="w-48 h-48 object-cover rounded shadow-lg" 
                            src={songs[0]?.image ? `http://13.215.205.59/msa/track_img/${songs[0].image}` : imgDefault} 
                            alt="Favourites cover" 
                        />
                        <div className="flex flex-col">
                            <p>Danh sách yêu thích</p>
                            <h2 className="text-5xl font-bold mb-4 md:text-7x1">Bài hát yêu thích</h2>
                            <p>{songs.length} bài hát</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-8 text-[#a7a7a7]">
                        <p><b className='mr-4'>#</b>Tên bài hát</p>
                        <p>Album</p>
                        <p className='hidden sm:block'>Ngày thêm</p>
                        <img className='m-auto w-4' src={clock_icon} alt="" />
                    </div>

                    <div className="mt-5">
                        {songs.length === 0 ? (
                            <div className="text-center text-gray-100 py-8">
                                Chưa có bài hát yêu thích nào.
                            </div>
                        ) : (
                            songs.map((song, index) => (
                                <div 
                                    key={song.id} 
                                    className="grid grid-cols-3 sm:grid-cols-4 items-center p-4 hover:bg-gray-700 text-white cursor-pointer"
                                    onClick={() => handlePlaySong(song)}
                                >
                                    <div className="flex items-center">
                                        <span className="mr-4">{index + 1}</span>
                                        <span className="hover:text-green-500 transition-colors">{song.title}</span>
                                    </div>
                                    <p>{song.album}</p>
                                    <p className="hidden sm:block">{new Date().toLocaleDateString()}</p>
                                    <div className="flex justify-center">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFromFavourites(song.id);
                                            }}
                                            className="text-white-500 hover:text-white-700"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="mt-5">
                        <Footer />
                    </div>
                </div>
            </div>
            <Player />
        </>
    );
};

export default Favourite;