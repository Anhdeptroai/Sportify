import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../controllers/authContext';
import { PlaylistContext } from '../controllers/playlistContext';

function Sidebar() {
    const { playlists, createPlaylist, deletePlaylist, filterPlaylistsByUser, fetchPlaylists } = useContext(PlaylistContext);
    const { user, loading } = useContext(AuthContext);
    const [showChat, setShowChat] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [playlistName, setPlaylistName] = useState('');
    const [creating, setCreating] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Array<{text: string, isBot: boolean}>>([]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Lọc playlist theo người dùng hiện tại
    const userPlaylists = user && user.id ? filterPlaylistsByUser(user.id) : [];

    // Debug logs
    useEffect(() => {
        console.log('Sidebar: Current user:', user);
        console.log('Sidebar: All playlists:', playlists);
        console.log('Sidebar: Filtered playlists:', userPlaylists);
    }, [user, playlists, userPlaylists]);

    // Fetch playlists when user changes
    useEffect(() => {
        if (user && user.id) {
            console.log('Sidebar: Fetching playlists for user:', user.id);
            fetchPlaylists();
        }
    }, [user, fetchPlaylists]);

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;
        
        // Add user message
        setMessages(prev => [...prev, { text: inputMessage, isBot: false }]);
        
        // Simulate bot response
        setTimeout(() => {
            const botResponse = getBotResponse(inputMessage);
            setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
        }, 500);
        
        setInputMessage('');
    };

    const getBotResponse = (message: string): string => {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('chào')) {
            return 'Xin chào! Tôi có thể giúp gì cho bạn?';
        }
        if (lowerMessage.includes('playlist') || lowerMessage.includes('danh sách')) {
            return 'Bạn có thể tạo playlist mới bằng cách nhấn vào nút + ở góc phải trên cùng.';
        }
        if (lowerMessage.includes('xóa') || lowerMessage.includes('delete')) {
            return 'Để xóa playlist, hãy nhấn vào nút Xóa bên cạnh playlist đó.';
        }
        if (lowerMessage.includes('cảm ơn') || lowerMessage.includes('thanks')) {
            return 'Không có gì! Rất vui được giúp đỡ bạn.';
        }
        
        return 'Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi về cách tạo playlist, xóa playlist hoặc các tính năng khác.';
    };

    const handleCreatePlaylist = async () => {
        if (!playlistName.trim()) return;
        setCreating(true);
        try {
            console.log('Sidebar: Creating playlist:', playlistName);
            await createPlaylist(playlistName, 'public');
            setPlaylistName('');
            setShowCreateModal(false);
            toast.success('Tạo playlist thành công');
        } catch (error) {
            console.error('Sidebar: Error creating playlist:', error);
            if (error instanceof Error && error.message === 'Playlist name already exists') {
                toast.error('Tên playlist đã tồn tại');
            } else {
                toast.error('Lỗi khi tạo playlist');
            }
        } finally {
            setCreating(false);
        }
    };

    const handlePlaylistClick = (playlistId: number) => {
        console.log('Sidebar: Clicking playlist:', playlistId);
        navigate(`/playlist/${playlistId}`);
    };

    const handleDeletePlaylist = async (playlistId: number) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa playlist này?')) return;
        setDeletingId(playlistId);
        try {
            console.log('Sidebar: Deleting playlist:', playlistId);
            await deletePlaylist(playlistId);
            toast.success('Đã xóa playlist!');
            if (window.location.pathname === `/playlist/${playlistId}`) {
                navigate('/playlist');
            }
        } catch (error) {
            console.error('Sidebar: Error deleting playlist:', error);
            toast.error('Xóa playlist thất bại!');
        } finally {
            setDeletingId(null);
        }
    };

    const handleFavouriteClick = () => {
        navigate(`/favourite`);
    };

    return (
        <div className="bg-gray-800 h-[calc(100vh-23vh)] w-150 m-2 rounded-2xl text-white relative">
            {/* Chat button */}
            <button
                className="fixed bottom-32 left-8 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white hover:bg-green-600 transition-colors text-2xl"
                onClick={() => setShowChat((v) => !v)}
                title="Chatbot"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.25)' }}
            >
                <i className="fas fa-comments"></i>
            </button>
            {/* Chatbox */}
            {showChat && (
                <div className="fixed bottom-48 left-15 z-50 w-80 bg-white text-black rounded-xl shadow-2xl p-4 flex flex-col border border-gray-300 animate-fade-in">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold">Chatbot</span>
                        <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-red-500">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div className="flex-1 min-h-[200px] max-h-[300px] overflow-y-auto mb-4">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-2 p-2 rounded-lg ${
                                    msg.isBot 
                                        ? 'bg-gray-100 ml-0' 
                                        : 'bg-green-500 text-white ml-auto'
                                } max-w-[80%]`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            )}
            <div className="p-4">
                <div className="flex relative">
                    <h2 className="text-xl font-bold mb-5">Danh sách yêu thích</h2>
                    
                </div>
                <div 
                    onClick={() => handleFavouriteClick()}
                    className="bg-gray-900 p-4 rounded-lg mb-4 flex items-center justify-between cursor-pointer hover:bg-gray-700 transition-colors"
                >
                    <div className="flex-1">
                        <h3 className="font-bold">Yêu thích</h3>
                    </div>                        
                </div>

                <div className="flex relative">
                    <h2 className="text-xl font-bold mb-5">Danh sách phát</h2>
                    {/* Nút tạo playlist */}
                    <button
                        className="absolute fab fa-plus text-white right-2 p-2 hover:bg-gray-700 hover:rounded-2qxl"
                        onClick={() => setShowCreateModal(true)}
                        title="Tạo playlist mới"
                    ></button>
                </div>
                <div className="h-[calc(100vh-75vh)] overflow-y-auto">
                    {loading ? (
                        <div className="bg-gray-900 p-4 rounded-lg mb-4 text-center">
                            <h3 className="font-bold">Đang tải...</h3>
                        </div>
                    ) : (!user || !user.id) ? (
                        <div className="bg-gray-900 p-4 rounded-lg mb-4">
                            <h3 className="font-bold">Vui lòng đăng nhập</h3>
                            <p className="text-sm text-gray-400">Đăng nhập để xem và tạo playlist của bạn</p>
                        </div>
                    ) : userPlaylists.length === 0 ? (
                        <div className="bg-gray-900 p-4 rounded-lg mb-4">
                            <h3 className="font-bold">Tạo danh sách phát đầu tiên của bạn</h3>
                            <p className="text-sm text-gray-400">Rất dễ! Chúng tôi sẽ giúp bạn</p>
                            <button
                                className="mt-2 px-4 py-1 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
                                onClick={() => setShowCreateModal(true)}
                            >
                                Tạo danh sách phát
                            </button>
                        </div>
                    ) : (
                        userPlaylists.map((playlist) => (
                            <div
                                key={playlist.id}
                                className="bg-gray-900 p-4 rounded-lg mb-4 flex items-center justify-between cursor-pointer hover:bg-gray-700 transition-colors"
                            >
                                <div onClick={() => handlePlaylistClick(playlist.id)} className="flex-1">
                                    <h3 className="font-bold">{playlist.title}</h3>
                                </div>
                                <button
                                    className="ml-2 px-2 py-1 bg-white-400 text-white rounded hover:bg-white-700 text-xs"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePlaylist(playlist.id);
                                    }}
                                    disabled={deletingId === playlist.id}
                                    title="Xóa playlist"
                                >
                                    {deletingId === playlist.id ? 'Đang xóa...' : 'Xóa'}
                                </button>
                            </div>
                        ))
                    )}
                </div>
                <div className="mt-5 text-sm text-gray-400">
                    <p>Pháp lý • Quyền riêng tư • Cookie</p>
                </div>
            </div>
            {/* Modal tạo playlist */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl p-8 w-96 flex flex-col items-center">
                        <h2 className="text-xl font-bold mb-4 text-black">Tạo Playlist mới</h2>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-green-500 text-black"
                            placeholder="Nhập tên playlist"
                            value={playlistName}
                            onChange={e => setPlaylistName(e.target.value)}
                            autoFocus
                        />
                        <div className="flex gap-2 w-full">
                            <button
                                className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                                onClick={handleCreatePlaylist}
                                disabled={creating || !playlistName.trim()}
                            >
                                {creating ? 'Đang tạo...' : 'Hoàn thành'}
                            </button>
                            <button
                                className="flex-1 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
                                onClick={() => setShowCreateModal(false)}
                                disabled={creating}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Sidebar;