
import React, { useState, useEffect } from 'react';
import { Download, Filter } from 'lucide-react';
import Card from './ui/Card';
import { api } from '../services/api';
import { Checkin, ExecutionStatus, DifficultyMoment, User } from '../types';

const statusStyles: { [key in ExecutionStatus]: string } = {
    [ExecutionStatus.COMPLETED]: 'bg-green-100 text-green-800',
    [ExecutionStatus.PARTIAL]: 'bg-yellow-100 text-yellow-800',
    [ExecutionStatus.MISSED]: 'bg-red-100 text-red-800',
};

// FIX: Added missing enum member DifficultyMoment.NONE to the object.
const momentIcons: { [key in DifficultyMoment]: string } = {
    [DifficultyMoment.MORNING]: '🌅',
    [DifficultyMoment.AFTERNOON]: '☀️',
    [DifficultyMoment.NIGHT]: '🌙',
    [DifficultyMoment.NONE]: '😊',
};

const CheckinRow: React.FC<{ checkin: Checkin }> = ({ checkin }) => (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
        <td className="py-3 px-4 text-gray-700">{new Date(checkin.checkinDate).toLocaleDateString('pt-BR')}</td>
        <td className="py-3 px-4">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[checkin.executionStatus]}`}>
                {checkin.executionStatus}
            </span>
        </td>
        <td className="py-3 px-4 text-gray-600">{momentIcons[checkin.difficultyMoment]} {checkin.difficultyMoment}</td>
        <td className="py-3 px-4 text-gray-600">{checkin.sabotageType}</td>
        <td className="py-3 px-4 text-gray-600">{checkin.motivationType}</td>
        <td className="py-3 px-4 text-gray-600">{checkin.energyLevel}</td>
    </tr>
);

const HistoryView: React.FC<{ user: User }> = ({ user }) => {
    const [checkins, setCheckins] = useState<Checkin[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const allHabits = await api.getHabits(user.id);
                if(allHabits.length > 0) {
                    const checkinsData = await api.getCheckins(allHabits[0].id);
                    setCheckins(checkinsData.sort((a, b) => new Date(b.checkinDate).getTime() - new Date(a.checkinDate).getTime()));
                }
            } catch (error) {
                console.error("Failed to fetch history data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.id]);

    if (loading) {
        return <div className="text-center p-10">Carregando histórico...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-gray-800">Histórico de Check-ins</h1>
                <div className="flex space-x-2">
                    <button className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                        <Filter size={18} />
                        <span>Filtrar</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors">
                        <Download size={18} />
                        <span>Baixar CSV</span>
                    </button>
                </div>
            </div>

            <Card className="overflow-x-auto">
                {checkins.length > 0 ? (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-3 px-4 font-semibold text-gray-600">Data</th>
                                <th className="py-3 px-4 font-semibold text-gray-600">Execução</th>
                                <th className="py-3 px-4 font-semibold text-gray-600">Dificuldade</th>
                                <th className="py-3 px-4 font-semibold text-gray-600">Sabotagem</th>
                                <th className="py-3 px-4 font-semibold text-gray-600">Motivação</th>
                                <th className="py-3 px-4 font-semibold text-gray-600">Energia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {checkins.map(checkin => <CheckinRow key={checkin.id} checkin={checkin} />)}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-500 py-10">Nenhum check-in encontrado.</p>
                )}
            </Card>
        </div>
    );
};

export default HistoryView;