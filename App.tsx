
import React, { useState, useCallback } from 'react';
import { BrainCircuit, BarChart3, History, User as UserIcon, Beaker, Gift, BookOpen, LogOut } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import HistoryView from './components/HistoryView';
import Profile from './components/Profile';
import Tests from './components/Tests';
import Login from './components/Login';
import MotivationalPhrase from './components/MotivationalPhrase';
import Tips from './components/Tips';
import { MenteVivaIcon } from './components/icons';
import { User as UserType } from './types';

type Page = 'dashboard' | 'reports' | 'history' | 'tests' | 'profile' | 'motivation' | 'tips';

const App: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const handleLogin = (loggedInUser: UserType) => {
    setUser(loggedInUser);
  };
  
  const handleUserUpdate = (updatedUser: UserType) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };
  
  const handleHabitReset = () => {
    // Navigate back to dashboard after habit is reset, where it will show the create habit screen
    setCurrentPage('dashboard');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} key={user.id} />; // Use key to force re-mount on user change
      case 'reports':
        return <Reports user={user} />;
      case 'history':
        return <HistoryView user={user} />;
      case 'tests':
        return <Tests user={user} />;
      case 'profile':
        return <Profile user={user} onUpdateUser={handleUserUpdate} onLogout={handleLogout} onHabitReset={handleHabitReset} />;
      case 'motivation':
        return <MotivationalPhrase />;
      case 'tips':
        return <Tips />;
      default:
        return <Dashboard user={user} />;
    }
  };

  const NavItem = ({ icon: Icon, label, pageName }: { icon: React.ElementType, label: string, pageName: Page }) => (
    <button
      onClick={() => setCurrentPage(pageName)}
      className={`flex items-center space-x-3 p-3 rounded-lg w-full text-left transition-colors duration-200 ${
        currentPage === pageName
          ? 'bg-primary text-white shadow-md'
          : 'text-gray-600 hover:bg-teal-100 hover:text-primary'
      }`}
    >
      <Icon className="h-6 w-6" />
      <span className="font-medium text-lg">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col p-4 fixed h-full">
        <div className="flex items-center space-x-2 p-4 border-b border-gray-200">
          <MenteVivaIcon className="h-10 w-10 text-primary" />
          <span className="text-2xl font-bold text-primary">Mente Viva</span>
        </div>
        <nav className="mt-8 flex-grow">
          <ul className="space-y-3">
            <li><NavItem icon={BrainCircuit} label="Dashboard" pageName="dashboard" /></li>
            <li><NavItem icon={BarChart3} label="Relatórios" pageName="reports" /></li>
            <li><NavItem icon={History} label="Histórico" pageName="history" /></li>
            <li><NavItem icon={Beaker} label="Testes" pageName="tests" /></li>
            <li><NavItem icon={Gift} label="Frase do Dia" pageName="motivation" /></li>
            <li><NavItem icon={BookOpen} label="Dicas" pageName="tips" /></li>
            <li><NavItem icon={UserIcon} label="Perfil" pageName="profile" /></li>
          </ul>
        </nav>
        <div className="p-4 mt-auto">
          <div className="flex items-center space-x-3">
            <img src={user.avatarUrl || `https://i.pravatar.cc/40?u=${user.email}`} alt="User" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <p className="font-semibold text-gray-800">{user.fullName}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
