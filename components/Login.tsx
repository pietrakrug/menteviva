
import React, { useState } from 'react';
import { MenteVivaIcon } from './icons';
import { api } from '../services/api';
import { User } from '../types';
import Card from './ui/Card';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      cpf: '',
      birthDate: '',
      whatsapp: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        if (isRegistering) {
            if (formData.password !== formData.confirmPassword) {
                throw new Error("As senhas não coincidem.");
            }
            const { email, password, confirmPassword, ...registrationData } = formData;
            if(!registrationData.fullName || !registrationData.cpf || !registrationData.birthDate || !registrationData.whatsapp || !email || !password) {
                throw new Error("Todos os campos são obrigatórios.");
            }
            const newUser = await api.register({ email, ...registrationData });
            onLogin(newUser);
        } else {
            const user = await api.login(formData.email);
            if (user) {
                onLogin(user);
            } else {
                throw new Error("Email ou senha inválidos.");
            }
        }
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="flex items-center space-x-3 mb-8">
            <MenteVivaIcon className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold text-primary">Mente Viva</h1>
        </div>

        <Card className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                {isRegistering ? 'Crie sua Conta' : 'Acesse sua Conta'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {isRegistering && (
                    <>
                        <input name="fullName" type="text" placeholder="Nome Completo" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                        <input name="cpf" type="text" placeholder="CPF" value={formData.cpf} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                        <input name="birthDate" type="date" placeholder="Data de Nascimento" value={formData.birthDate} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                        <input name="whatsapp" type="text" placeholder="WhatsApp" value={formData.whatsapp} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                    </>
                )}
                <input name="email" type="email" value={formData.email} placeholder="Email" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                <input name="password" type="password" placeholder="Senha" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                {isRegistering && (
                     <input name="confirmPassword" type="password" placeholder="Confirme a Senha" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                )}

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button type="submit" disabled={loading} className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors disabled:bg-gray-400">
                    {loading ? 'Carregando...' : (isRegistering ? 'Cadastrar' : 'Entrar')}
                </button>
            </form>
             <p className="text-center text-sm text-gray-600 mt-6">
                {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}
                <button onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="font-semibold text-primary hover:underline ml-1">
                    {isRegistering ? 'Faça login' : 'Cadastre-se'}
                </button>
            </p>
        </Card>
    </div>
  );
};

export default Login;
