import ar1 from '../assets/image/ar1.jpg'
import { FaPlay } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const artists = [
  { name: "Dương Domic", img: ar1 },
  { name: "Sơn Tùng M-TP", img: "/artist2.jpg" },
  { name: "HIEUTHUHAI", img: "/artist3.jpg" },
  { name: "ERIK", img: "/artist4.jpg" },
  { name: 'ANH TRAI "SAY HI"', img: "/artist5.jpg" },
  { name: 'ANH TRAI "SAY HI"', img: "/artist5.jpg" },
];

// const Artist = ({ onChangeView }: { onChangeView: (view: "song" | "playlist" | "artist") => void }) => {
const com_Artist = () => {
    const navigate = useNavigate();

    return(
      <>
          <div className="p-6 text-white"> 
              <div className="flex justify-between mb-3">
                  <h2 className="text-2xl font-bold">Nghệ sĩ phổ biến</h2>
                  <p className="mt-1" onClick={() => navigate("/artist")}>Xem tất cả</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {artists.slice(0,5).map((artist, index) => (
                      <div key={index} className="bg-gray-800 items-center rounded-lg justify-center hover:bg-gray-700 p-4" onClick={() => navigate("/album")}>               
                            <div className="relative w-34 h-34">
                                <img src={artist.img} alt={artist.name} className="w-34 h-34 object-cover rounded-full block mx-auto"/>
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 rounded-full">
                                    <FaPlay className="text-white text-3xl" />
                                </div>
                            </div>
                            <div className="mt-2">
                                <p>{artist.name}</p>
                                <p>Nghệ sĩ</p>
                            </div>                          
                      </div>
                  ))}
              </div>
          </div>
      </>
    ) 
}

export default com_Artist;