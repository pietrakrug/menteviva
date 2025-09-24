
import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { getMotivationalPhrase } from '../services/geminiService';
import Card from './ui/Card';

const MotivationalPhrase: React.FC = () => {
    const [phraseData, setPhraseData] = useState<{ title: string; phrase: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPhrase = async () => {
            const todayKey = `phrase-${new Date().toISOString().split('T')[0]}`;
            const storedPhrase = localStorage.getItem(todayKey);

            if (storedPhrase) {
                setPhraseData(JSON.parse(storedPhrase));
                setLoading(false);
            } else {
                try {
                    const data = await getMotivationalPhrase();
                    setPhraseData(data);
                    localStorage.setItem(todayKey, JSON.stringify(data));
                } catch (err) {
                    console.error(err);
                    setError('Não foi possível buscar a frase de hoje. Tente novamente mais tarde.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPhrase();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <p className="text-center text-gray-500">Buscando inspiração...</p>;
        }
        if (error) {
            return <p className="text-center text-red-500">{error}</p>;
        }
        if (phraseData) {
            return (
                <div className="text-center">
                    <Lightbulb className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-primary mb-4">{phraseData.title}</h2>
                    <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">{phraseData.phrase}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-800">Frase do Dia</h1>
            <p className="text-lg text-gray-600">Uma reflexão para fortalecer sua jornada de constância.</p>
            <Card className="bg-gradient-to-br from-teal-50 to-purple-50 p-8 min-h-[300px] flex items-center justify-center">
                {renderContent()}
            </Card>
        </div>
    );
};

export default MotivationalPhrase;
