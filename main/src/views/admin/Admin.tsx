import  { useState } from 'react'
import {Admin_header} from '../../components/Admin/AdminHeader';
import {Admin_navbar} from '../../components/Admin/AdminNavbar';  
import Artist from './Artist';
import { useNavigate } from 'react-router-dom';
import Participant from './Participant';
import Song from './Song';
import Albums from './Albums';  
import User from './User';

export default function Admin() {
  
    const [selectedTab, setSelectedTab] = useState('Song');
    const navigate = useNavigate();

   //  Hàm xử lý logout
    const handleLogout = () => {
    // Xóa token hoặc dữ liệu đăng nhập nếu có
    //localStorage.removeItem('accessToken'); 
    // hoặc sessionStorage.removeItem('accessToken')

    // Chuyển hướng về trang login
    navigate('/login');
    };
 
    return (
      <div className="flex h-screen bg-gray-900 text-gray-200">
        {/* Navbar cố định bên trái - Giả sử chiều rộng là 64 (16rem) */}
         <Admin_navbar onSelectTab={setSelectedTab} onLogout={handleLogout} selectedTab={selectedTab} />
  
        {/* Khu vực nội dung chính - Thêm padding trái bằng chiều rộng Navbar */}
        <div className="flex-1 flex flex-col overflow-hidden pl-64"> {/* <-- Thêm pl-64 */}
          {/* Header - Giả sử chiều cao là 16 (4rem) */}
          <Admin_header/>
          
          {/* Phần nội dung có thể cuộn - Thêm padding top bằng chiều cao Header */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6 pt-20"> {/* <-- Thay đổi pt */}
            {/* Container cho nội dung tab */}
            <div className="bg-gray-800 pt-12 rounded-lg shadow-lg">
              {selectedTab === 'Artist' && <Artist />}
              {selectedTab === 'Participant' && <Participant />}
              {selectedTab === 'Song' && <Song />}
              {selectedTab === 'Album' && <Albums />}
              {selectedTab === 'User' && <User />}
            </div>
          </main>
        </div>
      </div>
    )
  }
