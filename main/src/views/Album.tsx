import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import imgDefault from '../assets/image/img1.jpg';
import Footer from '../layouts/Footer.tsx';
import Navbar from '../layouts/Navbar.tsx';
import Player from '../layouts/Player.tsx';
import Sidebar from '../layouts/Sidebar.tsx';
import type { Album } from '../models/album.tsx';
import type { Song } from '../models/song.tsx';

function Album (){
    const navigate = useNavigate();
    const [albums, setAlbums] = useState<Album[]>([]);
    const [songs, setSongs] = useState<Song[]>([]);

    useEffect(() => {
        axios.get('http://18.142.50.220:8000/api/albums/')
            .then(res => setAlbums(res.data))
            .catch(err => console.error('Lỗi khi lấy danh sách album:', err));
        axios.get('http://18.142.50.220:8000/api/songs/')
            .then(res => setSongs(res.data))
            .catch(err => console.error('Lỗi khi lấy danh sách bài hát:', err));
    }, []);
    
    if (albums.length === 0) return <p>Đang tải danh sách album...</p>;

    return (<>
        <Navbar />
        <div className="flex bg-black h-[80%] overflow-hidden">
            <Sidebar />
            <div className="bg-gray-800 h-[calc(100vh-23vh)] w-full m-2 rounded-2xl overflow-y-scroll">                
                <div className="p-6 text-white"> 
                    <div className="flex justify-between mb-3">
                        <h2 className="text-2xl font-bold">Nghệ sĩ phổ biến</h2>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {albums.map((album) => {
                            // Tìm bài hát đầu tiên thuộc album này
                            const firstSong = songs.find(song => song.album === album.id);
                            const albumImg = firstSong && firstSong.image
                                ? `http://18.142.50.220/msa/track_img/${firstSong.image}`
                                : imgDefault;
                            return(
                                <div key={album.id} className="bg-gray-800 items-center rounded-lg justify-center hover:bg-gray-700 p-4" 
                                onClick={() => navigate(`/album/${album.id}`)}>
                                    <div className="relative w-34 h-34">
                                        <img src={albumImg} alt="Không có hình" className="w-34 h-34 object-cover rounded-full block mx-auto"/>
                                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full">
                                            <FaPlay className="text-white text-3xl" />
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <p>{album.title}</p>
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
export default Album;