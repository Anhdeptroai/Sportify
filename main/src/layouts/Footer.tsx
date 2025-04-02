const Footer = () => {
  return (
    <div className="text-white py-10 px-8">
      {/* Phần danh sách thông tin */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold mb-3">Công ty</h3>
          <ul className="text-gray-400 space-y-2">
            <li><a href="#">Giới thiệu</a></li>
            <li><a href="#">Việc làm</a></li>
            <li><a href="#">For the Record</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-3">Cộng đồng</h3>
          <ul className="text-gray-400 space-y-2">
            <li><a href="#">Dành cho các Nghệ sĩ</a></li>
            <li><a href="#">Nhà phát triển</a></li>
            <li><a href="#">Quảng cáo</a></li>
            <li><a href="#">Nhà đầu tư</a></li>
            <li><a href="#">Nhà cung cấp</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-3">Liên kết hữu ích</h3>
          <ul className="text-gray-400 space-y-2">
            <li><a href="#">Hỗ trợ</a></li>
            <li><a href="#">Ứng dụng Di động</a></li>
            <li><a href="#">Miễn phí</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-3">Các gói của Spotify</h3>
          <ul className="text-gray-400 space-y-2">
            <li><a href="#">Premium Individual</a></li>
            <li><a href="#">Premium Student</a></li>
            <li><a href="#">Spotify Free</a></li>
          </ul>
        </div>
      </div>

      {/* Phần biểu tượng mạng xã hội */}
      <div className="flex justify-center space-x-4 mt-8">
        <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full">
          <i className="fab fa-instagram text-white"></i>
        </a>
        <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full">
          <i className="fab fa-twitter text-white"></i>
        </a>
        <a href="#" className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full">
          <i className="fab fa-facebook text-white"></i>
        </a>
      </div>

      {/* Phần bản quyền */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-gray-400 text-sm text-center">
        © 2025 Spotify AB
      </div>
    </div>
  );
};

export default Footer;
