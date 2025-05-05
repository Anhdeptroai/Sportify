import { useContext, useRef } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlayerContext } from '../controllers/context.tsx';
import Album from '../views/Album.tsx';
import Artist from '../views/Artist.tsx';
import Detailed_album from "../views/Detailed_album.tsx";
import Home from '../views/Home.tsx';
import Individual_artist from '../views/Individual_artist.tsx';
import Login from '../views/Login.tsx';
import Playlist from '../views/Playlist.tsx';
import Register from '../views/Register.tsx';
import Song_now from "../views/Song_now.tsx";

const AppRoutes = () => {

    const displayRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    console.log(location);
    const isLogin = location.pathname.includes("login");
    console.log(isLogin);
    const { audioRef, track } = useContext(PlayerContext);
    if (!track) return null; 
    const song = `http://18.142.50.220/msa/track/${track.audio_file}`;

    return(
        <div ref={displayRef}>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/artist" element={<Artist />} />
                <Route path="/artist/:id" element={<Individual_artist />} />
                <Route path="/song/:id" element={<Song_now />} />
                <Route path="/album" element={<Album />} />
                <Route path="/album/:id" element={<Detailed_album />} />
                <Route path="/playlist" element={<Playlist />} />
                <Route path="/playlist/:id" element={<Playlist />} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
            <audio ref={audioRef} src={song} preload='auto'></audio>
        </div>
    )
}

export default AppRoutes
