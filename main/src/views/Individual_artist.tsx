import Sidebar from '../layouts/Sidebar.tsx';
import Footer from '../layouts/Footer.tsx';
import Navbar from '../layouts/Navbar.tsx';
import List from '../components/com_list.tsx'
import Player from '../layouts/Player.tsx';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {Artist} from '../models/artist.tsx';
import {Song} from '../models/song.tsx';
import clock_icon from '../assets/image/clock_icon.png';
import { PlayerContext} from '../models/context.tsx';

const Individual_artist = () => {

    // const {audioRef, track} = useContext(PlayerContext);

    const navigate = useNavigate();
    const [artists, setArtists] = useState<Artist[]>([]);
    const [songs, setSongs] = useState<Song[]>([]);
    const { audioRef } = useContext(PlayerContext);

    useEffect(() => {
        axios.get('http://18.142.50.220:8000/api/artists/')
            .then(res => setArtists(res.data))
            .catch(err => console.error('Lỗi khi lấy danh sách bài hát:', err));

        axios.get('http://18.142.50.220:8000/api/songs/')
            .then(res => setSongs(res.data))
            .catch(err => console.error("Lỗi khi lấy bài hát", err));
        }, []);
    
    if (artists.length === 0) return <p>Đang tải danh sách bài hát...</p>;

    const {id} = useParams<{id : string}>();
    const artistIndex = Number(id);
    const Artist_item = artists[artistIndex - 1];
    console.log(Artist_item);
    console.log(songs);

    const getSongsByArtist = (Artist:Artist) => {
        return songs.filter(song =>
            song.participants.some(participant =>
                participant.artist === Artist.id || participant.artist_name.includes(Artist.name)
            )
        );
    };

    const artistSongs = getSongsByArtist(Artist_item);

    const pictute = `http://18.142.50.220/msa/artist/${Artist_item.profile_picture}`;

    return (<>
        <Navbar />
        <div className="flex bg-black h-[80%] overflow-hidden">
            <Sidebar />
            <div className="bg-gray-800 h-[calc(100vh-23vh)] w-full m-2 rounded-2xl overflow-y-scroll">
                <div className="mt-10 flex gap-8 flex-col md:flex-row md:item-end ml-8 mr-8">
                    <img className="w-48 rounded" src={pictute} alt="" />
                    <div className="flex flex-col">
                        <p>Playlist</p>
                        <h2 className="text-5xl font-bold mb-4 md:text-7x1">{Artist_item.name}</h2>
                        <h4>hehehehe</h4>
                    </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-8 text-[#a7a7a7]">
                    <p><b className='mr-4'>#</b>Title</p>
                    <p>Album</p>
                    <p className='hidden sm:block'>Date Added</p>
                    <img className='m-auto w-4' src={clock_icon} alt="" />
                </div>
                
                <div className="text-white">                    
                    <div key={Artist_item.id} className="mb-6">
                    {artistSongs.length > 0 ? (
                        <div className="list-disc">
                        {artistSongs.map((song,index) => {
                            const picture_song = `http://18.142.50.220/msa/track_img/${song.image}`;
                            return(
                                <div key={index} className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-8 text-[#a7a7a7]"
                                    onClick={() => navigate(`/song/${song.id}`)}>
                                    <p className='flex gap-2'>
                                        <b>{index + 1}</b>
                                        <img className="w-10" src={picture_song} alt="" />
                                        {song.title}
                                    </p>
                                    <p>{song.album}</p>
                                    <p>5 ngày trước</p>
                                    <p>{song.duration}</p>
                                </div>
                            )
                            
                        })}
                        </div>
                    ) : (
                        <p>Không có bài hát nào.</p>
                    )}
                    </div>
                </div>

                <div className="m-8 text-white">
                    <h1>Giới thiệu</h1>
                    <p className="ml-5">{Artist_item.biography}</p>
                </div>
                <div className="mt-5">
                    <Footer />
                </div>
            </div>
        </div>
        
        <Player />
        
        <audio ref={audioRef} src="" preload='auto'></audio>
    </>)
     
}
export default Individual_artist;