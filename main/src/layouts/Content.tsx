import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Album_item from '../components/album_item.tsx';
import Artist_item from '../components/artist_item.tsx';
import Song_item from '../components/song_item.tsx';
import { PlayerContext } from '../controllers/context';
import { Album } from '../models/album.tsx';
import { Artist } from '../models/artist.tsx';
import { Song } from '../models/song.tsx';
import Footer from './Footer.tsx';


const Content = () => {
    const navigate = useNavigate();
    const [artists, setArtists] = useState<Artist[]>([]);
    const [songs, setSongs] = useState<Song[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const { playWithId } = useContext(PlayerContext);

    useEffect(() => {
        axios.get('http://13.215.205.59:8000/api/artists/')
            .then(res => setArtists(res.data))
            .catch(err => console.error('Lỗi khi lấy danh sách nghệ sĩ:', err));

        axios.get('http://13.215.205.59:8000/api/songs/')
            .then(res => setSongs(res.data))
            .catch(err => console.error("Lỗi khi lấy bài hát", err));

        axios.get('http://13.215.205.59:8000/api/albums/')
            .then(res => setAlbums(res.data))
            .catch(err => console.error("Lỗi khi lấy album", err));
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
                            const profilePictureUrl = `http://13.215.205.59/msa/artist/${artist.profile_picture}`;
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
                        <h2 className="text-2xl font-bold">Album phổ biến hiện nay</h2>
                        <p className="mt-1" onClick={() => navigate("/album")}>Xem tất cả</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {albums.slice(0, 5).map((album, index) => {
                            return (
                                <Album_item 
                                    key={index} 
                                    id={album.id} 
                                    title={album.title} 
                                    description={album.description}
                                    creation_date={album.creation_date}
                                    publish_date={album.publish_date}
                                    artist={album.artist}
                                    songs={album.songs}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="p-6 text-white"> 
                    <div className="flex justify-between mb-3">
                        <h2 className="text-2xl font-bold">Nhạc thịnh hành hiện nay</h2>
                        <p className="mt-1" onClick={() => navigate("/list_song")}>Xem tất cả</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {songs.slice(0, 5).map((song, index) => {
                            const PictureSongUrl = `http://13.215.205.59/msa/track_img/${song.image}`;
                            return (
                                <Song_item 
                                    key={index} 
                                    id={song.id} 
                                    title={song.title} 
                                    duration={song.duration}
                                    genre={song.genre}
                                    audio_file={song.audio_file}
                                    video_file={song.video_file}
                                    image={PictureSongUrl} 
                                    album={song.album} 
                                    participants={song.participants}
                                    interactions={song.interactions}
                                    onClick={() => playWithId(song.id)}
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
