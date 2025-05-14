import axios from 'axios'
import { useContext, useEffect, useRef, useState } from 'react'
import { FaHeart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import loop_icon from '../assets/image/loop.png'
import mic_icon from '../assets/image/mic.png'
import mini_player_icon from '../assets/image/mini-player.png'
import next_icon from '../assets/image/next.png'
import pause_icon from '../assets/image/pause.png'
import play_icon from '../assets/image/play.png'
import plays_icon from '../assets/image/plays.png'
import prev_icon from '../assets/image/prev.png'
import queue_icon from '../assets/image/queue.png'
import shuffle_icon from '../assets/image/shuffle.png'
import speaker_icon from '../assets/image/speaker.png'
import volume_icon from '../assets/image/volume.png'
import zoom_icon from '../assets/image/zoom.png'
import { PlayerContext } from '../controllers/context'

const Player = () => {
    const navigate = useNavigate();
    const { track, audioRef, seekBar, seekBg, playStatus, play, pause, time, previous, next, loop, shuffle, seekSong } = useContext(PlayerContext);
    const [favoriteSongs, setFavoriteSongs] = useState<number[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loadingFavorite, setLoadingFavorite] = useState(true);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);

    const volumeSliderRef = useRef<HTMLDivElement>(null);
    const [favoriteInteractionId, setFavoriteInteractionId] = useState<number|null>(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Load favorite songs from localStorage
        const fav = localStorage.getItem('favoriteSongs');
        if (fav) setFavoriteSongs(JSON.parse(fav));
    }, []);

    useEffect(() => {
        const fetchFavorite = async () => {
            if (!track) return;
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
                    interaction.song === track.id &&
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
    }, [track]);

    const handleToggleFavorite = async () => {
        if (!track) return;
        const userIdStr = localStorage.getItem('user_id');
        const userId = userIdStr ? Number(userIdStr) : null;
        if (!userId) {
            toast.error('Vui lòng đăng nhập để thêm bài hát vào yêu thích!');
            return;
        }
        setLoadingFavorite(true);
        try {
            // Lấy tất cả interaction
            const res = await axios.get('http://13.215.205.59:8000/api/interactions/');
            const interaction = res.data.find(
                (item: any) =>
                    item.user === userId &&
                    item.song === track.id &&
                    item.interaction_type === "favor"
            );

            if (interaction) {
                // Đã yêu thích, xóa
                await axios.delete(`http://13.215.205.59:8000/api/interactions/${interaction.id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setIsFavorite(false);
                setFavoriteInteractionId(null);
                toast.success('Đã xóa khỏi danh sách yêu thích!');
            } else {
                // Chưa yêu thích, thêm mới
                const resAdd = await axios.post('http://13.215.205.59:8000/api/interactions/', {
                    user: userId,
                    song: track.id,
                    interaction_type: "favor",
                    timestamp: new Date().toISOString()
                });
                setIsFavorite(true);
                setFavoriteInteractionId(resAdd.data.id);
                toast.success('Đã thêm vào danh sách yêu thích!');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật yêu thích!');
        } finally {
            setLoadingFavorite(false);
        }
    };

    const handleShowYoutube = () => {
        if (track) {
            navigate('/video');
        }
    };

    if (!track) return null;
    const img = `http://13.215.205.59/msa/track_img/${track.image}`;

    return <>
        
        <div className="h-[10%] bg-gray-600 flex justify-between item-center text-white p-4">
            <div className="hidden lg:flex item-center gap-4">
                <img className="w-12" src={img} alt="" />
                <div>
                    <p>{track.title}</p>
                    <p>{track.participants?.map((p: { artist_name: string }) => p.artist_name).join(', ')}</p>
                </div>
                <button onClick={handleToggleFavorite} className="ml-4 focus:outline-none" disabled={loadingFavorite}>
                    <FaHeart className={isFavorite ? 'text-red-500 text-2xl' : 'text-white text-2xl'} />
                </button>
            </div>

            <div className='flex flex-col items-center gap-1 m-auto'>
                <div className='flex gap-4'>
                    <img onClick={shuffle} className='w-4 cursor-pointer' src={shuffle_icon} alt='' />
                    <img onClick={previous} className='w-4 cursor-pointer' src={prev_icon} alt='' />
                    {playStatus
                        ? <img onClick={pause} className='w-4 cursor-pointer' src={pause_icon} alt='' />
                        : <img onClick={play} className='w-4 cursor-pointer' src={play_icon} alt='' />
                    }
                    <img onClick={next} className='w-4 cursor-pointer' src={next_icon} alt='' />
                    <img onClick={loop} className='w-4 cursor-pointer' src={loop_icon} alt='' />
                </div>

                <div className='flex items-center gap-6'>
                    <p>{time.currentTime.minutes}:{time.currentTime.seconds.toString().padStart(2, '0')}</p>
                    <div ref={seekBg} onClick={seekSong} className='w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer'>
                        <hr ref={seekBar} className='h-1 border-none w-0 bg-green-800 rounded-full' />
                    </div>
                    <p>{time.totalTime.minutes}:{time.totalTime.seconds.toString().padStart(2, '0')}</p>
                </div>
            </div>

            <div className='hidden lg:flex items-center gap-2 opacity-75'>
                <img className='w-4 cursor-pointer' src={plays_icon} alt='' onClick={handleShowYoutube} />
                <img className='w-4' src={mic_icon} alt='' />
                <img className='w-4' src={queue_icon} alt='' />
                <img className='w-4' src={speaker_icon} alt='' />
                <img className='w-4' src={volume_icon} alt='' />

                <div className='w-20 bg-slate-50 h-1 rounded'>
                    <div className='bg-green-800 h-1 w-0 rounded'></div>
                </div>

                <img className='w-4' src={mini_player_icon} alt='' />
                <img className='w-4' src={zoom_icon} alt='' />
            </div>
        </div>
    </>
}

export default Player