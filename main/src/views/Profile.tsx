import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../layouts/Footer';
import Navbar from '../layouts/Navbar';

interface UserData {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
    subscription_type: string | null;
}

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData>({
        id: 0,
        email: '',
        first_name: '',
        last_name: '',
        profile_picture: null,
        subscription_type: null
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Kiểm tra đăng nhập
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Lấy thông tin người dùng từ API
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // Lấy user_id từ token
                const payload = JSON.parse(atob(token.split('.')[1]));
                const userId = payload.user_id;

                // Gọi API lấy thông tin user
                const response = await axios.get(`http://18.142.50.220:8000/api/users/${userId}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                setUserData(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
                setError('Không thể lấy thông tin người dùng. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const validateData = () => {
        if (!userData.email) {
            alert('Email không được để trống!');
            return false;
        }
        if (!userData.first_name) {
            alert('Tên không được để trống!');
            return false;
        }
        if (!userData.last_name) {
            alert('Họ không được để trống!');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Kiểm tra dữ liệu trước khi gửi
        if (!validateData()) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Kiểm tra token có hợp lệ không
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expirationTime = payload.exp * 1000; // Convert to milliseconds
                if (Date.now() >= expirationTime) {
                    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
            } catch (error) {
                console.error('Lỗi khi kiểm tra token:', error);
                alert('Token không hợp lệ. Vui lòng đăng nhập lại!');
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            // Gửi dữ liệu cập nhật lên API
            const response = await axios.put(`http://18.142.50.220:8000/api/users/${userData.id}/`, 
                {
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    email: userData.email,
                    profile_picture: userData.profile_picture,
                    subscription_type: userData.subscription_type
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Cập nhật lại state với dữ liệu mới từ server
            setUserData(response.data);
            alert('Cập nhật thông tin thành công!');
        } catch (error: any) {
            console.error('Lỗi khi cập nhật thông tin:', error);
            if (error.response) {
                // Lỗi từ server
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                
                // Xử lý lỗi 401 (Unauthorized)
                if (error.response.status === 401) {
                    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                
                alert(`Lỗi: ${error.response.data.detail || 'Có lỗi xảy ra khi cập nhật thông tin!'}`);
            } else if (error.request) {
                // Không nhận được response
                console.error('Request error:', error.request);
                alert('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!');
            } else {
                // Lỗi khác
                console.error('Error:', error.message);
                alert('Có lỗi xảy ra khi cập nhật thông tin!');
            }
        }
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-black text-white flex items-center justify-center">
                    <p>Đang tải thông tin...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-black text-white flex items-center justify-center">
                    <p className="text-red-500">{error}</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Thông tin cá nhân</h1>
                    
                    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    value={userData.email}
                                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                                    className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Tên</label>
                                <input
                                    type="text"
                                    value={userData.first_name}
                                    onChange={(e) => setUserData({...userData, first_name: e.target.value})}
                                    className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Họ</label>
                                <input
                                    type="text"
                                    value={userData.last_name}
                                    onChange={(e) => setUserData({...userData, last_name: e.target.value})}
                                    className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Loại tài khoản</label>
                                <input
                                    type="text"
                                    value={userData.subscription_type || 'Chưa có'}
                                    disabled
                                    className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                                />
                            </div>

                            {userData.profile_picture && (
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-sm font-medium">Ảnh đại diện</label>
                                    <img 
                                        src={`http://18.142.50.220/msa/profile/${userData.profile_picture}`}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Profile; 