import Footer from './Footer.tsx';
import Song_item from '../components/song_item.tsx'
import Artist_item from '../components/artist_item.tsx'
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import {Artist} from '../models/artist';
import {Song} from '../models/song';


const Content = () => {
    const navigate = useNavigate();
    const [artists, setArtists] = useState<Artist[]>([]);
    const [songs, setSongs] = useState<Song[]>([]);

    useEffect(() => {
        axios.get('http://18.142.50.220:8000/api/artists/')
            .then(res => setArtists(res.data))
            .catch(err => console.error('Lỗi khi lấy danh sách bài hát:', err));

        axios.get('http://18.142.50.220:8000/api/songs/')
            .then(res => setSongs(res.data))
            .catch(err => console.error("Lỗi khi lấy bài hát", err));
    }, []);
    
    if (artists.length === 0) return <p>Đang tải danh sách bài hát...</p>;

    return (
        <>
            <div className="bg-gray-800 h-[calc(100vh-23vh)] w-full m-2 rounded-2xl overflow-y-scroll">                
                <div className="p-6 text-white"> 
                    <div className="flex justify-between mb-3">
                        <h2 className="text-2xl font-bold">Nghệ sĩ phổ biến</h2>
                        <p className="mt-1" onClick={() => navigate("/artist")}>Xem tất cả</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {artists.slice(0, 5).map((artist, index) => {
                            const profilePictureUrl = `http://18.142.50.220/msa/artist/${artist.profile_picture}`;
                            return (
                                <Artist_item 
                                    key={index} 
                                    id={artist.id} 
                                    name={artist.name} 
                                    profile_picture={profilePictureUrl} 
                                    biography={artist.biography} 
                                    followers_count={artist.followers_count} 
                                />
                            );
                        })}
                    </div>
                </div>
                
                <div className="p-6 text-white"> 
                    <div className="flex justify-between mb-3">
                        <h2 className="text-2xl font-bold">Nhạc thịnh hành hiện nay</h2>
                        <p className="mt-1" onClick={() => navigate("/artist")}>Xem tất cả</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {songs.slice(0, 5).map((song, index) => {
                            const PictureSongUrl = `http://18.142.50.220/msa/track_img/${song.image}`;
                            return (
                                <Song_item 
                                    key={index} 
                                    id={song.id} 
                                    title={song.title} 
                                    duration={song.duration}
                                    genre={song.genre}
                                    audio_file={song.audio_file}
                                    image={PictureSongUrl} 
                                    album={song.album} 
                                    participants={song.participants}
                                    interactions={song.interactions}
                                />
                            );
                        })}
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Content;
