import React from "react";
import { Link, useNavigate } from "react-router-dom";

const  Login = () => {
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
          <h2 className="text-white text-xl font-bold mt-4">Đăng nhập vào Spotify</h2>
        </div>

        <div className="mt-6 space-y-3">
          <button className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-500 rounded-full text-white hover:bg-gray-700">
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="h-5 w-5" />
            Tiếp tục bằng Google
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-500 rounded-full text-white hover:bg-gray-700">
            Tiếp tục bằng số điện thoại
          </button>
        </div>

        <hr className="my-6 border-gray-600" />

        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm">Email hoặc tên người dùng</label>
            <input
              type="text"
              className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              placeholder="Email hoặc tên người dùng"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm">Mật khẩu</label>
            <input
              type="password"
              className="w-full bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-green-500"
              placeholder="Mật khẩu"
            />
          </div>
          <button className="w-full bg-green-500 text-white py-2 rounded-full font-bold hover:bg-green-600"
                  onClick={() => navigate("/")}>
            Đăng nhập
          </button>
        </div>

        <div className="text-center text-sm text-gray-400 mt-4">
          <a href="#" className="hover:underline">Quên mật khẩu của bạn?</a>
        </div>

        <div className="text-center text-sm text-gray-400 mt-4">
          Bạn chưa có tài khoản?{" "}
          <Link to="/Register" className="text-white font-bold hover:underline">Đăng ký Spotify</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
