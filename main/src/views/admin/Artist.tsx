import React, { useEffect, useState } from 'react';
import { getAllArtists, postArtist, putArtist, deleteArtist } from '../../adminApi/artistApi'; // Adjust the import path as necessary
import { toast } from 'react-toastify';

export default function Artist() {
  const [artists, setArtists] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newArtist, setNewArtist] = useState({
    name: '',
    profile_picture: '',
    followers_count: 0,
    biography: ''
  });
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editArtist, setEditArtist] = useState<any>(null);
  const [nameError, setNameError] = useState('');

  const fetchData = async ()=> {
    const res = await getAllArtists();
    setArtists(res);
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Filter artists by name
  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewArtist(prev => ({
      ...prev,
      [name]: name === 'followers_count' ? parseInt(value) : value
    }));
    // Validate name khi người dùng nhập
    if (name === 'name') {
      if (!value.trim()) {
        setNameError('Tên nghệ sĩ không được để trống');
      } else {
        setNameError('');
      }
    }
  };
  const handleAddClick = () => setShowForm(true);
  const handleCancel = () => {
    setShowForm(false);
    setNewArtist({
      name: '',
      profile_picture: '',
      followers_count: 0,
      biography: ''
    });
  };
  const handleSubmit = async () => {
    try {
      // Validate name trước khi submit
      if (!newArtist.name.trim()) {
        setNameError('Tên nghệ sĩ không được để trống');
        return;
      }

      // Kiểm tra artist đã tồn tại
      const isDuplicate = artists.some(artist => 
        artist.name.toLowerCase() === newArtist.name.toLowerCase()
      );

      if (isDuplicate) {
        toast.error('Nghệ sĩ này đã tồn tại trong hệ thống!');
        return;
      }

      const created = await postArtist(newArtist);
      setArtists(prev => [...prev, created]);
      toast.success('Thêm nghệ sĩ thành công!');
      setShowForm(false);
      setNewArtist({
        name: '',
        profile_picture: '',
        followers_count: 0,
        biography: ''
      }); // Reset form

      // Reload lại danh sách artist
      fetchData();
    } catch (e) {
      toast.error('Có lỗi khi thêm nghệ sĩ!');
    }
  };

  const handleEditClick = (artist: any) => {
    setEditArtist(artist);
    setShowEdit(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editArtist) return;
    const { name, value } = e.target;
    setEditArtist({ ...editArtist, [name]: name === 'followers_count' ? parseInt(value) : value });
  };

  const handleEditSave = async () => {
    if (!editArtist) return;
    try {
      const updated = await putArtist(editArtist.id, editArtist);
      setArtists(prev => prev.map(a => a.id === updated.id ? updated : a));
//      await fetchData();
      setShowEdit(false);
      setEditArtist(null);
      toast.success('Cập nhật nghệ sĩ thành công!');
      await fetchData();
    } catch (err) {
      toast.success('Có lỗi khi cập nhật nghệ sĩ!');
    }
  };

  const handleEditCancel = () => {
    setShowEdit(false);
    setEditArtist(null);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn chắc chắn muốn xóa?")) {
        try {
            await deleteArtist(id); // Sử dụng hàm deleteArtist
            // Cập nhật state sau khi xóa thành công
            setArtists(prev => prev.filter(artist => artist.id !== id));
            toast.success("Xóa thành công!");
            fetchData();
        } catch (error) {
            toast.error("Lỗi khi xóa artist:"); // Sửa thành toast.error để hiển thị thông báo lỗi
        }
    }
};

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search artist by name..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-gray-700 text-white py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" 
            />
            <div className="absolute left-3 top-2.5">
              {/* SVG Icon cho tìm kiếm */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
          </div>
        </div>
        <button onClick={handleAddClick} className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer">
          {/* SVG Icon cho nút thêm */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
          Add Artist
        </button>
      </div>
      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-4">
          <h3 className="text-lg mb-4">Add New Artist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newArtist.name}
                onChange={handleInputChange}
                className={`bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${
                  nameError ? 'border-2 border-red-500' : ''
                }`}
              />
              {nameError && (
                <p className="text-red-500 text-sm mt-1">{nameError}</p>
              )}
            </div>
            <input
              type="text" name="profile_picture" placeholder="Profile Picture Path" value={newArtist.profile_picture}
              onChange={handleInputChange}
              className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number" name="followers_count" placeholder="Followers Count" value={newArtist.followers_count}
              onChange={handleInputChange}
              className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="biography" placeholder="Biography" value={newArtist.biography}
              onChange={handleInputChange}
              className="col-span-1 md:col-span-2 bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded cursor-pointer">Cancel</button>
            <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded cursor-pointer">Save</button>
          </div>
        </div>
      )}
      {showEdit && editArtist && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-8 w-full max-w-3xl shadow-lg relative">
            <h2 className="text-xl font-bold mb-4 text-white">Edit artist</h2>
            <input
              type="text"
              name="name"
              value={editArtist.name}
              onChange={handleEditInputChange}
              placeholder="Tên nghệ sĩ"
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="profile_picture"
              value={editArtist.profile_picture}
              onChange={handleEditInputChange}
              placeholder="Đường dẫn hình ảnh"
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="followers_count"
              value={editArtist.followers_count}
              onChange={handleEditInputChange}
              placeholder="Số lượng theo dõi"
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="biography"
              value={editArtist.biography}
              onChange={handleEditInputChange}
              placeholder="Tiểu sử"
              className="w-full mb-3 p-4 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleEditCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleEditSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold cursor-pointer"
              >
                Lưu
              </button>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl cursor-pointer"
              onClick={handleEditCancel}
            >
              ×
            </button>
          </div>
        </div>
      )}
      <table className="table-auto w-full border border-gray-500">
        <thead className=" bg-gray-700 text-white">
          <tr>
            <th className="p-4 border text-lg">ID</th>
            <th className="p-4 border text-lg">Name</th>
            <th className="p-4 border text-lg">Profile picture</th>
            <th className="p-4 border text-lg">Followers count</th>
            <th className="p-4 border text-lg">Biography</th>
            <th className="p-4 border text-lg">Actions</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {filteredArtists.map((artist, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
              <td className="p-4 border text-center">{artist.id}</td>
              <td className="p-4 border text-center">{artist.name}</td>
              
              <td className="p-4 border">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                  {artist.profile_picture ? (
                    <>
                      <img 
                        src={`http://13.215.205.59/msa/artist${artist.profile_picture}`} 
                        alt={artist.name} 
                        className="w-full h-full"
                        style={{ objectFit: 'contain' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          // Show the no image text when image fails to load
                          const parent = target.parentElement;
                          if (parent) {
                            const noImageText = parent.querySelector('.no-image-text');
                            if (noImageText) {
                              (noImageText as HTMLElement).style.display = 'block';
                            }
                          }
                        }}
                      />
                      <span className="text-gray-400 text-xs text-center px-1 no-image-text" style={{ display: 'none' }}>No Image</span>
                    </>
                  ) : (
                    <span className="text-gray-400 text-xs text-center px-1">No Image</span>
                  )}
                </div>
              </td>
              <td className="p-4 border text-center">{artist.followers_count}</td>
              <td className="p-4 border text-center">{artist.biography}</td>
              <td className="p-4 border">
                <div className="flex gap-2 justify-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded cursor-pointer"
                    onClick={() => handleEditClick(artist)}
                  >
                    Edit
                  </button>
                  <button 
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded cursor-pointer"
                    onClick={() => handleDelete(artist.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
