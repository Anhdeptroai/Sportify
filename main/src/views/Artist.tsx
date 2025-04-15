import Sidebar from '../layouts/Sidebar.tsx';
import Footer from '../layouts/Footer.tsx';
import Navbar from '../layouts/Navbar.tsx';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {Artist} from '../models/artist';
import Player from '../layouts/Player.tsx';
import { FaPlay } from "react-icons/fa";



function Artists (){

    const navigate = useNavigate();
    const [artists, setArtists] = useState<Artist[]>([]);

    useEffect(() => {
        axios.get('http://18.142.50.220:8000/api/artists/')
          .then(res => setArtists(res.data))
          .catch(err => console.error('Lỗi khi lấy danh sách bài hát:', err));
      }, []);
    
      if (artists.length === 0) return <p>Đang tải danh sách bài hát...</p>;

    return (<>
        <Navbar />
        <div className="flex bg-black h-[80%] overflow-hidden">
            <Sidebar />
            <>
            <div className="bg-gray-800 h-[calc(100vh-23vh)] w-full m-2 rounded-2xl overflow-y-scroll">                
                <div className="p-6 text-white"> 
                    <div className="flex justify-between mb-3">
                        <h2 className="text-2xl font-bold">Nghệ sĩ phổ biến</h2>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {artists.map((artist, index) => {
                            const profilePictureUrl = `http://18.142.50.220/msa/artist/${artist.profile_picture}`;
                            return(
                                <div key={artist.id} className="bg-gray-800 items-center rounded-lg justify-center hover:bg-gray-700 p-4" 
                                onClick={() => navigate(`/artist/${artist.id}`)}>
                                    <div className="relative w-34 h-34">
                                        <img src={profilePictureUrl} alt={artist.name} className="w-34 h-34 object-cover rounded-full block mx-auto"/>
                                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full">
                                            <FaPlay className="text-white text-3xl" />
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <p>{artist.name}</p>
                                        <p>Nghệ sĩ</p>
                                    </div>                          
                                </div>       
                            )
                                               
                        })}
                    </div>
                </div>
                <Footer />
            </div>
        </>
        </div>
        <Player />
    </>)
     
}
export default Artists;