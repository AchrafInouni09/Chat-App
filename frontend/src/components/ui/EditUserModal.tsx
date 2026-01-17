
import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: User) => void;
    user: User | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onSave, user }) => {
    const [formData, setFormData] = useState<User>({
        id: 0,
        username: '',
        email: '',
        role: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (role: string) => {
        setFormData(prev => ({ ...prev, role }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-grunge-white border-4 border-grunge-dark shadow-[8px_8px_0_#0f0f10] p-6 w-full max-w-md relative animate-in zoom-in-95 duration-200 bg-[#f0f0f0]">
                <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-grunge-accent inline-block">
                    Edit User
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter username"
                        error=""
                        required
                    />

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        error=""
                        required
                    />

                    <div className="flex flex-col gap-1">
                        <label className="uppercase font-bold text-grunge-gray text-xs block mb-1">
                            Role
                        </label>
                        <div className="flex gap-2">
                            {['user', 'admin'].map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => handleRoleChange(role)}
                                    className={`
                                        flex-1 py-2 font-mono font-bold uppercase border-2 
                                        transition-all cursor-pointer
                                        ${formData.role === role
                                            ? 'bg-grunge-dark text-grunge-white border-grunge-dark'
                                            : 'bg-transparent text-grunge-dark border-grunge-dark hover:bg-grunge-dark/10'}
                                    `}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="ghost" onClick={onClose} type="button">
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
