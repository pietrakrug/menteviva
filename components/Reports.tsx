import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, CloudDrizzle, ShieldOff, Lightbulb, Zap, Brain, MousePointerClick, BatteryWarning, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import Card from './ui/Card';
import { api } from '../services/api';
import { Checkin, ExecutionStatus, DifficultyMoment, SabotageType, MotivationType, User } from '../types';

const SabotageIcon: React.FC<{ type: SabotageType }> = ({ type }) => {
    switch (type) {
        case SabotageType.INTERNAL: return <Brain className="w-5 h-5 text-red-500" />;
        case SabotageType.EXTERNAL: return <MousePointerClick className="w-5 h-5 text-orange-500" />;
        case SabotageType.ENERGY: return <BatteryWarning className="w-5 h-5 text-yellow-500" />;
        case SabotageType.SOCIAL: return <Users className="w-5 h-5 text-purple-500" />;
        default: return <ShieldOff className="w-5 h-5 text-gray-400" />;
    }
};
const sabotageDisplay: Record<SabotageType, { label: string; color: string; }> = {
    [SabotageType.INTERNAL]: { label: 'Mental/Emocional', color: 'bg-red-500' },
    [SabotageType.EXTERNAL]: { label: 'Distrações Externas', color: 'bg-orange-500' },
    [SabotageType.ENERGY]: { label: 'Falta de Energia', color: 'bg-yellow-500' },
    [SabotageType.SOCIAL]: { label: 'Influência Social', color: 'bg-purple-500' },
    [SabotageType.NONE]: { label: 'Nenhuma', color: 'bg-gray-400' },
};


