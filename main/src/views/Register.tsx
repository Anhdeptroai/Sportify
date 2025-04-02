import React from "react";
import { Link, useNavigate } from "react-router-dom";

const  Register = () => {
  const navigate = useNavigate();

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

        <div className="space-y-2">
          <div>
            <label className="text-gray-400 text-sm">Email hoặc tên người dùng</label>
            <input
              type="text"
              className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              placeholder="Email hoặc tên người dùng"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm">Mật khẩu mới</label>
            <input
              type="password"
              className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              placeholder="Mật khẩu"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm">Nhập lại mật khẩu</label>
            <input
              type="password"
              className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              placeholder="Mật khẩu"
            />
          </div>
          <button className="w-full bg-green-500 text-white py-2 mt-2 rounded-full font-bold hover:bg-green-600"
                  onClick={() => navigate("/Login")}>
            Đăng ký
          </button>
        </div>
        
        <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-500" />
            <span className="px-2 text-gray-300 text-sm">hoặc</span>
            <hr className="flex-grow border-gray-500" />
        </div>

        <div className="mt-6 space-y-3">
          <button className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-500 rounded-full text-white hover:bg-gray-700">
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="h-5 w-5" />
            Đăng ký bằng Google
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-500 rounded-full text-white hover:bg-gray-700">
          Đăng ký bằng số điện thoại
          </button>
        </div>

        <hr className="my-6 border-gray-600" />

        <div className="text-center text-sm text-gray-400 mt-4">
          Bạn đã có tài khoản?{" "}
          <Link to="/Login" className="text-white font-bold hover:underline">Đăng Nhập Spotify</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
