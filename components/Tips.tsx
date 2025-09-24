
import React, { useState } from 'react';
import { Lightbulb, Moon, BrainCog } from 'lucide-react';
import Card from './ui/Card';
import { TIPS_DATA } from '../data/tips';
import { TipCategory } from '../types';

const Tips: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>(TIPS_DATA[0].id);

    const selectedCategory = TIPS_DATA.find(cat => cat.id === activeCategory) || TIPS_DATA[0];

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-800">Dicas e Curiosidades</h1>
            <p className="text-lg text-gray-600">Use a ciência a seu favor para construir uma rotina mais saudável e consciente.</p>

            <div className="bg-white rounded-lg shadow p-2 flex space-x-2">
                {TIPS_DATA.map(category => (
                    <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex-1 flex items-center justify-center space-x-2 font-semibold py-2 px-4 rounded-md transition-colors ${
                            activeCategory === category.id 
                            ? 'bg-primary text-white shadow' 
                            : 'text-gray-600 hover:bg-teal-100'
                        }`}
                    >
                        <category.icon className="w-5 h-5" />
                        <span>{category.title}</span>
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                 <h2 className="text-2xl font-bold text-gray-700 mt-4">{selectedCategory.title}</h2>
                 {selectedCategory.tips.map((tip, index) => (
                    <Card key={index} className="transition hover:border-primary border border-transparent">
                        <h3 className="text-xl font-bold text-primary mb-2">{tip.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{tip.content}</p>
                    </Card>
                 ))}
            </div>
        </div>
    );
};

export default Tips;
