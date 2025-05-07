import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import img1 from '../assets/image/img1.jpg';
import img10 from '../assets/image/img10.jpg';
import img2 from '../assets/image/img2.jpg';
import img3 from '../assets/image/img3.jpg';
import img4 from '../assets/image/img4.jpg';
import img5 from '../assets/image/img5.jpg';
import img6 from '../assets/image/img6.jpg';
import img7 from '../assets/image/img7.jpg';
import img8 from '../assets/image/img8.jpg';
import img9 from '../assets/image/img9.jpg';
import Footer from '../layouts/Footer.tsx';
import Navbar from '../layouts/Navbar.tsx';
import Player from '../layouts/Player.tsx';
import Sidebar from '../layouts/Sidebar.tsx';
import { Artist } from '../models/artist';

const defaultImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

function Artists (){

    const navigate = useNavigate();
    const [artists, setArtists] = useState<Artist[]>([]);

    useEffect(() => {
        axios.get('http://13.215.205.59:8000/api/artists/')
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
                            let profilePictureUrl = '';
                            if (artist.profile_picture && artist.profile_picture !== "null" && artist.profile_picture !== "") {
                                profilePictureUrl = `http://13.215.205.59/msa/artist/${artist.profile_picture}`;
                            } else {
                                profilePictureUrl = defaultImages[index % defaultImages.length];
                            }
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