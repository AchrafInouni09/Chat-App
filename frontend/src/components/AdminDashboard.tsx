
import { useState } from 'react';
import Nav from './ui/Nav';
import UserTable from './ui/UserTable';
import EditUserModal from './ui/EditUserModal';
import AddUserModal from './ui/AddUserModal';
import Button from './ui/Button';
import { UserPlus } from 'lucide-react';
import CryptoHover from './ui/CryptoHover';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

interface User {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    confirmPassword?: string;
    role: string;
}

const AdminDashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);


    useEffect(() => {
        const featchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('token')}`
                    },
                });
                const data = await response.json();
                console.log(data);
                setUsers(data.users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        featchData();
    }, []);


    const handleDeleteUser = (id: number) => {
        if (window.confirm('ARE YOU SURE YOU WANT TO DELETE THIS USER?')) {
            const deleteData = async () => {
                try {
                    const response = await fetch('http://localhost:3000/api/users/' + id, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${Cookies.get('token')}`
                        },
                    });
                    const data = await response.json();
                    console.log(data);
                    window.location.reload();
                } catch (error) {
                    console.error('Error deleting user:', error);
                }
            }
            deleteData();
        }
    };

    const handleUpdateUser = async (updatedUser: User) => {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${updatedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                },
                body: JSON.stringify(updatedUser)
            });

            if (response.ok) {
                setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
                setIsEditModalOpen(false);
                setCurrentUser(null);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleAddUser = async (newUser: any) => {
        console.log(newUser);
        if (newUser.password !== newUser.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                },
                body: JSON.stringify(
                    {
                        firstname: newUser.firstName,
                        lastname: newUser.lastName,
                        username: newUser.username,
                        email: newUser.email,
                        password: newUser.password,
                        role: newUser.role
                    }
                )
            });
            const data = await response.json();
            console.log(data);
            window.location.reload();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };


    return (
        <div className="min-h-screen bg-[#f0f0f0] font-sans pb-20">
            <Nav />

            <main className="container mx-auto px-4 pt-10 max-w-5xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <CryptoHover text="Admin" className="text-5xl font-black uppercase tracking-tighter text-grunge-dark mb-2" />
                        <CryptoHover text="Panel" className="text-5xl font-red uppercase tracking-tighter text-grunge-accent" />
                        <p className="font-mono text-grunge-gray font-bold">
                            // MANAGE SYSTEM USERS AND PRIVILEGES
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-3 px-6 py-3 shadow-[5px_5px_0_#0f0f10] hover:shadow-[8px_8px_0_#0f0f10] hover:-translate-y-1 transition-all duration-300"
                    >
                        <UserPlus size={20} strokeWidth={2.5} />
                        Add New User
                    </Button>
                </div>

                <UserTable
                    users={users}
                    onEdit={(user) => {
                        setCurrentUser(user);
                        setIsEditModalOpen(true);
                    }}
                    onDelete={handleDeleteUser}
                />
            </main>

            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setCurrentUser(null);
                }}
                onSave={handleUpdateUser}
                user={currentUser}
            />

            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddUser}
            />
        </div>
    );
};

export default AdminDashboard;
