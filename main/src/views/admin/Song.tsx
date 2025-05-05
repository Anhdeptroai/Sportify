import React, { useEffect, useState } from 'react';
import { getAllSong, postSong } from '../../adminApi/songApi'; // Adjust the import path as necessary
import type {Song, Participant } from '../../models/song';
import { getAllAlbum } from '../../adminApi/albumApi'; // Adjust the import path as necessary

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
        audio_file: ''
    });
    const [albums, setAlbums] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const song = await getAllSong();
            setSongs(song);
        };
        fetchData();
    }, []);

    useEffect(() => {
        getAllAlbum().then(setAlbums);
    }, []);

    // Filter songs by search term
    const filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, files } = e.target as HTMLInputElement;
        if (type === 'file' && files) {
            setNewSong(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setNewSong(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            Object.entries(newSong).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });
            await postSong(formData);
            alert('Thêm bài hát thành công!');
            setShowForm(false);
            // reload lại danh sách song
        } catch (e) {
            alert('Có lỗi khi thêm bài hát!');
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
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newSong.title}
              onChange={handleInputChange}
              className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded">Cancel</button>
            <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded">Save</button>
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
                      src={`http://18.142.50.220/msa/track_img${song.image}`}
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
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                    Edit
                  </button>
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
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
