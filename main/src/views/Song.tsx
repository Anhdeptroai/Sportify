import Sidebar from '../layouts/Sidebar.tsx';
import Footer from '../layouts/Footer.tsx';
import Navbar from '../layouts/Navbar.tsx';
import Player from '../layouts/Player.tsx';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {Artist} from '../models/artist.tsx';
import {Song} from '../models/song.tsx';
import clock_icon from '../assets/image/clock_icon.png';
import { PlayerContext} from '../models/context.tsx';

const Song_now = () => {

    // const {audioRef, track} = useContext(PlayerContext);

    const navigate = useNavigate();
    const [songs, setSongs] = useState<Song[]>([]);
    const { audioRef } = useContext(PlayerContext);

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

    const track = `http://18.142.50.220/msa/track/${Song_item.audio_file}`;
    const image = `http://18.142.50.220/msa/track_img/${Song_item.image}`;

    return (<>
        <Navbar />
        <div className="flex bg-black h-[80%] overflow-hidden">
            <Sidebar />
            <div className="bg-gray-800 h-[calc(100vh-23vh)] w-full m-2 rounded-2xl overflow-y-scroll">
                <div className="mt-10 flex gap-8 flex-col md:flex-row md:item-end ml-8 mr-8">
                    <img className="w-48 rounded" src={image} alt="" />
                    <div className="flex flex-col">
                        <p>Playlist</p>
                        <h2 className="text-5xl font-bold mb-4 md:text-7x1">{Song_item.title}</h2>
                        <h4>hehehehe</h4>
                    </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-8 text-[#a7a7a7]">
                    <p><b className='mr-4'>#</b>Title</p>
                    <p>Album</p>
                    <p className='hidden sm:block'>Date Added</p>
                    <img className='m-auto w-4' src={clock_icon} alt="" />
                </div>

                <div className="mt-5">
                    <Footer />
                </div>
            </div>
        </div>
        
        <Player />
        
        <audio ref={audioRef} src={track} preload='auto'></audio>
    </>)
     
}
export default Song_now;