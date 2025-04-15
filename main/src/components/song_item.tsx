import React, { useContext } from 'react';
import {Song} from '../models/song';
import { Link, useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { PlayerContext } from '../models/context';

const Song_item = ({id, title, duration, genre, audio_file, image, album, participants, interactions }: Song) => {

    const navigate = useNavigate();
    // const {playWithId} = useContext(PlayerContext)

    return (
        <div key={id} className="bg-gray-800 items-center rounded-lg justify-center hover:bg-gray-700 p-4" 
            onClick={() => navigate(`/song/${id}`)}>
            {/* onClick={() => playWithId(id)}> */}
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