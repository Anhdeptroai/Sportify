import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaTimes, FaHome, FaDownload } from "react-icons/fa";
import { useState } from "react";

const Navbar = () =>{
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    return <div className="flex item-center h-18 bg-black text-white">

        <button className="fab fa-spotify  text-3xl ml-5" onClick={() => navigate("/")}></button>
        <button className="fas fa-house-chimney text-2xl ml-5" onClick={() => navigate("/")}></button>

        {/* Thanh Search */}
        <div className="flex items-center bg-gray-900 rounded-full h-10 w-100 flex mt-4 ml-5 pl-5 hover:bg-gray-700 hover:text-white-200">
                <FaSearch className="text-gray-400" />
                <input
                    type="text"
                    className="bg-transparent outline-none px-2 text-white w-full"
                    placeholder="Tìm kiếm bài hát, nghệ sĩ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                    <button onClick={() => setSearch("")} className="text-gray-400 pr-5">
                        <FaTimes />
                    </button>
                )}
            </div>

            {/* Nút đăng ký / đăng nhập */}
            <div className="mt-5 ml-100 text-1xl ">
                <button className="h-8 w-30 bg-white text-black font-bold rounded-3xl"
                        onClick={() => navigate("/register")}>
                    Đăng Ký
                </button>
                <button className="h-8 w-30 bg-white text-black ml-2 font-bold rounded-3xl"
                        onClick={() => navigate("/login")}>
                    Đăng nhập
                </button>
            </div>        
        </div>
}
export default Navbar