const Reports: React.FC<{ user: User }> = ({ user }) => {
    const [checkins, setCheckins] = useState<Checkin[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const allHabits = await api.getHabits(user.id);
                if(allHabits.length > 0) {
                    const checkinsData = await api.getCheckins(allHabits[0].id);
                    setCheckins(checkinsData);
                }
            } catch (error) {
                console.error("Failed to fetch reports data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.id]);
    
    const { 
        executionPieData, 
        difficultyBarData, 
        sabotageBreakdown, 
        motivationPieData,
        quickInsight,
    } = useMemo(() => {
        if (checkins.length === 0) {
            return { executionPieData: [], difficultyBarData: [], sabotageBreakdown: [], motivationPieData: [], quickInsight: 'Faça seu primeiro check-in para ver os relatórios.' };
        }

        const executionData = checkins.reduce((acc, c) => {
            acc[c.executionStatus] = (acc[c.executionStatus] || 0) + 1;
            return acc;
        }, {} as Record<ExecutionStatus, number>);

        const difficultyData = checkins.reduce((acc, c) => {
            if(c.executionStatus !== ExecutionStatus.COMPLETED && c.difficultyMoment !== DifficultyMoment.NONE){
                 acc[c.difficultyMoment] = (acc[c.difficultyMoment] || 0) + 1;
            }
            return acc;
        }, {} as Record<DifficultyMoment, number>);
        
        const sabotageData = checkins.reduce((acc, c) => {
            if (c.sabotageType !== SabotageType.NONE) {
                acc[c.sabotageType] = (acc[c.sabotageType] || 0) + 1;
            }
            return acc;
        }, {} as Record<SabotageType, number>);

        const motivationData = checkins.reduce((acc, c) => {
             if (c.motivationType !== MotivationType.NOT_APPLICABLE) {
                acc[c.motivationType] = (acc[c.motivationType] || 0) + 1;
            }
            return acc;
        }, {} as Record<MotivationType, number>);

        const getMostFrequent = (data: Record<string, number>) => {
            if (Object.keys(data).length === 0) return null;
            return Object.entries(data).sort((a, b) => b[1] - a[1])[0];
        };

        const totalSabotages = Object.values(sabotageData).reduce((sum, count) => sum + count, 0);
        
        let insightMessage = "Seus padrões estão começando a emergir. Continue focado e observe como seus sentimentos e o ambiente impactam seu hábito.";

        if (checkins.length < 3) {
            insightMessage = 'Continue registrando seus check-ins para receber insights personalizados sobre sua jornada!';
        } else {
            const mostDifficult = getMostFrequent(difficultyData);
            const mostSabotage = getMostFrequent(sabotageData);
            
            if (mostDifficult && mostSabotage) {
                const moment = mostDifficult[0].toLowerCase();
                const sabotageLabel = sabotageDisplay[mostSabotage[0] as SabotageType].label.toLowerCase();
                insightMessage = `Parece que seu maior desafio acontece durante a **${moment}**, muitas vezes ligado a **${sabotageLabel}**. Que tal planejar uma pequena ação preventiva nesse período, como um lembrete ou uma pausa de 5 minutos antes de começar?`;
            } else if (mostDifficult) {
                 const moment = mostDifficult[0].toLowerCase();
                 insightMessage = `Notamos que a **${moment}** é o período que exige mais da sua energia. Reconhecer isso já é um grande passo! Como você pode se preparar melhor para esse momento do dia?`;
            }
        }

        return {
            executionPieData: Object.entries(executionData).map(([name, value]) => ({ name, value })),
            difficultyBarData: Object.entries(difficultyData).map(([name, value]) => ({ name, value })),
            sabotageBreakdown: Object.entries(sabotageData)
                .map(([type, value]) => ({
                    type: type as SabotageType,
                    value,
                    percentage: totalSabotages > 0 ? (value / totalSabotages) * 100 : 0,
                }))
                .sort((a,b) => b.value - a.value),
            motivationPieData: Object.entries(motivationData).map(([name, value]) => ({ name, value })),
            quickInsight: insightMessage,
        }
    }, [checkins]);

    if (loading) {
        return <div className="text-center p-10">Carregando relatórios...</div>;
    }

    if (checkins.length === 0) {
         return (
             <div className="space-y-6">
                <h1 className="text-4xl font-bold text-gray-800">Relatórios de Evolução</h1>
                <p className="text-lg text-gray-600 text-center mt-10">Você ainda não tem check-ins para gerar relatórios. Comece fazendo seu primeiro check-in!</p>
             </div>
         );
    }

    const EXECUTION_COLORS = { [ExecutionStatus.COMPLETED]: '#22c55e', [ExecutionStatus.PARTIAL]: '#f59e0b', [ExecutionStatus.MISSED]: '#ef4444' };
    const DIFFICULTY_COLORS = { [DifficultyMoment.MORNING]: '#3abff8', [DifficultyMoment.AFTERNOON]: '#fbbd23', [DifficultyMoment.NIGHT]: '#3d4451', [DifficultyMoment.NONE]: '#d1d5db' };
    const MOTIVATION_COLORS = { 
        [MotivationType.GROWTH]: '#8b5cf6', 
        [MotivationType.JOY]: '#a78bfa', 
        [MotivationType.SUPPORT]: '#ec4899',
        [MotivationType.GOAL]: '#f472b6',
        [MotivationType.AUTOMATIC]: '#6b7280',
        [MotivationType.NOT_APPLICABLE]: '#9ca3af',
     };

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-800">Relatórios de Evolução</h1>
            <p className="text-lg text-gray-600">Analise seus padrões e entenda sua jornada de perto.</p>

            <Card title="Insight Rápido" icon={<Lightbulb />} className="bg-teal-50">
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: quickInsight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Balanço Geral de Execução" icon={<BarChart3 />}>
                    <div className="w-full h-80">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={executionPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {executionPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={EXECUTION_COLORS[entry.name as ExecutionStatus]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Momentos de Maior Dificuldade" icon={<CloudDrizzle />}>
                    <div className="w-full h-80">
                         {difficultyBarData.length > 0 ? (
                            <ResponsiveContainer>
                                <BarChart data={difficultyBarData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" allowDecimals={false} />
                                    <YAxis dataKey="name" type="category" width={80} />
                                    <Tooltip />
                                    <Bar dataKey="value" name="Ocorrências de falha">
                                        {difficultyBarData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={DIFFICULTY_COLORS[entry.name as DifficultyMoment]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                         ) : <p className="text-center text-gray-500 flex items-center justify-center h-full">Nenhuma dificuldade registrada ainda. Ótimo trabalho!</p>}
                    </div>
                </Card>
                
                <Card title="Fonte de Motivação" icon={<Zap />}>
                    <div className="w-full h-80">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={motivationPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                                    {motivationPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={MOTIVATION_COLORS[entry.name as MotivationType]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [value, name]}/>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                
                 <Card title="Tipos de Sabotagem" icon={<ShieldOff />}>
                     <div className="w-full h-80 p-4 space-y-4">
                        {sabotageBreakdown.length > 0 ? (
                            sabotageBreakdown.map(item => (
                                <div key={item.type}>
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center space-x-2">
                                            <SabotageIcon type={item.type} />
                                            <span className="font-semibold text-gray-700">{sabotageDisplay[item.type].label}</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-600">{item.percentage.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className={`${sabotageDisplay[item.type].color} h-2.5 rounded-full`} 
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : <p className="text-center text-gray-500 flex items-center justify-center h-full">Nenhuma sabotagem registrada. Continue assim!</p>}
                     </div>
                </Card>
            </div>
        </div>
    );
};

export default Reports;