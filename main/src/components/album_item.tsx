import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react'
import { Album } from '../models/album';
import {PlayerContext} from '../controllers/context'

const Album_item = ({id, title, songs, description, creation_date, publish_date, artist }: Album) => {

    const navigate = useNavigate();
    const {playWithId} = useContext(PlayerContext);

    return (
        <div key={id} className="bg-gray-800 items-center rounded-lg justify-center hover:bg-gray-700 p-4" 
            onClick={() => {navigate(`/album/${id}`); 
                            playWithId(id-2);}}>
            <div className="relative w-34 h-34">
                <img src="" alt={title} className="w-34 h-34 object-cover rounded-full block mx-auto"/>
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