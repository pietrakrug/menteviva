
import React, { useRef, useState } from 'react';
import { User as UserIcon, Calendar, Mail, FileText, Camera, LogOut, Trash2, AlertTriangle } from 'lucide-react';
import Card from './ui/Card';
import { User } from '../types';
import { api } from '../services/api';

const InfoRow: React.FC<{ icon: React.ElementType, label: string, value: string }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-4 p-3 border-b border-gray-100">
        <Icon className="text-primary h-6 w-6 mt-1" />
        <div>
            <p className="text-sm font-semibold text-gray-500">{label}</p>
            <p className="text-lg text-gray-800">{value}</p>
        </div>
    </div>
);

const ResetHabitModal: React.FC<{ onConfirm: () => void; onCancel: () => void; loading: boolean; }> = ({ onConfirm, onCancel, loading }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
            <div className="text-center">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800">Você tem certeza?</h3>
                <p className="text-gray-600 mt-2">
                    Esta ação é irreversível. Você perderá seu hábito atual e todo o histórico de check-ins associado a ele.
                </p>
            </div>
            <div className="flex justify-center space-x-4 mt-8">
                <button onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300">
                    Cancelar
                </button>
                <button onClick={onConfirm} disabled={loading} className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 disabled:bg-red-400">
                    {loading ? 'Resetando...' : 'Sim, resetar'}
                </button>
            </div>
        </Card>
    </div>
);


const Profile: React.FC<{ user: User; onUpdateUser: (user: User) => void; onLogout: () => void; onHabitReset: () => void; }> = ({ user, onUpdateUser, onLogout, onHabitReset }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isResetModalOpen, setResetModalOpen] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const updatedUser = { ...user, avatarUrl: base64String };
                api.updateUser(updatedUser).then(onUpdateUser);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleConfirmReset = async () => {
        setIsResetting(true);
        try {
            const habits = await api.getHabits(user.id);
            if (habits.length > 0) {
                await api.deleteHabit(habits[0].id, user.id);
            }
            onHabitReset();
        } catch (error) {
            console.error("Failed to reset habit:", error);
            // Optionally show an error message to the user
        } finally {
            setIsResetting(false);
            setResetModalOpen(false);
        }
    };

    return (
        <div className="space-y-6">
            {isResetModalOpen && <ResetHabitModal onConfirm={handleConfirmReset} onCancel={() => setResetModalOpen(false)} loading={isResetting} />}

            <h1 className="text-4xl font-bold text-gray-800">Meu Perfil</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <img 
                                    src={user.avatarUrl || `https://i.pravatar.cc/120?u=${user.email}`} 
                                    alt="User Avatar" 
                                    className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-white shadow-lg" 
                                />
                                <button 
                                    onClick={handleAvatarClick}
                                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity duration-300"
                                >
                                    <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    accept="image/png, image/jpeg, image/webp"
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 text-center">{user.fullName}</h2>
                            <p className="text-gray-500">{user.email}</p>
                        </div>
                    </Card>
                    <Card title="Ações da Conta">
                        <div className="space-y-3">
                            <button
                                onClick={() => setResetModalOpen(true)}
                                className="w-full flex items-center justify-center space-x-2 bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
                            >
                                <Trash2 size={18} />
                                <span>Resetar Hábito Atual</span>
                            </button>
                             <button
                                onClick={onLogout}
                                className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                <LogOut size={18} />
                                <span>Sair</span>
                            </button>
                        </div>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <Card title="Informações da Conta">
                       <div className="space-y-2">
                            <InfoRow icon={UserIcon} label="Nome Completo" value={user.fullName} />
                            <InfoRow icon={Mail} label="Email" value={user.email} />
                            <InfoRow icon={FileText} label="CPF" value={user.cpf} />
                            <InfoRow icon={Calendar} label="Data de Nascimento" value={new Date(user.birthDate).toLocaleDateString('pt-BR')} />
                       </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
