import React, { useEffect, useState } from 'react';
import { getAllParticipant, postParticipant, putParticipant } from '../../adminApi/participantApi';
import { getAllArtists } from '../../adminApi/artistApi';
import { getAllSong } from '../../adminApi/songApi';

export default function Participant() {
    const [participants, setParticipants] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showForm, setShowForm] = useState<boolean>(false);
    const [newParticipant, setNewParticipant] = useState({
        artist: '',
        song: '',
        role: '',
        artist_name: ''
    });
    const [artists, setArtists] = useState<any[]>([]);
    const [songs, setSongs] = useState<any[]>([]);
    const [showEdit, setShowEdit] = useState(false);
    const [editParticipant, setEditParticipant] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const participant = await getAllParticipant();
            setParticipants(participant);
        };
        fetchData();
    }, []);

    useEffect(() => {
        getAllArtists().then(setArtists);
        getAllSong().then(setSongs);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewParticipant(prev => ({ ...prev, [name]: value }));
    };

    const handleAddClick = () => setShowForm(true);
    const handleCancel = () => {
        setShowForm(false);
        setNewParticipant({ artist: '', song: '', role: '', artist_name: '' });
    };

    const handleSubmit = async () => {
        try {
            await postParticipant(newParticipant);
            alert('Thêm participant thành công!');
            setShowForm(false);
            // reload lại danh sách participant
        } catch (e) {
            alert('Có lỗi khi thêm participant!');
        }
    };

    const handleEditClick = (participant: any) => {
        setEditParticipant(participant);
        setShowEdit(true);
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editParticipant) return;
        const { name, value } = e.target;
        setEditParticipant({ ...editParticipant, [name]: value });
    };

    const handleEditSave = async () => {
        if (!editParticipant) return;
        try {
            const updated = await putParticipant(editParticipant.id, editParticipant);
            setParticipants(prev => prev.map(p => p.id === updated.id ? updated : p));
            setShowEdit(false);
            setEditParticipant(null);
            alert('Cập nhật participant thành công!');
        } catch (err) {
            alert('Có lỗi khi cập nhật participant!');
        }
    };

    const handleEditCancel = () => {
        setShowEdit(false);
        setEditParticipant(null);
    };

    // Filter users by Artist name
    const filteredParticipants = participants.filter(participant =>
        participant.artist_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
 
  return (
 
    <div>
      <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search by Artist name..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Participant
          </button>
          {showForm && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-4">
              <h3 className="text-lg mb-4">Add New Participant</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text" name="artist_name" placeholder="Artist Name" value={newParticipant.artist_name}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  name="artist"
                  value={newParticipant.artist}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn nghệ sĩ</option>
                  {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                <select
                  name="song"
                  value={newParticipant.song}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn bài hát</option>
                  {songs.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
                <input
                  type="text" name="role" placeholder="Role" value={newParticipant.role}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded">Cancel</button>
                <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded">Save</button>
              </div>
            </div>
          )}
          </div>
      <table className="w-full table-auto border border-gray-500">
      
            <thead className=" bg-gray-700 text-white">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Artist name</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Song_Id</th>
            <th className="p-2 border">Artist_Id</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {filteredParticipants.map((participant, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
              <td className="p-2 border">{participant.id}</td>
              <td className="p-2 border">{participant.artist_name}</td>
              
           
              <td className="p-2 border">{participant.role}</td>
              <td className="p-2 border">{participant.song}</td>
              <td className="p-2 border">{participant.artist}</td>
              <td className="p-2 border">
                <div className="flex gap-2 justify-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => handleEditClick(participant)}
                  >
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

      {showEdit && editParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-8 w-full max-w-3xl shadow-lg relative">
            <h2 className="text-xl font-bold mb-4 text-white">Edit Participant</h2>
            <select
              name="song"
              value={editParticipant.song}
              onChange={handleEditInputChange}
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn song</option>
              {songs.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
            <select
              name="artist"
              value={editParticipant.artist}
              onChange={handleEditInputChange}
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn artist</option>
              {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <input
              type="text"
              name="role"
              value={editParticipant.role}
              onChange={handleEditInputChange}
              placeholder="Role"
              className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleEditCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold"
              >
                Save
              </button>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
              onClick={handleEditCancel}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
