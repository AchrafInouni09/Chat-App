
import { useState } from 'react';
import Nav from './ui/Nav';
import UserTable from './ui/UserTable';
import EditUserModal from './ui/EditUserModal';
import Button from './ui/Button';
import { UserPlus } from 'lucide-react';
import CryptoHover from './ui/CryptoHover';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

const MOCK_USERS: User[] = [
    { id: 1, username: 'neo_anderson', email: 'neo@matrix.com', role: 'admin' },
    { id: 2, username: 'trinity_files', email: 'trinity@matrix.com', role: 'admin' },
    { id: 3, username: 'morpheus_dream', email: 'morpheus@zion.com', role: 'user' },
    { id: 4, username: 'cypher_ignore', email: 'cypher@matrix.com', role: 'user' },
    { id: 5, username: 'agent_smith', email: 'smith@agents.com', role: 'admin' },
];

const AdminDashboard = () => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const handleEditUser = (user: User) => {
        setCurrentUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteUser = (id: number) => {
        if (window.confirm('ARE YOU SURE YOU WANT TO DELETE THIS USER?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleSaveUser = (updatedUser: User) => {
        if (updatedUser.id === 0) {
            const newUser = { ...updatedUser, id: Math.max(...users.map(u => u.id)) + 1 };
            setUsers([...users, newUser]);
        } else {
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        }
        setIsModalOpen(false);
        setCurrentUser(null);
    };

    const handleAddUser = () => {
        setCurrentUser({ id: 0, username: '', email: '', role: 'user' });
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#f0f0f0] font-sans pb-20">
            <Nav />

            <main className="container mx-auto px-4 pt-10 max-w-5xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <CryptoHover text="Admin" className="text-5xl font-black uppercase tracking-tighter text-grunge-dark mb-2"/>
                        <CryptoHover text="Panel" className="text-5xl font-red uppercase tracking-tighter text-grunge-accent"/>
                        <p className="font-mono text-grunge-gray font-bold">
                            // MANAGE SYSTEM USERS AND PRIVILEGES
                        </p>
                    </div>

                    <Button
                        onClick={handleAddUser}
                        className="flex items-center gap-3 px-6 py-3 shadow-[5px_5px_0_#0f0f10] hover:shadow-[8px_8px_0_#0f0f10] hover:-translate-y-1 transition-all duration-300"
                    >
                        <UserPlus size={20} strokeWidth={2.5} />
                        Add New User
                    </Button>
                </div>

                <UserTable
                    users={users}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                />
            </main>

            <EditUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveUser}
                user={currentUser}
            />
        </div>
    );
};

export default AdminDashboard;
