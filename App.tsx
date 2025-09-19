
import React, { useState, useMemo } from 'react';
import Dictionary from './components/Dictionary';
import RuleSearch from './components/RuleSearch';
import Quiz from './components/Quiz';
import SituationalExplainer from './components/SituationalExplainer';
import { BookIcon, SearchIcon, BrainIcon, CaseIcon } from './components/Icons';

type Tab = 'dictionary' | 'search' | 'quiz' | 'situational';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dictionary');

  const tabs = useMemo(() => [
    { id: 'dictionary', label: '용어 사전', icon: <BookIcon /> },
    { id: 'search', label: 'AI 규칙 검색', icon: <SearchIcon /> },
    { id: 'quiz', label: '야구 규칙 퀴즈', icon: <BrainIcon /> },
    { id: 'situational', label: '상황별 규칙 해설', icon: <CaseIcon /> },
  ], []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dictionary':
        return <Dictionary />;
      case 'search':
        return <RuleSearch />;
      case 'quiz':
        return <Quiz />;
      case 'situational':
        return <SituationalExplainer />;
      default:
        return <Dictionary />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-yellow-400">KBO 야구 규칙 마스터</h1>
          <p className="text-gray-400 mt-2">AI와 함께 KBO 공식 야구 규칙을 쉽게 배워보세요.</p>
        </header>
        
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <nav className="flex border-b border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex-1 py-3 px-2 text-sm sm:text-base font-medium flex items-center justify-center gap-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-yellow-400 border-b-2 border-yellow-400'
                    : 'text-gray-400 hover:bg-gray-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          <main className="p-4 sm:p-6 min-h-[60vh]">
            {renderContent()}
          </main>
        </div>
        
        <footer className="text-center mt-6 text-gray-500 text-sm">
          <p>Powered by Google Gemini API. For educational purposes only.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
