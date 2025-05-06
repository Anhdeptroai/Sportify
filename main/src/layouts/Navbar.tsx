import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaKey, FaSearch, FaSignOutAlt, FaTimes, FaUser, FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

const Navbar = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<{artists: any[], songs: any[]}>({artists: [], songs: []});
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const token = localStorage.getItem('token');
        return !!token;
    });
    const [userName, setUserName] = useState(() => localStorage.getItem('userName') || "");
    const [showDropdown, setShowDropdown] = useState(false);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    // Lấy thông tin user từ API
    const fetchUserName = async (userId: number, token: string) => {
        try {
            const res = await axios.get(`http://18.142.50.220:8000/api/users/${userId}/`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const { first_name, last_name } = res.data;
            const fullName = `${first_name} ${last_name}`.trim();
            setUserName(fullName);
            localStorage.setItem('userName', fullName);
            setIsLoggedIn(true);
        } catch (err) {
            console.error("Lỗi khi lấy thông tin user:", err);
            handleLogout();
        }
    };

    // Kiểm tra đăng nhập và lấy tên user
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (!token) {
                handleLogout();
                return;
            }

            try {
                const payload = parseJwt(token);
                if (!payload || !payload.user_id) {
                    throw new Error('Invalid token');
                }
                fetchUserName(payload.user_id, token);
            } catch (err) {
                console.error("Lỗi khi xử lý token:", err);
                handleLogout();
            }
        };

        checkAuth();
        // Kiểm tra token mỗi 5 phút
        const interval = setInterval(checkAuth, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        setIsLoggedIn(false);
        setUserName("");
        setShowDropdown(false);
        navigate('/login');
    };

    useEffect(() => {
        if (search.trim() === '') {
            setResults({artists: [], songs: []});
            setShowDropdown(false);
            return;
        }
        // Gọi API tìm kiếm nghệ sĩ và bài hát
        const fetchResults = async () => {
            try {
                const [artistRes, songRes] = await Promise.all([
                    axios.get(`http://18.142.50.220:8000/api/artists/?search=${search}`),
                    axios.get(`http://18.142.50.220:8000/api/songs/?search=${search}`)
                ]);
                setResults({
                    artists: artistRes.data,
                    songs: songRes.data
                });
                setShowDropdown(true);
            } catch (err) {
                setResults({artists: [], songs: []});
                setShowDropdown(false);
            }
        };
        fetchResults();
    }, [search]);

    const handleSelect = (type: 'artist' | 'song', id: number) => {
        setShowDropdown(false);
        setSearch('');
        if (type === 'artist') {
            navigate(`/artist/${id}`);
        } else {
            navigate(`/song/${id}`);
        }
    };

    return (
        <div className="flex items-center justify-between h-[54px] bg-black text-white px-4 w-full relative">
            <div className="flex items-center gap-2">
                <button className="fab fa-spotify text-3xl" onClick={() => navigate("/")}></button>
                <button className="fas fa-house-chimney text-2xl ml-2" onClick={() => navigate("/")}></button>
            </div>

            {/* Search Bar */}
            <form onSubmit={(e) => { e.preventDefault(); }} className="flex-1 max-w-2xl mx-8 relative">
                <div className="flex items-center bg-gray-900 rounded-full h-10 hover:bg-gray-700 relative">
                    <FaSearch className="text-gray-400 ml-4" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        className="bg-transparent outline-none px-4 text-white w-full"
                        placeholder="Tìm kiếm bài hát, nghệ sĩ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => { if (results.artists.length || results.songs.length) setShowDropdown(true); }}
                        onBlur={() => setShowDropdown(false)}
                    />
                    {search && (
                        <button type="button" onClick={() => setSearch("")} className="text-gray-400 mr-4">
                            <FaTimes />
                        </button>
                    )}
                    {/* Dropdown search results */}
                    {showDropdown && (results.artists.length > 0 || results.songs.length > 0) && (
                        <div
                            className="absolute left-0 top-12 w-full bg-white text-black rounded shadow z-50 max-h-60 overflow-y-auto border border-gray-200"
                            style={{ minWidth: '250px' }}
                        >
                            {results.artists.length > 0 && (
                                <div>
                                    <div className="px-4 py-2 font-bold border-b">Nghệ sĩ</div>
                                    {results.artists.map(artist => (
                                        <div
                                            key={`artist-${artist.id}`}
                                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                            onMouseDown={() => handleSelect('artist', artist.id)}
                                        >
                                            {artist.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {results.songs.length > 0 && (
                                <div>
                                    <div className="px-4 py-2 font-bold border-b">Bài hát</div>
                                    {results.songs.map(song => (
                                        <div
                                            key={`song-${song.id}`}
                                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                            onMouseDown={() => handleSelect('song', song.id)}
                                        >
                                            {song.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </form>

            {/* Authentication Buttons / User Menu */}
            <div className="flex items-center">
                {!isLoggedIn ? (
                    <div className="flex gap-2">
                        <button 
                            className="h-8 bg-white text-black font-bold rounded-3xl px-4"
                            onClick={() => navigate("/register")}
                        >
                            Đăng Ký
                        </button>
                        <button 
                            className="h-8 bg-white text-black font-bold rounded-3xl px-4"
                            onClick={() => navigate("/login")}
                        >
                            Đăng nhập
                        </button>
                    </div>
                ) : (
                    <div className="relative">
                        <button 
                            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <FaUser className="text-xl" />
                            <span className="font-medium">{userName}</span>
                        </button>
                        
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                                <button 
                                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-700"
                                    onClick={() => {
                                        navigate("/profile");
                                        setShowDropdown(false);
                                    }}
                                >
                                    <FaUserEdit className="text-gray-400" />
                                    <span>Thông tin cá nhân</span>
                                </button>
                                <button 
                                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-700"
                                    onClick={() => {
                                        navigate("/change-password");
                                        setShowDropdown(false);
                                    }}
                                >
                                    <FaKey className="text-gray-400" />
                                    <span>Đổi mật khẩu</span>
                                </button>
                                <button 
                                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-700"
                                    onClick={handleLogout}
                                >
                                    <FaSignOutAlt className="text-gray-400" />
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;