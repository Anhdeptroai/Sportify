import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAllAlbum } from '../../adminApi/albumApi';
import { getAllArtists } from '../../adminApi/artistApi';
import { postAlbum } from '../../adminApi/albumApi';

export default function Albums() {
    const [albums, setAlbums] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showForm, setShowForm] = useState(false);
    const [newAlbum, setNewAlbum] = useState({
        title: '',
        artist: '',
        creation_date: '',
        publish_date: ''
    });
    const [artists, setArtists] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const album = await getAllAlbum();
            setAlbums(album);
        };
            fetchData();
        getAllArtists().then(setArtists);
    }, []);

    // Function to format date
    const formatDate = (dateString: string) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Function to count songs in album
    const countSongs = (songs: any[]) => {
        return songs ? songs.length : 0;
    };
    // Filter albums by title
    const filteredAlbums = albums.filter(album =>
        album.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewAlbum(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            await postAlbum(newAlbum);
            alert('Thêm album thành công!');
            setShowForm(false);
            // Reload lại danh sách album
            const album = await getAllAlbum();
            setAlbums(album);
        } catch (e) {
            alert('Có lỗi khi thêm album!');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search albums..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-gray-700 text-white py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" 
                        />
                        <div className="absolute left-3 top-2.5">
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
                 
                <button onClick={() => setShowForm(true)} className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer">
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
                    Add Album
                </button>
            </div>

            {showForm && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-4">
                    <h3 className="text-lg mb-4">Add New Album</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={newAlbum.title}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            name="artist"
                            value={newAlbum.artist}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Chọn nghệ sĩ</option>
                            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                        <input
                            type="date"
                            name="creation_date"
                            placeholder="Creation Date"
                            value={newAlbum.creation_date}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="date"
                            name="publish_date"
                            placeholder="Publish Date"
                            value={newAlbum.publish_date}
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

            <table className="table-auto min-w-full border border-gray-500">
                <thead className="bg-gray-700 text-white">
                    <tr>
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Title</th>
                        <th className="p-2 border">Artist ID</th>
                        <th className="p-2 border">Songs Count</th>
                        <th className="p-2 border">Creation Date</th>
                        <th className="p-2 border">Publish Date</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-white">
                    {filteredAlbums.map((album, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
                            <td className="p-2 border">{album.id}</td>
                            <td className="p-2 border">{album.title}</td>
                            <td className="p-2 border">{album.artist}</td>
                            <td className="p-2 border">{countSongs(album.songs)}</td>
                            <td className="p-2 border">{formatDate(album.creation_date)}</td>
                            <td className="p-2 border">{formatDate(album.publish_date)}</td>
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
