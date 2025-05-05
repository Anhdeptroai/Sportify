import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
    };

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setLoading(true);
    console.log('Sending login request...');

    try {
      // Gọi API đăng nhập
      const response = await axios.post('http://18.142.50.220:8000/api/token/', {
        email: formData.email,
        password: formData.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Login response:', response.data);

      // Kiểm tra response có token không
      if (response.data && response.data.access) {
        // Lưu token vào localStorage
        localStorage.setItem('token', response.data.access);
        
        // Lưu refresh token nếu có
        if (response.data.refresh) {
          localStorage.setItem('refreshToken', response.data.refresh);
        }

        // Thêm token vào header cho các request sau này
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        
        // Thông báo thành công
        toast.success('Đăng nhập thành công!');
        console.log('Login successful, redirecting...');
        
        // Chuyển hướng về trang chủ
        navigate('/');
      } else {
        throw new Error('Token không hợp lệ');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.response) {
        console.log('Error response:', err.response.data);
        const errorData = err.response.data;
        
        // Xử lý các loại lỗi từ server
        if (errorData.email) {
          setErrors(prev => ({ ...prev, email: errorData.email[0] }));
          toast.error(errorData.email[0]);
        }
        if (errorData.password) {
          setErrors(prev => ({ ...prev, password: errorData.password[0] }));
          toast.error(errorData.password[0]);
        }
        if (errorData.detail) {
          toast.error(errorData.detail);
        } else if (errorData.message) {
          toast.error(errorData.message);
        } else {
          toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        }
      } else if (err.request) {
        console.log('No response received:', err.request);
        toast.error('Không thể kết nối đến server. Vui lòng thử lại sau.');
      } else {
        console.log('Error setting up request:', err.message);
        toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <form onSubmit={handleLogin} className="bg-black p-8 rounded-lg shadow-lg w-96">
        <div className="text-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg"
            alt="Spotify Logo"
            className="h-10 mx-auto"
          />
          <h2 className="text-white text-xl font-bold mt-4">Đăng nhập vào Spotify</h2>
        </div>

        <div className="mt-6 space-y-3">
          <button type="button" className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-500 rounded-full text-white hover:bg-gray-700">
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="h-5 w-5" />
            Tiếp tục bằng Google
          </button>
          <button type="button" className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-500 rounded-full text-white hover:bg-gray-700">
            Tiếp tục bằng số điện thoại
          </button>
        </div>

        <hr className="my-6 border-gray-600" />

        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm">Email</label>
            <input
              type="email"
              name="email"
              required
              className={`w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-green-500 ${
                errors.email ? 'border border-red-500' : ''
              }`}
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="text-gray-400 text-sm">Mật khẩu</label>
            <input
              type="password"
              name="password"
              required
              className={`w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-green-500 ${
                errors.password ? 'border border-red-500' : ''
              }`}
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-500 text-white py-2 rounded-full font-bold hover:bg-green-600 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </div>

        <div className="text-center text-sm text-gray-400 mt-4">
          <a href="#" className="hover:underline">
            Quên mật khẩu của bạn?
          </a>
        </div>

        <div className="text-center text-sm text-gray-400 mt-4">
          Bạn chưa có tài khoản?{' '}
          <Link to="/register" className="text-white font-bold hover:underline">
            Đăng ký Spotify
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
