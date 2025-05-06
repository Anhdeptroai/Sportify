import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Footer from '../layouts/Footer.tsx';
import Navbar from '../layouts/Navbar.tsx';
import Player from '../layouts/Player.tsx';
import Sidebar from '../layouts/Sidebar.tsx';

function Video() {
    const navigate = useNavigate();
    const [currentSong, setCurrentSong] = useState<any>(null);

    useEffect(() => {
        // Lấy thông tin bài hát hiện tại từ localStorage
        const songData = localStorage.getItem('currentSong');
        if (songData) {
            const song = JSON.parse(songData);
            // Thêm video_id mặc định nếu chưa có
            if (!song.video_id) {
                song.video_id = 'GMyF41IxReo'; // Video ID mặc định
            }
            setCurrentSong(song);
        }
    }, []);

    if (!currentSong) {
        return (
            <>
                <Navbar />
                <div className="flex bg-black h-[80%] overflow-hidden">
                    <Sidebar />
                    <div className="bg-gray-800 h-[calc(100vh-23vh)] w-full m-2 rounded-2xl overflow-y-scroll">                
                        <div className="p-6 text-white"> 
                            <div className="flex justify-between mb-3">
                                <h2 className="text-2xl font-bold">Video đang phát</h2>
                            </div>
                            <p className="text-center text-gray-400">Không có video để phát...</p>
                        </div>
                        <Footer />
                    </div>
                </div>
                <Player />
            </>
        );
    }

    return (<>
        <Navbar />
        <div className="flex bg-black h-[80%] overflow-hidden">
            <Sidebar />
            <div className="bg-gray-800 h-[calc(100vh-23vh)] w-full m-2 rounded-2xl overflow-y-scroll">                
                <div className="p-6 text-white"> 
                    <div className="flex justify-between mb-3">
                        <h2 className="text-2xl font-bold">Video đang phát</h2>
                    </div>
                    
                    
                    <div className="flex justify-center items-center">
                        <div className="w-[72%] aspect-video ">
                            <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${currentSong.video_id}`}
                            title={currentSong.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg"
                            ></iframe>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-xl font-semibold">{currentSong.title}</h3>
                        <p className="text-gray-400">
                            {currentSong.participants?.map((p: { artist_name: string }) => p.artist_name).join(', ')}
                        </p>
                    </div>
                </div>
                
            </div>
        </div>
        <Player />
    </>)
}

export default Video; 