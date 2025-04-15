import React from 'react';
import {Artist} from '../models/artist';
import { Link, useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

const Artist_item = ({id, name, profile_picture, biography, followers_count}:Artist) => {

    const navigate = useNavigate();

    return (
        <div key={id} className="bg-gray-800 items-center rounded-lg justify-center hover:bg-gray-700 p-4" 
            onClick={() => navigate(`/artist/${id}`)}>
            <div className="relative w-34 h-34">
                <img src={profile_picture} alt={name} className="w-34 h-34 object-cover rounded-full block mx-auto"/>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full">
                    <FaPlay className="text-white text-3xl" />
                </div>
            </div>
            <div className="mt-2">
                <p>{name}</p>
                <p>Nghệ sĩ</p>
            </div>                          
        </div>
    )
}

export default Artist_item