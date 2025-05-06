import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api, API_ENDPOINTS } from '../config/api';
import Footer from '../layouts/Footer';
import Navbar from '../layouts/Navbar';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        };

        // Kiểm tra mật khẩu hiện tại
        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
            isValid = false;
        }

        // Kiểm tra mật khẩu mới
        if (!formData.newPassword) {
            newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
            isValid = false;
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
            isValid = false;
        } else if (formData.newPassword === formData.currentPassword) {
            newErrors.newPassword = 'Mật khẩu mới không được trùng với mật khẩu hiện tại';
            isValid = false;
        }

        // Kiểm tra xác nhận mật khẩu
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
            isValid = false;
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Reset errors trước khi validate
        setErrors({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        
        // Kiểm tra form trước khi submit
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Gửi yêu cầu thay đổi mật khẩu
            const response = await api.post(API_ENDPOINTS.USER.UPDATE_PROFILE, {
                current_password: formData.currentPassword,
                new_password: formData.newPassword
            });

            if (response.status === 200) {
                toast.success('Đổi mật khẩu thành công!');
                // Xóa token và user data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Chuyển về trang chủ
                navigate('/');
            }
        } catch (error: any) {
            console.error('Lỗi khi đổi mật khẩu:', error);
            if (error.response?.status === 401) {
                setErrors(prev => ({
                    ...prev,
                    currentPassword: 'Mật khẩu hiện tại không đúng'
                }));
                toast.error('Mật khẩu hiện tại không đúng');
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Xóa lỗi khi người dùng bắt đầu nhập lại
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Đổi mật khẩu</h1>
                    
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.currentPassword ? 'border-red-500' : ''
                                    }`}
                                    required
                                    disabled={loading}
                                />
                                {errors.currentPassword && (
                                    <p className="text-red-500 text-sm">{errors.currentPassword}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.newPassword ? 'border-red-500' : ''
                                    }`}
                                    required
                                    disabled={loading}
                                />
                                {errors.newPassword && (
                                    <p className="text-red-500 text-sm">{errors.newPassword}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.confirmPassword ? 'border-red-500' : ''
                                    }`}
                                    required
                                    disabled={loading}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={loading}
                                >
                                    {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ChangePassword; 