import { useEffect, useState } from 'react';
import Navbar from '../layouts/Navbar.tsx';
import Player from '../layouts/Player.tsx';
import Sidebar from '../layouts/Sidebar.tsx';

function Video() {
    const [currentSong, setCurrentSong] = useState<any>(null);

    useEffect(() => {
        const songData = localStorage.getItem('currentSong');
        if (songData) {
            const song = JSON.parse(songData);
            if (!song.video_file) {
                song.video_file = null; 
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
                    </div>
                </div>
                <Player />
            </>
        );
    }

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
                        <div className="flex justify-center items-center">
                            <div className="w-[72%] aspect-video ">
                                {currentSong.video_file ? (
                                    <video
                                        width="100%"
                                        height="100%"
                                        controls
                                        className="rounded-lg"
                                        src={`http://13.215.205.59/msa/track_video/${currentSong.video_file}`}
                                    >
                                        Trình duyệt của bạn không hỗ trợ video.
                                    </video>
                                ) : (
                                    <div className="text-center text-gray-400">Không tìm thấy file video cho bài hát này.</div>
                                )}
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
        </>
    );
}

export default Video; 