import React, { useEffect, useState } from 'react';
import { getAllAlbum, postAlbum, putAlbum, deleteAlbum } from '../../adminApi/albumApi';
import { getAllArtists } from '../../adminApi/artistApi';
import { toast } from 'react-toastify';



export default function Albums() {
    const [albums, setAlbums] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showForm, setShowForm] = useState(false);
    const [newAlbum, setNewAlbum] = useState({
        title: '',
        description: '',
        creation_date: '',
        publish_date: '',
        artist: ''
    });
    const [artists, setArtists] = useState<any[]>([]);
    const [showEdit, setShowEdit] = useState(false);
    const [editAlbum, setEditAlbum] = useState<any>(null);
    const [titleError, setTitleError] = useState('');
 
    const fetchData = async () => {
        const album = await getAllAlbum();
        setAlbums(album);   
    };    
    useEffect(() =>{
        fetchData();
    },[]); 
 

    useEffect(() => {
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

    const handleCancel = () => {
        setShowForm(false);
        setNewAlbum({
            title: '',
            description: '',
            creation_date: '',
            publish_date: '',
            artist: ''
        });
    };    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewAlbum(prev => ({
            ...prev,
            [name]: value
        }));
        // Validate title khi người dùng nhập
        if (name === 'title') {
            if (!value.trim()) {
                setTitleError('Tên album không được để trống');
            } else {
                setTitleError('');
            }
        }
    };

    const handleSubmit = async () => {
        try {
            // Validate title trước khi submit
            if (!newAlbum.title.trim()) {
                setTitleError('Tên album không được để trống');
                return;
            }

            // Kiểm tra album đã tồn tại
            const isDuplicate = albums.some(album => 
                album.title.toLowerCase() === newAlbum.title.toLowerCase()
            );

            if (isDuplicate) {
                toast.error('Album này đã tồn tại trong hệ thống!');
                return;
            }

            const created = await postAlbum(newAlbum);
            setArtists(prev => [...prev, created]);
            toast.success('Thêm album thành công!');
            setShowForm(false);
            setNewAlbum({
                title: '',
                description: '',
                creation_date: '',
                publish_date: '',
                artist: ''
            }); // Reset form

            // Reload lại danh sách album
            fetchData();
        } catch (e) {
            toast.error('Có lỗi khi thêm album!');
        }
    };

    const handleEditClick = (album: any) => {
        setEditAlbum(album);
        setShowEdit(true);
       
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editAlbum) return;
        const { name, value } = e.target;
        setEditAlbum({ ...editAlbum, [name]: value });
    };

    const handleEditSave = async () => {
        if (!editAlbum) return;
        try {
            const updated = await putAlbum(editAlbum.id, editAlbum);
            setAlbums(prev => prev.map(a => (a.id === updated.id ? updated : a)));
            setShowEdit(false);
            setEditAlbum(null);
            toast.success('Cập nhật album thành công!');
        } catch (err) {
            toast.error('Có lỗi khi cập nhật album!');
        }
    };

    const handleEditCancel = () => {
        setShowEdit(false);
        setEditAlbum(null);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa album này?')) {
            try {
                await deleteAlbum(id);
                setAlbums(prev => prev.filter(album => album.id !== id));
                toast.success('Xóa album thành công!');
            } catch (error) {
                toast.error('Có lỗi khi xóa album!');
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
                        <div>
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={newAlbum.title}
                                onChange={handleInputChange}
                                className={`bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${
                                    titleError ? 'border-2 border-red-500' : ''
                                }`}
                            />
                            {titleError && (
                                <p className="text-red-500 text-sm mt-1">{titleError}</p>
                            )}
                        </div>
                        <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={newAlbum.description}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
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
                        <select
                            name="artist"
                            value={newAlbum.artist}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Chọn nghệ sĩ</option>
                            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded cursor-pointer">Cancel</button>
                        <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded cursor-pointer">Save</button>
                    </div>
                </div>
            )}

            {showEdit && editAlbum && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-lg p-8 w-full max-w-3xl shadow-lg relative">
                        <h2 className="text-xl font-bold mb-4 text-white">Edit Album</h2>
                        <input
                            type="text"
                            name="title"
                            value={editAlbum.title}
                            onChange={handleEditInputChange}
                            placeholder="Title"
                            className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            name="description"
                            value={editAlbum.description}
                            onChange={handleEditInputChange}
                            placeholder="Description"
                            className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="date"
                            name="creation_date"
                            value={editAlbum.creation_date}
                            onChange={handleEditInputChange}
                            className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="date"
                            name="publish_date"
                            value={editAlbum.publish_date}
                            onChange={handleEditInputChange}
                            className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            name="artist"
                            value={editAlbum.artist}
                            onChange={handleEditInputChange}
                            className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Chọn artist</option>
                            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
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

            <table className="table-auto min-w-full border border-gray-500">
                <thead className="bg-gray-700 text-white">
                    <tr>
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Title</th>
                        <th className="p-2 border">Description</th>
                        <th className="p-2 border">Songs Count</th>
                        <th className="p-2 border">Creation Date</th>
                        <th className="p-2 border">Publish Date</th>
                        <th className="p-2 border">Artist</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-white">
                    {filteredAlbums.map((album, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
                            <td className="p-2 border">{album.id}</td>
                            <td className="p-2 border">{album.title}</td>
                            <td className="p-2 border">{album.description}</td>
                            <td className="p-2 border">{countSongs(album.songs)}</td>
                            <td className="p-2 border">{formatDate(album.creation_date)}</td>
                            <td className="p-2 border">{formatDate(album.publish_date)}</td>
                            <td className="p-2 border">{album.artist}</td>
                            <td className="p-2 border">
                                <div className="flex gap-2 justify-center">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded cursor-pointer"
                                        onClick={() => handleEditClick(album)}
                                    >
                                        Edit
                                    </button>
                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded cursor-pointer" onClick={() => handleDelete(album.id)}>
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
