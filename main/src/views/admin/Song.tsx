import React, { useEffect, useState } from 'react';
import { getAllAlbum } from '../../adminApi/albumApi'; 
import { getAllSong, postSong, putSong, deleteSong } from '../../adminApi/songApi'; 
import type { Participant } from '../../models/song';
import { toast } from 'react-toastify';

export default function Song() {
    const [songs, setSongs] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showForm, setShowForm] = useState(false);
    const [newSong, setNewSong] = useState({
        title: '',
        album: '',
        duration: '',
        gener: '',
        image: '',
        audio_file: '',
        video_file: ''
    });
    const [titleError, setTitleError] = useState('');
    const [albums, setAlbums] = useState<any[]>([]);
    const [showEdit, setShowEdit] = useState(false);
    const [editSong, setEditSong] = useState<any>(null);

    
    const fetchData = async () => {
      const song = await getAllSong();
      setSongs(song);
    };
  
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        getAllAlbum().then(setAlbums);
    }, []);

    // Filter songs by title
    const filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const {name, value } = e.target;
      setNewSong(prev => ({ ...prev, [name]: value }));
      // Validate title khi người dùng nhập
      if (name === 'title') {
          if (!value.trim()) {
              setTitleError('Tiêu đề bài hát không được để trống');
          } else {
              setTitleError('');
          }
      }
    };


      const handleSubmit = async () => {
        try {
            // Validate title trước khi submit
            if (!newSong.title.trim()) {
                setTitleError('Tên bài hát không được để trống');
                return;
            }

            // Check for duplicate song
            const isDuplicate = songs.some(song => 
                song.title.toLowerCase() === newSong.title.toLowerCase()
            );

            if (isDuplicate) {
                toast.error('Bài hát đã tồn tại!');
                return;
            }

            const created = await postSong(newSong);
            setSongs(prev => [...prev, created]);
            toast.success('Thêm bài hát thành công!');
            setShowForm(false);
            // Reset form
            setNewSong({
                title: '',
                album: '',
                duration: '',
                gener: '',
                image: '',
                audio_file: '',
                video_file: ''
            });
            // Reload lại danh sách
            //fetchData();
        } catch (e) {
            toast.error('Có lỗi khi thêm bài hát!');
        }
    };

    const handleEditClick = (song: any) => {
        setEditSong(song);
        setShowEdit(true);
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editSong) return;
        const { name, value } = e.target;
        setEditSong({ ...editSong, [name]: value });
    };

    const handleEditSave = async () => {
        if (!editSong) return;
        try {
            const updated = await putSong(editSong.id, editSong);
            setSongs(prev => prev.map(s => s.id === updated.id ? updated : s));
            setShowEdit(false);
            setEditSong(null);
            toast.success('Cập nhật bài hát thành công!');
            fetchData();
        } catch (err) {
            toast.error('Có lỗi khi cập nhật bài hát!');
        }
    };

    const handleEditCancel = () => {
        setShowEdit(false);
        setEditSong(null);
    };

    const handleDelete = async (id: number) => {
       if(window.confirm('Bạn có chắc chắn muốn xóa bài hát này?')) {
          try {
            await deleteSong(id);
            setSongs(prev => prev.filter(song => song.id !== id));
            toast.success('Xóa bài hát thành công!');
            fetchData();
          } catch (err) {
            toast.error('Có lỗi khi xóa bài hát!');
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
                  placeholder="Name song..." 
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
             
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer"
          >
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
            Add Song
          </button>
          </div>

      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-4">
          <h3 className="text-lg mb-4">Add New Song</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={newSong.title}
                onChange={handleInputChange}
                className={`bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${
                  titleError ? 'border-2 border-red-500' : ''
                }`}
              />
              {titleError && (
                <p className="text-red-500 text-sm mt-1">{titleError}</p>
              )}
            </div>
            <select
              name="album"
              value={newSong.album}
              onChange={handleInputChange}
              className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn album</option>
              {albums.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
            <input
              type="text"
              name="duration"
              placeholder="Duration"
              value={newSong.duration}
              onChange={handleInputChange}
              className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="gener"
              placeholder="Gener"
              value={newSong.gener}
              onChange={handleInputChange}
              className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="image"
              placeholder="Image Path"
              value={newSong.image}
              onChange={handleInputChange}
              className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="audio_file"
              placeholder="Audio File Path"
              value={newSong.audio_file}
              onChange={handleInputChange}
              className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
             <input
              type="text"
              name="video_file"
              placeholder="Video File Path"
              value={newSong.video_file}
              onChange={handleInputChange}
              className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded cursor-pointer">Cancel</button>
            <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded cursor-pointer">Save</button>
          </div>
        </div>
      )}

      {showEdit && editSong && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-8 w-full max-w-3xl shadow-lg relative">
            <h2 className="text-xl font-bold mb-4 text-white">Edit Song</h2>
            <input
              type="text"
              name="title"
              value={editSong.title}
              onChange={handleEditInputChange}
              placeholder="Title"
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="album"
              value={editSong.album}
              onChange={handleEditInputChange}
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn album</option>
              {albums.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
            <input
              type="text"
              name="duration"
              value={editSong.duration}
              onChange={handleEditInputChange}
              placeholder="Duration"
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="gener"
              value={editSong.gener}
              onChange={handleEditInputChange}
              placeholder="Gener"
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="image"
              value={editSong.image}
              onChange={handleEditInputChange}
              placeholder="Image Path"
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="audio_file"
              value={editSong.audio_file}
              onChange={handleEditInputChange}
              placeholder="Audio File Path"
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="video_file"
              value={editSong.video_file}
              onChange={handleEditInputChange}
              placeholder="Video File Path"
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleEditCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold cursor-pointer"
              >
                Save
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

      <table className="w-full table-auto border border-gray-500">
        <thead className=" bg-gray-700 text-white">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Duration</th>
            <th className="p-2 border">Gener</th>
            <th className="p-2 border">Participant</th>
            <th className="p-2 border">Album</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {filteredSongs.map((song, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
              <td className="p-2 border">{song.id}</td>
                                  
              <td className="p-2 border">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                  {song.image ? (
                    <img
                      src={`http://13.215.205.59/msa/track_img${song.image}`}
                      alt={song.title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    '—'
                  )}
                </div>
              </td>
              <td className="p-2 border">{song.title}</td>
              <td className="p-2 border">{song.duration}</td>
              <td className="p-2 border">{song.gener}</td>
              <td className="border px-4 py-2">
                {song.participants && song.participants.length > 0
                  ? song.participants.map((p: Participant) => p.artist_name).join(', ')
                  : '—'}
              </td>
              <td className="p-2 border">{song.album}</td>
              <td className="p-2 border">
                <div className="flex gap-2 justify-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded cursor-pointer"
                    onClick={() => handleEditClick(song)}
                  >
                    Edit
                  </button>
                  <button 
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded cursor-pointer"
                    onClick={() => handleDelete(song.id)}
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
