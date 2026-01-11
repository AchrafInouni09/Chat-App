
import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto border-4 border-grunge-dark shadow-[8px_8px_0_#0f0f10] bg-white">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-grunge-dark text-grunge-white">
                        <th className="p-4 font-black uppercase text-sm border-r-2 border-grunge-white/20">ID</th>
                        <th className="p-4 font-black uppercase text-sm border-r-2 border-grunge-white/20">Username</th>
                        <th className="p-4 font-black uppercase text-sm border-r-2 border-grunge-white/20">Email</th>
                        <th className="p-4 font-black uppercase text-sm border-r-2 border-grunge-white/20">Role</th>
                        <th className="p-4 font-black uppercase text-sm">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y-2 divide-grunge-dark">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-yellow-50 transition-colors font-mono group">
                            <td className="p-4 border-r-2 border-grunge-dark font-bold">#{user.id}</td>
                            <td className="p-4 border-r-2 border-grunge-dark group-hover:text-grunge-accent transition-colors">{user.username}</td>
                            <td className="p-4 border-r-2 border-grunge-dark">{user.email}</td>
                            <td className="p-4 border-r-2 border-grunge-dark">
                                <span className={`
                                    px-2 py-1 text-xs font-bold uppercase border-2 border-grunge-dark
                                    ${user.role === 'admin' ? 'bg-grunge-accent text-white' : 'bg-gray-200 text-grunge-dark'}
                                `}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="p-2 border-2 border-grunge-dark hover:bg-grunge-dark hover:text-white transition-all active:translate-y-1 cursor-pointer"
                                        title="Edit User"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(user.id)}
                                        className="p-2 border-2 border-grunge-dark hover:bg-grunge-accent hover:border-grunge-accent hover:text-white transition-all active:translate-y-1 cursor-pointer"
                                        title="Delete User"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-8 text-center font-bold text-grunge-gray uppercase">
                                No users found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
