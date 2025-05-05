import React, { useEffect, useState } from 'react';
import { getAllArtists, postArtist } from '../../adminApi/artistApi'; // Adjust the import path as necessary

export default function Artist() {
  const [artists, setArtists] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newArtist, setNewArtist] = useState({ name: '', profile_picture: '', followers_count: 0, biography: '' });

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllArtists();
      setArtists(res);
    };
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
  };
  const handleAddClick = () => setShowForm(true);
  const handleCancel = () => {
    setShowForm(false);
    setNewArtist({ name: '', profile_picture: '', followers_count: 0, biography: '' });
  };
  const handleSubmit = async () => {
    try {
      const created = await postArtist(newArtist);
      setArtists(prev => [...prev, created]);
      handleCancel();
    } catch (error) {
      console.error('Error adding artist:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn chắc chắn muốn xóa?")) {
      try {
        // Gọi API xóa artist với id tương ứng
        await fetch(`http://18.142.50.220:8000/api/artists/${id}`, { method: 'DELETE' });
        // Cập nhật state sau khi xóa thành công
        setArtists(prev => prev.filter(artist => artist.id !== id));
        alert("Xóa thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa artist:", error);
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
        <button onClick={handleAddClick} className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
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
            <input
              type="text" name="name" placeholder="Name" value={newArtist.name}
              onChange={handleInputChange}
              className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded">Cancel</button>
            <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded">Save</button>
          </div>
        </div>
      )}
      <table className="table-auto h-screen min-w[800px]  border border-gray-500">
        <thead className=" bg-gray-700 text-white">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Profile picture</th>
            <th className="p-2 border">Followers count</th>
            <th className="p-2 border">Biography</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {filteredArtists.map((artist, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
              <td className="p-2 border">{artist.id}</td>
              <td className="p-2 border">{artist.name}</td>
              
              <td className="p-2 border">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                  {artist.profile_picture ? (
                    <>
                      <img 
                        src={`http://18.142.50.220/msa/artist${artist.profile_picture}`} 
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
              <td className="p-2 border">{artist.followers_count}</td>
              <td className="p-2 border">{artist.biography}</td>
              <td className="p-2 border">
                <div className="flex gap-2 justify-center">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                    Edit
                  </button>
                  <button 
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
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
