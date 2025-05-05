import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../layouts/Footer';
import Navbar from '../layouts/Navbar';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        fullName: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        // Kiểm tra đăng nhập
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Lấy thông tin người dùng từ API
        // Đây là ví dụ, bạn cần thay thế bằng API thực tế
        const fetchUserData = async () => {
            try {
                // const response = await axios.get('your-api-endpoint');
                // setUserData(response.data);
                
                // Tạm thời sử dụng dữ liệu mẫu
                setUserData({
                    username: localStorage.getItem('userName') || '',
                    email: 'example@email.com',
                    fullName: 'Nguyễn Văn A',
                    phone: '0123456789',
                    address: '123 Đường ABC, Quận XYZ, TP.HCM'
                });
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Gửi dữ liệu cập nhật lên API
            // await axios.put('your-api-endpoint', userData);
            alert('Cập nhật thông tin thành công!');
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
            alert('Có lỗi xảy ra khi cập nhật thông tin!');
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Thông tin cá nhân</h1>
                    
                    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Tên đăng nhập</label>
                                <input
                                    type="text"
                                    value={userData.username}
                                    disabled
                                    className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

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
                                <label className="block text-sm font-medium">Họ và tên</label>
                                <input
                                    type="text"
                                    value={userData.fullName}
                                    onChange={(e) => setUserData({...userData, fullName: e.target.value})}
                                    className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Số điện thoại</label>
                                <input
                                    type="tel"
                                    value={userData.phone}
                                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                                    className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-medium">Địa chỉ</label>
                                <input
                                    type="text"
                                    value={userData.address}
                                    onChange={(e) => setUserData({...userData, address: e.target.value})}
                                    className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
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