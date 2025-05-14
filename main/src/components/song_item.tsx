import { useContext } from 'react';
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from '../controllers/context';
import { Song } from '../models/song';

// Accept onClick as an optional prop
interface SongItemProps extends Song {
    onClick?: () => void;
}

const Song_item = ({id, title, duration, genre, audio_file, video_file, image, album, participants, interactions, onClick }: SongItemProps) => {

    const navigate = useNavigate();
    const {playWithId} = useContext(PlayerContext);

    const handleClick = () => {
        if (onClick) onClick();
        navigate(`/song/${id}`);
    };

    return (
        <div key={id} className="bg-gray-800 items-center rounded-lg justify-center hover:bg-gray-700 p-4" 
            onClick={handleClick}
        >
            <div className="relative w-34 h-34">
                <img src={image} alt={title} className="w-34 h-34 object-cover rounded-full block mx-auto"/>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full">
                    <FaPlay className="text-white text-3xl" />
                </div>
            </div>
            <div className="mt-2">
                <p>{title}</p>
                <p>{participants?.map(p => p.artist_name).join(', ')}</p>
            </div>                          
        </div>
    )
}

export default Song_item