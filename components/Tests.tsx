import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, ChevronLeft, Repeat } from 'lucide-react';
import Card from './ui/Card';
import { api } from '../services/api';
import { User, Test, TestResultDetails, TestSubmission, Archetype, Answer } from '../types';
import { BEHAVIORAL_TESTS } from '../data/tests';

const ResultCard: React.FC<{ result: TestResultDetails; onReset: () => void; }> = ({ result, onReset }) => (
    <Card className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-6">
            <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-600">Seu Arquétipo é:</p>
            <h2 className="text-3xl font-bold text-primary">{result.archetype}</h2>
        </div>
        <div className="space-y-4 text-left">
            <div>
                <h4 className="font-bold text-gray-800">Padrão de Comportamento:</h4>
                <p className="text-gray-600">{result.behaviorPattern}</p>
            </div>
            <div>
                <h4 className="font-bold text-gray-800">Impacto nos Hábitos:</h4>
                <p className="text-gray-600">{result.habitImpact}</p>
            </div>
            <div>
                <h4 className="font-bold text-gray-800">Dicas de Intervenção:</h4>
                <p className="text-gray-600">{result.interventionTips}</p>
            </div>
        </div>
        <button onClick={onReset} className="mt-8 w-full flex items-center justify-center space-x-2 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
            <ChevronLeft size={20} />
            <span>Voltar para Testes</span>
        </button>
    </Card>
);

const TestRunner: React.FC<{ test: Test; user: User; onComplete: (result: TestResultDetails) => void }> = ({ test, user, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Archetype[]>([]);
    
    const handleAnswer = (answer: Answer) => {
        const newAnswers = [...answers, answer.archetype];
        setAnswers(newAnswers);

        if (currentQuestionIndex < test.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Calculate result
            const counts: Record<string, number> = {};
            newAnswers.forEach(ans => { counts[ans] = (counts[ans] || 0) + 1; });
            
            const resultArchetype = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b) as Archetype;
            const resultDetails = test.results.find(r => r.archetype === resultArchetype);

            if (resultDetails) {
                api.saveTestResult({
                    userId: user.id,
                    testId: test.id,
                    resultArchetype,
                });
                onComplete(resultDetails);
            }
        }
    };
    
    const progress = ((currentQuestionIndex) / test.questions.length) * 100;
    const currentQuestion = test.questions[currentQuestionIndex];

    return (
        <Card className="w-full max-w-2xl mx-auto">
             <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-sm text-gray-500 text-center mb-4">Pergunta {currentQuestionIndex + 1} de {test.questions.length}</p>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-8">{currentQuestion.text}</h3>
            <div className="space-y-3">
                {currentQuestion.answers.map((answer, index) => (
                    <button 
                        key={index}
                        onClick={() => handleAnswer(answer)}
                        className="block w-full text-left p-4 bg-gray-100 rounded-lg hover:bg-teal-100 hover:ring-2 hover:ring-primary transition-all">
                        {answer.text}
                    </button>
                ))}
            </div>
        </Card>
    );
};


const Tests: React.FC<{ user: User }> = (props) => {
    const { user } = props;
    const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTest, setActiveTest] = useState<Test | null>(null);
    const [testResult, setTestResult] = useState<TestResultDetails | null>(null);

    useEffect(() => {
        api.getTestSubmissions(user.id).then(data => {
            setSubmissions(data);
            setLoading(false);
        });
    }, [user.id]);
    
    const canRetake = (testId: string): boolean => {
        const submission = submissions.find(s => s.testId === testId);
        if (!submission) return true;
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return new Date(submission.submissionDate) < oneMonthAgo;
    };

    const handleTestComplete = (result: TestResultDetails) => {
        setTestResult(result);
        // Refresh submissions
        api.getTestSubmissions(user.id).then(setSubmissions);
    };

    const resetState = () => {
        setActiveTest(null);
        setTestResult(null);
    }
    
    if (loading) {
        return <p>Carregando testes...</p>;
    }
    
    if (testResult) {
        return <ResultCard result={testResult} onReset={resetState} />;
    }

    if (activeTest) {
        return <TestRunner test={activeTest} user={user} onComplete={handleTestComplete} />;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-800">Testes Comportamentais</h1>
            <p className="text-lg text-gray-600">Descubra mais sobre seus padrões para acelerar sua evolução.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BEHAVIORAL_TESTS.map(test => {
                    const submission = submissions.find(s => s.testId === test.id);
                    const canTakeTest = canRetake(test.id);

                    return (
                        <Card key={test.id}>
                            <test.icon className="w-10 h-10 text-primary mb-4" />
                            <h3 className="text-xl font-bold text-gray-800">{test.title}</h3>
                            {submission ? (
                                <div className="mt-4 text-sm bg-gray-100 p-3 rounded-lg">
                                    <p className="font-semibold">Último resultado:</p>
                                    <p className="text-primary font-bold">{submission.resultArchetype}</p>
                                    <p className="text-gray-500 mt-1">Data: {new Date(submission.submissionDate).toLocaleDateString()}</p>
                                </div>
                            ) : (
                                <p className="text-gray-500 mt-2">Você ainda não fez este teste.</p>
                            )}
                            <button
                                onClick={() => setActiveTest(test)}
                                disabled={!canTakeTest}
                                className="mt-6 w-full flex items-center justify-center space-x-2 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {submission ? <Repeat size={18} /> : <CheckCircle size={18} />}
                                <span>{canTakeTest ? (submission ? 'Refazer Teste' : 'Fazer Teste') : 'Aguarde para refazer'}</span>
                            </button>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default Tests;