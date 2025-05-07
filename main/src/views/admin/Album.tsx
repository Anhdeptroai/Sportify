import { getAllAlbum, postAlbum, putAlbum } from '../../adminApi/albumApi';

export default function Album() {
    const [albums, setAlbums] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showForm, setShowForm] = useState(false);
    const [newAlbum, setNewAlbum] = useState({
        title: '',
        image: '',
        release_date: '',
        artist: ''
    });
    const [artists, setArtists] = useState<any[]>([]);
    const [showEdit, setShowEdit] = useState(false);
    const [editAlbum, setEditAlbum] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const album = await getAllAlbum();
            setAlbums(album);
        };
        fetchData();
    }, []);

    useEffect(() => {
        getAllArtist().then(setArtists);
    }, []);

    // Filter albums by search term
    const filteredAlbums = albums.filter(album =>
        album.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, files } = e.target as HTMLInputElement;
        if (type === 'file' && files) {
            setNewAlbum(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setNewAlbum(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            Object.entries(newAlbum).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });
            await postAlbum(formData);
            alert('Thêm album thành công!');
            setShowForm(false);
            // reload lại danh sách album
        } catch (e) {
            alert('Có lỗi khi thêm album!');
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
            setAlbums(prev => prev.map(a => a.id === updated.id ? updated : a));
            setShowEdit(false);
            setEditAlbum(null);
            alert('Cập nhật album thành công!');
        } catch (err) {
            alert('Có lỗi khi cập nhật album!');
        }
    };

    const handleEditCancel = () => {
        setShowEdit(false);
        setEditAlbum(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Name album..." 
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
                        <input
                            type="text"
                            name="image"
                            placeholder="Image Path"
                            value={newAlbum.image}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            name="release_date"
                            placeholder="Release Date"
                            value={newAlbum.release_date}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            name="artist"
                            value={newAlbum.artist}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Chọn artist</option>
                            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button onClick={() => setShowForm(false)} className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded">Cancel</button>
                        <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded">Save</button>
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
                            name="image"
                            value={editAlbum.image}
                            onChange={handleEditInputChange}
                            placeholder="Image Path"
                            className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            name="release_date"
                            value={editAlbum.release_date}
                            onChange={handleEditInputChange}
                            placeholder="Release Date"
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

            <table className="w-full table-auto border border-gray-500">
                <thead className=" bg-gray-700 text-white">
                    <tr>
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Image</th>
                        <th className="p-2 border">Title</th>
                        <th className="p-2 border">Release Date</th>
                        <th className="p-2 border">Artist</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-white">
                    {filteredAlbums.map((album, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
                            <td className="p-2 border">{album.id}</td>
                            
                            <td className="p-2 border">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                                    {album.image ? (
                                        <img
                                            src={`http://18.142.50.220/msa/track_img${album.image}`}
                                            alt={album.title}
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
                            <td className="p-2 border">{album.title}</td>
                            <td className="p-2 border">{album.release_date}</td>
                            <td className="p-2 border">{album.artist}</td>
                            <td className="p-2 border">
                                <div className="flex gap-2 justify-center">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                        onClick={() => handleEditClick(album)}
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
        </div>
    );
} 