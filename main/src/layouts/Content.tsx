import { useState } from "react";
import Footer from './Footer.tsx';
import Artist from '../components/com_artist.tsx'
import Song from '../components/com_song.tsx'


const Content = () => {
    // const [view, setView] = useState<"song" | "playlist" | "artist">("artist");
    return (
        <>
            <div className="bg-gray-800 h-[calc(100vh-100px)] w-full m-2 rounded-2xl overflow-y-scroll">                
                {/* {view === "song" && <Song onChangeView={setView} />}
                {view === "artist" && <Artist onChangeView={setView} />}
                {view === "playlist" && <Playlist onChangeView={setView} />} */}
                <Artist/>
                <Song />
                <Footer />
            </div>
        </>
    );
};

export default Content;
