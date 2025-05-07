import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import imgDefault from '../assets/image/img1.jpg';
import { PlayerContext } from '../controllers/context.tsx';
import Footer from '../layouts/Footer.tsx';
import Navbar from '../layouts/Navbar.tsx';
import Player from '../layouts/Player.tsx';
import Sidebar from '../layouts/Sidebar.tsx';
import type { Song } from '../models/song.tsx';

function List_Song (){
    const navigate = useNavigate();
    const [songs, setSongs] = useState<Song[]>([]);
    const {playWithId} = useContext(PlayerContext);

    useEffect(() => {
        axios.get('http://13.215.205.59:8000/api/songs/')
            .then(res => setSongs(res.data))
            .catch(err => console.error('Lỗi khi lấy danh sách bài hát:', err));
    }, []);
    
    if (songs.length === 0) return <p>Đang tải danh sách bài hát...</p>;

    return (<>
        <Navbar />
        <div className="flex bg-black h-[80%] overflow-hidden">
            <Sidebar />
            <div className="bg-gray-800 h-[calc(100vh-23vh)] w-full m-2 rounded-2xl overflow-y-scroll">                
                <div className="p-6 text-white"> 
                    <div className="flex justify-between mb-3">
                        <h2 className="text-2xl font-bold">Tất cả bài hát</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {songs.map((song) => {
                            const songImg = song.image
                                ? `http://13.215.205.59/msa/track_img/${song.image}`
                                : imgDefault;
                            return(
                                <div key={song.id} className="bg-gray-800 items-center rounded-lg justify-center hover:bg-gray-700 p-4" 
                                onClick={() => {navigate(`/song/${song.id}`); playWithId(song.id);}}>
                                    <div className="relative w-34 h-34">
                                        <img src={songImg} alt="Không có hình" className="w-34 h-34 object-cover rounded-full block mx-auto"/>
                                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full">
                                            <FaPlay className="text-white text-3xl" />
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <p>{song.title}</p>
                                        <p className="text-gray-400 text-sm">{song.participants?.map((p: { artist_name: string }) => p.artist_name).join(', ')}</p>
                                    </div>                          
                                </div>       
                            )
                        })}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
        <Player />
    </>)
}
export default List_Song; 