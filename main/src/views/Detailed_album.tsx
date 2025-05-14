import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clock_icon from '../assets/image/clock_icon.png';
import { PlayerContext } from '../controllers/context.tsx';
import Footer from '../layouts/Footer.tsx';
import Navbar from '../layouts/Navbar.tsx';
import Player from '../layouts/Player.tsx';
import Sidebar from '../layouts/Sidebar.tsx';
import { Album } from '../models/album.tsx';
import { Artist } from '../models/artist.tsx';
import { Song } from '../models/song.tsx';

const Detailed_album = () => {

    const navigate = useNavigate();
    const [artists, setArtists] = useState<Artist[]>([]);
    const [songs, setSongs] = useState<Song[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const { playWithId } = useContext(PlayerContext);
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('http://13.215.205.59:8000/api/artists/', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setArtists(res.data))
            .catch(err => console.error('Lỗi khi lấy danh sách bài hát:', err));

        axios.get('http://13.215.205.59:8000/api/songs/', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setSongs(res.data))
            .catch(err => console.error("Lỗi khi lấy bài hát", err));

        axios.get('http://13.215.205.59:8000/api/albums/', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setAlbums(res.data))
            .catch(err => console.error("Lỗi khi lấy bài hát", err));
    }, []);

    if (albums.length === 0) return <p>Đang tải danh sách album...</p>;

    const { id } = useParams<{ id: string }>();
    const albumIndex = Number(id);
    const Album_item = albums[albumIndex - 1];
    console.log(Album_item);

    const getAlbumBySong = (song: Song) => {
        return albums.filter(album =>
            song.album === album.id
        );
    };

    // const artistSongs = getSongsByArtist(Artist_item);


    // const pictute = `http://13.215.205.59/msa/artist/${Artist_item.profile_picture}`;

    return (<>
        <Navbar />
        <div className="flex bg-black h-[80%] overflow-hidden">
            <Sidebar />
            <div className="bg-gray-800 h-[calc(100vh-23vh)] w-full m-2 rounded-2xl overflow-y-scroll ">
                <div className="mt-10 flex gap-8 flex-col md:flex-row md:item-end ml-8 mr-8 text-white">
                    <img
                        className="w-48 rounded"
                        src={Album_item.songs.length > 0 ? `http://13.215.205.59/msa/track_img/${Album_item.songs[0].image}` : ''}
                        alt={Album_item.title}
                    />
                    <div className="flex flex-col">
                        <p>Playlist</p>
                        <h2 className="text-5xl font-bold mb-4 md:text-7x1">{Album_item.title}</h2>
                        <h4>Hiện có 1000000 người đang theo dõi</h4>
                    </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-8 text-[#a7a7a7]">
                    <p><b className='mr-4'>#</b>Title</p>
                    <p>Album</p>
                    <p className='hidden sm:block'>Category</p>
                    <img className='m-auto w-4' src={clock_icon} alt="" />
                </div>

                <div className="text-white">
                    <div key={Album_item.id} className="mb-6">
                        {Album_item.songs.map((song, index) => {
                            const picture_song = `http://13.215.205.59/msa/track_img/${song.image}`;
                            return (
                                <div key={song.id} className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-8 text-[#a7a7a7]"
                                    onClick={() => { navigate(`/song/${song.id}`); playWithId(song.id); }}>
                                    <p className='flex gap-5'>
                                        <b>{index + 1}</b>
                                        <img className="w-10" src={picture_song} alt="" />
                                        {song.title}
                                    </p>
                                    <p></p>
                                    <p>{song.genre}</p>
                                    <p className="text-center">{song.duration}</p>
                                </div>
                            )
                        })}
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
export default Detailed_album;