import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên người dùng";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "Tên người dùng phải có ít nhất 3 ký tự";
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      isValid = false;
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Chuẩn bị dữ liệu gửi lên server
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      // Gọi API đăng ký
      const response = await axios.post(
        "http://18.142.50.220:8000/api/register/",
        registerData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        // Xử lý response thành công
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        // Lưu thông tin user nếu cần
        localStorage.setItem('user', JSON.stringify(response.data));
        // Chuyển hướng về trang login
        navigate("/login");
      }
    } catch (error: any) {
      // Xử lý các lỗi từ server
      if (error.response) {
        const errorData = error.response.data;
        if (errorData.username) {
          setErrors(prev => ({ ...prev, username: errorData.username[0] }));
        }
        if (errorData.email) {
          setErrors(prev => ({ ...prev, email: errorData.email[0] }));
        }
        if (errorData.password) {
          setErrors(prev => ({ ...prev, password: errorData.password[0] }));
        }
        if (errorData.detail) {
          toast.error(errorData.detail);
        } else {
          toast.error("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
        }
      } else if (error.request) {
        // Không nhận được response từ server
        toast.error("Không thể kết nối đến server. Vui lòng thử lại sau.");
      } else {
        // Lỗi khác
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    toast.info("Tính năng đang được phát triển");
  };

  const handlePhoneSignup = () => {
    toast.info("Tính năng đang được phát triển");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="bg-black p-8 rounded-lg shadow-lg w-96">
        <div className="text-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg"
            alt="Spotify Logo"
            className="h-10 mx-auto"
          />
          <h2 className="text-white text-xl font-bold mt-4 mb-4">Đăng ký để bắt đầu nghe</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm">Tên người dùng</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-green-500 ${
                errors.username ? "border border-red-500" : ""
              }`}
              placeholder="Tên người dùng"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="text-gray-400 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-green-500 ${
                errors.email ? "border border-red-500" : ""
              }`}
              placeholder="Email"
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
              value={formData.password}
              onChange={handleChange}
              className={`w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-green-500 ${
                errors.password ? "border border-red-500" : ""
              }`}
              placeholder="Mật khẩu"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="text-gray-400 text-sm">Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-green-500 ${
                errors.confirmPassword ? "border border-red-500" : ""
              }`}
              placeholder="Xác nhận mật khẩu"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-green-500 text-white py-2 mt-2 rounded-full font-bold hover:bg-green-600 transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>
        
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-500" />
          <span className="px-2 text-gray-300 text-sm">hoặc</span>
          <hr className="flex-grow border-gray-500" />
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-500 rounded-full text-white hover:bg-gray-700 transition-colors"
          >
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="h-5 w-5" />
            Đăng ký bằng Google
          </button>
          <button
            onClick={handlePhoneSignup}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-500 rounded-full text-white hover:bg-gray-700 transition-colors"
          >
            Đăng ký bằng số điện thoại
          </button>
        </div>

        <hr className="my-6 border-gray-600" />

        <div className="text-center text-sm text-gray-400 mt-4">
          Bạn đã có tài khoản?{" "}
          <Link to="/login" className="text-white font-bold hover:underline">
            Đăng Nhập Spotify
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
