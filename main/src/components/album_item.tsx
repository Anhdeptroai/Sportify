import { useContext } from 'react';
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import imgDefault from '../assets/image/img1.jpg';
import { PlayerContext } from '../controllers/context';
import { Album } from '../models/album';

const Album_item = ({id, title, songs, description, creation_date, publish_date, artist }: Album) => {

    const navigate = useNavigate();
    const {playWithId} = useContext(PlayerContext);
    // Lấy ảnh bài hát đầu tiên nếu có
    const albumImg = songs && songs.length > 0 && songs[0].image
        ? `http://13.215.205.59/msa/track_img/${songs[0].image}`
        : imgDefault;

    return (
        <div key={id} className="bg-gray-800 items-center rounded-lg justify-center hover:bg-gray-700 p-4" 
            onClick={() => {navigate(`/album/${id}`); 
                            playWithId(id-2);}}>
            <div className="relative w-34 h-34">
                <img src={albumImg} alt={title} className="w-34 h-34 object-cover rounded-full block mx-auto"/>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full">
                    <FaPlay className="text-white text-3xl" />
                </div>
            </div>
            <div className="mt-2">
                <p>{title}</p>
            </div>                          
        </div>
    )
}

export default Album_item