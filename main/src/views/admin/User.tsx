import React, { useEffect, useState } from 'react';
import { getAllUsers, postUser, putUser } from '../../adminApi/userApi'; // Adjust the import path as necessary
import axios from 'axios';

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
    const [editUser, setEditUser] = useState<any>(null);
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const user = await getAllUsers(); // Assuming this function fetches user data
            setUsers(user);
        };
        fetchData();
    }, []);

    // Filter users by email
    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        try {
            const created = await postUser(newUser);
            setUsers(prev => [...prev, created]);
            alert('Thêm user thành công!');
            handleCancel();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error adding user:', error.response?.data);
            } else {
                console.error('Error adding user:', error);
            }
        }
    };

    const handleEditClick = (user: any) => {
        setEditUser({
            ...user,
            first_name: user.first_name ?? '',
            last_name: user.last_name ?? '',
            subscription_type: user.subscription_type ?? '',
            profile_picture: user.profile_picture ?? '',
            followees_count: user.followees_count ?? 0
        });
        setShowEditForm(true);
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditUser((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async () => {
        try {
            const updateData = {
                email: editUser.email ?? '',
                first_name: editUser.first_name ?? '',
                last_name: editUser.last_name ?? '',
                profile_picture: editUser.profile_picture ?? '',
                followees_count: Number(editUser.followees_count) || 0,
                subscription_type: editUser.subscription_type ?? ''
            };
            await putUser(editUser.id, updateData);
            alert('Lưu user thành công!');
            setShowEditForm(false);
            setEditUser(null);
            const userList = await getAllUsers();
            setUsers(userList);
        } catch (error) {
            alert('Có lỗi khi cập nhật user!');
        }
    };

    const handleEditCancel = () => {
        setShowEditForm(false);
        setEditUser(null);
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
                    <h3 className="text-lg mb-4">Add New User</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text" name="email" placeholder="Email" value={newUser.email}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password" name="password" placeholder="Password" value={newUser.password}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text" name="first_name" placeholder="First Name" value={newUser.first_name}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text" name="last_name" placeholder="Last Name" value={newUser.last_name}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text" name="profile_picture" placeholder="Profile Picture Path" value={newUser.profile_picture}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="number" name="followees_count" placeholder="Followees Count" value={newUser.followees_count}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text" name="subscription_type" placeholder="Subscription Type" value={newUser.subscription_type}
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
                                                src={`http://18.142.50.220/msa/user${user.profile_picture}`}
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
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                        onClick={() => handleEditClick(user)}
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

            {showEditForm && editUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <h3 className="text-lg mb-4 text-white">Edit User</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                value={editUser.email}
                                onChange={handleEditInputChange}
                                className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                value={editUser.first_name ?? ''}
                                onChange={handleEditInputChange}
                                className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                value={editUser.last_name ?? ''}
                                onChange={handleEditInputChange}
                                className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                name="profile_picture"
                                placeholder="Profile Picture Path"
                                value={editUser.profile_picture ?? ''}
                                onChange={handleEditInputChange}
                                className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                name="followees_count"
                                placeholder="Followees Count"
                                value={editUser.followees_count ?? 0}
                                onChange={handleEditInputChange}
                                className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                name="subscription_type"
                                placeholder="Subscription Type"
                                value={editUser.subscription_type ?? ''}
                                onChange={handleEditInputChange}
                                className="bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={handleEditCancel}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSubmit}
                                className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
