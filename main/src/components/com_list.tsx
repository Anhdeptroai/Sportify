import { FaPlay } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { HiOutlinePlus } from "react-icons/hi";

// const Playlist = ({ onChangeView }: { onChangeView: (view: "song" | "playlist" | "artist") => void }) => {
const Playlist = () => {
  return (
    <div className="bg-gradient-to-b from-pink-300 to-gray-900 text-white p-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-6">
        <img
          src="/playlist-cover.jpg"
          alt="Playlist Cover"
          className="w-44 h-44 rounded-lg shadow-md"
        />
        <div>
          <p className="text-sm uppercase font-semibold">Playlist</p>
          <h1 className="text-4xl font-bold">New Music Friday Vietnam</h1>
          <p className="text-gray-300 text-sm mt-2">
            Những chiếc nhạc mới trong tuần từ Selena Gomez, YOASOBI và NMIXX
          </p>
          <p className="text-sm text-gray-400 mt-2">
            <span className="font-bold text-white">Spotify</span> • 22.912 lượt lưu • 77 bài hát, khoảng 4 giờ 15 phút
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-6">
        <button className="bg-green-500 text-black p-4 rounded-full hover:bg-green-400">
          <FaPlay size={24} />
        </button>
        <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700">
          <HiOutlinePlus size={24} />
        </button>
        <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700">
          <FiMoreHorizontal size={24} />
        </button>
      </div>

      {/* Song List */}
      <div className="mt-6">
        <div className="flex justify-between text-gray-400 pb-2 border-b border-gray-700">
          <p>#</p>
          <p>Tiêu đề</p>
          <p>Album</p>
          <p>Ngày thêm</p>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-center py-2 hover:bg-gray-800 px-2 rounded-md cursor-pointer">
            <p>1</p>
            <p className="flex items-center gap-2">
              <img src="/song1.jpg" alt="Mona Lisa" className="w-10 h-10 rounded" />
              MONA LISA - j-hope
            </p>
            <p>MONA LISA</p>
            <p>3 ngày trước</p>
            <p>2:17</p>
          </div>
          <div className="flex justify-between items-center py-2 hover:bg-gray-800 px-2 rounded-md cursor-pointer">
            <p>2</p>
            <p className="flex items-center gap-2">
              <img src="/song2.jpg" alt="Younger And Hotter Than Me" className="w-10 h-10 rounded" />
              Younger And Hotter Than Me - Selena Gomez
            </p>
            <p>I Said I Love You First</p>
            <p>3 ngày trước</p>
            <p>3:09</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
