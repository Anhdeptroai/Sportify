import React, { useEffect, useState } from 'react';
import { getAllUsers, postUser, deleteUser } from '../../adminApi/userApi'; // Adjust the import path as necessary
import { toast } from 'react-toastify';

export default function User() {
    const [users, setUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showForm, setShowForm] = useState<boolean>(false);
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        profile_picture: '',
        followees_count: 0,
        subscription_type: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        profile_picture: '',
        followees_count: '',
        subscription_type: ''
    });

    const fetchData = async () => {
        const user = await getAllUsers();
        setUsers(user);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter users by email
    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const validateForm = () => {
        let newErrors = {
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            profile_picture: '',
            followees_count: '',
            subscription_type: ''
        };
        let isValid = true;

        // Validate email
        if (!newUser.email.trim()) {
            newErrors.email = "Vui lòng nhập email";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
            newErrors.email = "Email không hợp lệ";
            isValid = false;
        }

        // Validate password
        if (!newUser.password) {
            newErrors.password = "Vui lòng nhập mật khẩu";
            isValid = false;
        } else if (newUser.password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
            isValid = false;
        }

        // Validate first name
        if (!newUser.first_name.trim()) {
            newErrors.first_name = "Vui lòng nhập tên";
            isValid = false;
        }

        // Validate last name
        if (!newUser.last_name.trim()) {
            newErrors.last_name = "Vui lòng nhập họ";
            isValid = false;
        }

        // Validate followees count
        if (newUser.followees_count < 0) {
            newErrors.followees_count = "Số lượng người theo dõi không thể âm";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    const handleAddClick = () => setShowForm(true);

    const handleCancel = () => {
        setShowForm(false);
        setNewUser({
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            profile_picture: '',
            followees_count: 0,
            subscription_type: ''
        });
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return; // Nếu không hợp lệ, không gửi dữ liệu
        }

        try {
            const created = await postUser(newUser);
            setUsers(prev => [...prev, created]);
            toast.success('Thêm user thành công!');
            handleCancel();
            fetchData();
        } catch (error) {
            toast.error('user đã tồn tại!');
        }
    };

    const handleDelete = async (id: number) => {
        if(window.confirm("Bạn có muốn xóa user này không?")) {
            try{
                await deleteUser(id);
                setUsers(prev => prev.filter(user => user.id !== id));
                toast.success('Xóa user thành công!');
            }catch{
                toast.error('Có lỗi khi xóa user!');
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
                            placeholder="Search users by email..." 
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
                 
                <button onClick={handleAddClick} className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer">
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
                    Add User
                </button>
            </div>

            {showForm && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-4">
                    <h3 className="text-lg mb-4 text-white font-bold">Add New User</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="text" name="email" placeholder="Email" value={newUser.email}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                        {errors.email && <span className="text-red-500">{errors.email}</span>}
                        <input
                            type="password" name="password" placeholder="Password" value={newUser.password}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                        {errors.password && <span className="text-red-500">{errors.password}</span>}
                        <input
                            type="text" name="first_name" placeholder="First Name" value={newUser.first_name}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                        {errors.first_name && <span className="text-red-500">{errors.first_name}</span>}
                        <input
                            type="text" name="last_name" placeholder="Last Name" value={newUser.last_name}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                        {errors.last_name && <span className="text-red-500">{errors.last_name}</span>}
                        <input
                            type="text" name="profile_picture" placeholder="Profile Picture Path" value={newUser.profile_picture}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                        {errors.profile_picture && <span className="text-red-500">{errors.profile_picture}</span>}
                        <input
                            type="number" name="followees_count" placeholder="Followees Count" value={newUser.followees_count}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                        {errors.followees_count && <span className="text-red-500">{errors.followees_count}</span>}
                        <input
                            type="text" name="subscription_type" placeholder="Subscription Type" value={newUser.subscription_type}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                        {errors.subscription_type && <span className="text-red-500">{errors.subscription_type}</span>}
                    </div>
                    <div className="mt-4 flex justify-end gap-4">
                        <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded transition duration-200 cursor-pointer">Cancel</button>
                        <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-6 rounded transition duration-200 cursor-pointer">Save</button>
                    </div>
                </div>
            )}

            <table className="table-auto min-w-full border border-gray-500">
                <thead className="bg-gray-700 text-white">
                    <tr>
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">First Name</th>
                        <th className="p-2 border">Last Name</th>
                        <th className="p-2 border">Profile Picture</th>
                        <th className="p-2 border">Followees Count</th>
                        <th className="p-2 border">Subscription Type</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-white">
                    {filteredUsers.map((user, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
                            <td className="p-2 border">{user.id}</td>
                            <td className="p-2 border">{user.email}</td>
                            <td className="p-2 border">{user.first_name || '—'}</td>
                            <td className="p-2 border">{user.last_name || '—'}</td>
                            <td className="p-2 border">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                                    {user.profile_picture ? (
                                        <>
                                            <img
                                                src={`http://13.215.205.59/msa/user${user.profile_picture}`}
                                                alt={`${user.first_name} ${user.last_name}`}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
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
                            <td className="p-2 border">{user.followees_count}</td>
                            <td className="p-2 border">{user.subscription_type || '—'}</td>
                            <td className="p-2 border">
                                <div className="flex gap-2 justify-center">
                           
                                    <button 
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded cursor-pointer"
                                        onClick={() => handleDelete(user.id)}
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
