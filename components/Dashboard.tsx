import React, { useState, useEffect, useMemo } from 'react';
import { Target, TrendingUp, Sparkles, Medal, Activity, PlusCircle, Wind, Zap, Bell } from 'lucide-react';
import Card from './ui/Card';
import { api } from '../services/api';
import { getInsightFromCheckins } from '../services/geminiService';
import { Habit, Checkin, Insight, ExecutionStatus, User, DifficultyMoment, SabotageType, MotivationType, EnergyLevel, NextDayPlan } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const COLORS = {
    [ExecutionStatus.COMPLETED]: '#36d399',
    [ExecutionStatus.PARTIAL]: '#fbbd23',
    [ExecutionStatus.MISSED]: '#f87272',
};

const weekDays = [
    { label: 'D', value: 0 },
    { label: 'S', value: 1 },
    { label: 'T', value: 2 },
    { label: 'Q', value: 3 },
    { label: 'Q', value: 4 },
    { label: 'S', value: 5 },
    { label: 'S', value: 6 },
];

const HabitForm: React.FC<{ user: User; onClose: () => void; onHabitCreated: (newHabit: Habit) => void; }> = ({ user, onClose, onHabitCreated }) => {
    const [name, setName] = useState('');
    const [daysPerWeek, setDaysPerWeek] = useState(5);
    const [timesPerDay, setTimesPerDay] = useState(1);
    const [durationDays, setDurationDays] = useState<7 | 10 | 15 | 30>(30);
    const [reminderTime, setReminderTime] = useState('20:00');
    const [reminderDays, setReminderDays] = useState<number[]>([1, 2, 3, 4, 5]); // Default weekdays
    
    const handleDayToggle = (dayValue: number) => {
        setReminderDays(prevDays => 
            prevDays.includes(dayValue) 
                ? prevDays.filter(d => d !== dayValue)
                : [...prevDays, dayValue]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const newHabitData = {
            userId: user.id,
            name,
            daysPerWeek,
            timesPerDay,
            durationDays,
            startDate: new Date().toISOString(),
            reminderTime,
            reminderDays,
        };
        const newHabit = await api.addHabit(newHabitData);
        onHabitCreated(newHabit);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card title="Criar Novo Hábito" className="w-full max-w-md max-h-full overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Qual hábito deseja criar?</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quantos dias por semana?</label>
                        <input type="number" min="1" max="7" value={daysPerWeek} onChange={e => setDaysPerWeek(parseInt(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Quantas vezes por dia?</label>
                        <input type="number" min="1" value={timesPerDay} onChange={e => setTimesPerDay(parseInt(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Duração (dias corridos)</label>
                        <select value={durationDays} onChange={e => setDurationDays(parseInt(e.target.value) as any)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                            <option value="7">7 dias</option>
                            <option value="10">10 dias</option>
                            <option value="15">15 dias</option>
                            <option value="30">30 dias</option>
                        </select>
                    </div>

                    <div className="border-t pt-4 space-y-3">
                         <h4 className="text-sm font-medium text-gray-700">Lembrete por E-mail</h4>
                         <div>
                            <label className="block text-xs font-medium text-gray-600">Horário do lembrete</label>
                            <input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" />
                         </div>
                         <div>
                            <label className="block text-xs font-medium text-gray-600 mb-2">Dias do lembrete</label>
                            <div className="flex justify-between space-x-1">
                                {weekDays.map(day => (
                                    <button
                                        key={day.value}
                                        type="button"
                                        onClick={() => handleDayToggle(day.value)}
                                        className={`w-10 h-10 rounded-full font-bold text-sm transition-colors ${
                                            reminderDays.includes(day.value) ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {day.label}
                                    </button>
                                ))}
                            </div>
                         </div>
                    </div>


                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus">Criar Hábito</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};


const CheckinModal: React.FC<{ habit: Habit; onClose: () => void; onCheckinAdded: (newCheckin: Checkin) => void; }> = ({ habit, onClose, onCheckinAdded }) => {
    const [formData, setFormData] = useState({
        executionStatus: ExecutionStatus.COMPLETED,
        difficultyMoment: DifficultyMoment.NONE,
        sabotageType: SabotageType.NONE,
        motivationType: MotivationType.GROWTH,
        energyLevel: EnergyLevel.SAME,
        nextDayPlan: NextDayPlan.REPEAT,
        learnings: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };

        if (name === 'executionStatus') {
            const newStatus = value as ExecutionStatus;
            if (newStatus === ExecutionStatus.COMPLETED) {
                newFormData.difficultyMoment = DifficultyMoment.NONE;
                 if(newFormData.motivationType === MotivationType.NOT_APPLICABLE) {
                    newFormData.motivationType = MotivationType.GROWTH;
                }
                if(newFormData.energyLevel === EnergyLevel.NOT_APPLICABLE) {
                    newFormData.energyLevel = EnergyLevel.SAME;
                }
            } else if (newStatus === ExecutionStatus.MISSED) {
                newFormData.motivationType = MotivationType.NOT_APPLICABLE;
                newFormData.energyLevel = EnergyLevel.NOT_APPLICABLE;
                if (formData.difficultyMoment === DifficultyMoment.NONE) {
                    newFormData.difficultyMoment = DifficultyMoment.MORNING;
                }
            } else { // PARTIAL
                 if (formData.difficultyMoment === DifficultyMoment.NONE) {
                    newFormData.difficultyMoment = DifficultyMoment.MORNING;
                }
                if(newFormData.motivationType === MotivationType.NOT_APPLICABLE) {
                    newFormData.motivationType = MotivationType.GROWTH;
                }
                if(newFormData.energyLevel === EnergyLevel.NOT_APPLICABLE) {
                    newFormData.energyLevel = EnergyLevel.SAME;
                }
            }
        }
        setFormData(newFormData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newCheckin = await api.addCheckin({ habitId: habit.id, ...formData });
        onCheckinAdded(newCheckin);
    };
    
    const options = {
      executionStatus: Object.values(ExecutionStatus),
      difficultyMoment: Object.values(DifficultyMoment),
      sabotageType: Object.values(SabotageType),
      motivationType: Object.values(MotivationType),
      energyLevel: Object.values(EnergyLevel),
      nextDayPlan: Object.values(NextDayPlan),
    };
    
    const fieldLabels: { [key: string]: string } = {
        executionStatus: 'Execução do hábito',
        difficultyMoment: 'Momento de maior dificuldade',
        sabotageType: 'Qual foi o maior desafio / sabotagem hoje?',
        motivationType: 'O que mais te motivou hoje?',
        energyLevel: 'Como ficou sua energia/emoção depois do hábito?',
        nextDayPlan: 'Qual seu plano para amanhã?',
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card title={`Check-in: ${habit.name}`} className="w-full max-w-lg max-h-full overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {Object.entries(options).map(([key, values]) => (
                         <div key={key}>
                            <label className="block text-sm font-medium text-gray-700 capitalize">{fieldLabels[key]}</label>
                            <select name={key} value={formData[key as keyof typeof formData] as string} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                                {values.map(val => <option key={val} value={val}>{val}</option>)}
                            </select>
                        </div>
                    ))}
                    <div>
                        <label htmlFor="learnings" className="block text-sm font-medium text-gray-700">O que aprendi sobre mim hoje?</label>
                        <textarea id="learnings" name="learnings" value={formData.learnings} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"></textarea>
                    </div>
                     <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus">Salvar Check-in</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};


const HabitCard: React.FC<{ habit: Habit, onCheckin: () => void, alreadyCheckedIn: boolean }> = ({ habit, onCheckin, alreadyCheckedIn }) => {
    const formatReminderDays = (days: number[] = []): string => {
        const sortedDays = [...days].sort();
        if (sortedDays.length === 7) return 'Todos os dias';
        if (sortedDays.toString() === '1,2,3,4,5') return 'Dias úteis';
        if (sortedDays.toString() === '0,6') return 'Fins de semana';
        
        const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        return sortedDays.map(d => dayLabels[d]).join(', ');
    };

    return (
        <Card className="w-full">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-semibold text-primary">{habit.durationDays} DIAS</p>
                    <h4 className="text-lg font-bold text-gray-800 mt-1">{habit.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                        {habit.daysPerWeek}x por semana, {habit.timesPerDay}x por dia
                    </p>
                    {habit.reminderTime && habit.reminderDays && habit.reminderDays.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2 flex items-center">
                            <Bell size={12} className="mr-1" />
                            Lembrete às {habit.reminderTime} ({formatReminderDays(habit.reminderDays)})
                        </p>
                    )}
                </div>
                <Target className="text-gray-300" />
            </div>
            <div className="mt-4">
                <button 
                  onClick={onCheckin}
                  disabled={alreadyCheckedIn}
                  className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {alreadyCheckedIn ? 'Check-in de hoje feito!' : 'Fazer Check-in'}
                </button>
            </div>
        </Card>
    );
};

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [checkins, setCheckins] = useState<Checkin[]>([]);
    const [insight, setInsight] = useState<Insight | null>(null);
    const [loading, setLoading] = useState(true);
    const [isHabitModalOpen, setHabitModalOpen] = useState(false);
    const [isCheckinModalOpen, setCheckinModalOpen] = useState(false);
    
    const activeHabit = habits.length > 0 ? habits[0] : null;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const habitsData = await api.getHabits(user.id);
                setHabits(habitsData);

                if (habitsData.length > 0) {
                    const checkinsData = await api.getCheckins(habitsData[0].id);
                    setCheckins(checkinsData);

                    if (checkinsData.length > 2) {
                        const generatedInsight = await getInsightFromCheckins(checkinsData);
                        setInsight(generatedInsight);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.id]);
    
    const handleHabitCreated = (newHabit: Habit) => {
        setHabits([newHabit, ...habits]);
        setHabitModalOpen(false);
    };

    const handleCheckinAdded = (newCheckin: Checkin) => {
        const updatedCheckins = [newCheckin, ...checkins];
        setCheckins(updatedCheckins);
        setCheckinModalOpen(false);
        // re-generate insight
         getInsightFromCheckins(updatedCheckins).then(setInsight);
    };
    
    const alreadyCheckedInToday = useMemo(() => {
        if (checkins.length === 0) return false;
        const lastCheckinDate = new Date(checkins[0].checkinDate);
        const today = new Date();
        return lastCheckinDate.getFullYear() === today.getFullYear() &&
               lastCheckinDate.getMonth() === today.getMonth() &&
               lastCheckinDate.getDate() === today.getDate();
    }, [checkins]);


    const streak = useMemo(() => {
      let count = 0;
      let consecutive = true;
      const sortedCheckins = [...checkins].sort((a,b) => new Date(b.checkinDate).getTime() - new Date(a.checkinDate).getTime());
      
      if(sortedCheckins.length === 0) return 0;

      // Check if today's checkin is completed
      const today = new Date();
      const lastCheckinDate = new Date(sortedCheckins[0].checkinDate);
      if (
        (lastCheckinDate.toDateString() === today.toDateString()) &&
        sortedCheckins[0].executionStatus === ExecutionStatus.COMPLETED
      ) {
        count++;
      } else if (lastCheckinDate.toDateString() !== today.toDateString()) {
        // If last checkin was not today, it cannot be a streak
        consecutive = false;
      }

      // Check previous days
      for (let i = count; i < sortedCheckins.length && consecutive; i++) {
          const currentCheckin = sortedCheckins[i];
          const previousDay = new Date();
          previousDay.setDate(today.getDate() - (i + 1 - count));

          if (new Date(currentCheckin.checkinDate).toDateString() === previousDay.toDateString() && currentCheckin.executionStatus === ExecutionStatus.COMPLETED) {
              count++;
          } else {
              consecutive = false;
          }
      }
      return count;

    }, [checkins]);

    if (loading) {
        return <div className="text-center p-10">Carregando dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            {isHabitModalOpen && <HabitForm user={user} onClose={() => setHabitModalOpen(false)} onHabitCreated={handleHabitCreated} />}
            {isCheckinModalOpen && activeHabit && <CheckinModal habit={activeHabit} onClose={() => setCheckinModalOpen(false)} onCheckinAdded={handleCheckinAdded} />}

            <h1 className="text-4xl font-bold text-gray-800">Seu Dashboard, {user.fullName.split(' ')[0]}</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Meu Hábito Atual" icon={<Activity />}>
                        {activeHabit ? (
                            <HabitCard habit={activeHabit} onCheckin={() => setCheckinModalOpen(true)} alreadyCheckedIn={alreadyCheckedInToday} />
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-600 mb-4">Você ainda não cadastrou nenhum hábito.</p>
                                <button onClick={() => setHabitModalOpen(true)} className="inline-flex items-center space-x-2 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors">
                                    <PlusCircle size={20} />
                                    <span>Criar meu primeiro hábito</span>
                                </button>
                            </div>
                        )}
                    </Card>

                     <Card title="Consistência Semanal" icon={<TrendingUp />}>
                        {checkins.length > 0 ? (
                             <div className="h-64">
                                 <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={checkins.slice(0, 7).map(c => ({date: new Date(c.checkinDate).toLocaleDateString('pt-BR', {day: '2-digit', month:'2-digit'}), statusValue: c.executionStatus === ExecutionStatus.COMPLETED ? 3 : c.executionStatus === ExecutionStatus.PARTIAL ? 2 : 1, status: c.executionStatus })).reverse()}>
                                        <XAxis dataKey="date" />
                                        <YAxis tickCount={4} domain={[0, 3]} tickFormatter={(val) => ['','Não Cumpri', 'Parcial', 'Integral'][val]} />
                                        <Tooltip formatter={(value, name, props) => [props.payload.status , 'Status']} />
                                        <Bar dataKey="statusValue" name="Status" >
                                            {
                                               checkins.slice(0, 7).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[entry.executionStatus]} />
                                                ))
                                            }
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (<p className="text-gray-500 text-center py-10">Faça seu primeiro check-in para ver o gráfico.</p>)}
                    </Card>
                </div>
                
                <div className="space-y-6">
                    {insight && (
                        <Card title={insight.title} icon={<Sparkles />} className="bg-teal-50 border-primary border">
                           <p className="text-gray-700">{insight.message}</p>
                        </Card>
                    )}
                     <Card title="Gamificação" icon={<Medal />}>
                        <div className="flex justify-around text-center">
                            <div>
                                <div className="flex items-center justify-center text-3xl font-bold text-primary">
                                    <Zap className="w-6 h-6 mr-1" /> {streak}
                                </div>
                                <p className="text-sm text-gray-600">Dias de Streak</p>
                            </div>
                            <div>
                                <div className="flex items-center justify-center text-3xl font-bold text-secondary">
                                    <Medal className="w-6 h-6 mr-1" /> {checkins.filter(c => c.executionStatus === ExecutionStatus.COMPLETED).length}
                                </div>
                                <p className="text-sm text-gray-600">Check-ins completos</p>
                            </div>
                        </div>
                    </Card>
                    <Card title="Balanço Emocional" icon={<Wind />}>
                        <p className="text-gray-600 text-center">
                            {checkins.length > 0
                                ? `Seus hábitos estão te deixando com ${checkins.filter(c => c.energyLevel === EnergyLevel.BETTER).length >= checkins.length / 2 ? 'mais energia' : 'energia estável'}!`
                                : "Acompanhe sua energia após cada hábito."
                            }
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;