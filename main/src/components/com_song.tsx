import { FaPlay } from "react-icons/fa";
import ar1 from '../assets/image/ar1.jpg'

const songs = [
    { title: "Lạc Trôi", artist: "Sơn Tùng M-TP", img: ar1 },
    { title: "Chạy Ngay Đi", artist: "Sơn Tùng M-TP", img: "/song2.jpg" },
    { title: "See Tình", artist: "Hoàng Thùy Linh", img: "/song3.jpg" },
    { title: "Em Là", artist: "Mono", img: "/song4.jpg" },
    { title: "Anh Đã Quen Với Cô Đơn", artist: "Soobin Hoàng Sơn", img: "/song5.jpg" },
];

// const Song = ({ onChangeView }: { onChangeView: (view: "song" | "playlist" | "artist") => void }) => {
const com_Song = () => {
    return(
    <>
        <div className="p-6 text-white"> 
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Những bài hát thịnh hành</h2>
                <p className="mt-1">Xem tất cả</p>
            </div>              
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {songs.map((song, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700">                       
                        <div className="relative w-34 h-34">
                            <img src={song.img} alt={song.title} className="w-34 h-34 object-cover block mx-auto"/>
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full">
                                <FaPlay className="text-white text-3xl" />
                            </div>
                        </div>
                        
                        <div className="mt-2">
                            <h3 className="text-lg font-semibold">{song.title}</h3>
                            <p className="text-sm text-gray-400">{song.artist}</p>
                        </div>
                        
                        {/* <p onClick={() => onChangeView("playlist")} className="text-sm text-gray-400">{song.artist}</p> */}
                    </div>
                ))}
            </div>
        </div>
    </>        
    )
    
}

export default com_Song;