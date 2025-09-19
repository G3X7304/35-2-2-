import React, { useState, useMemo } from 'react';
import { dictionaryData } from '../lib/dictionaryData';
import { SearchIcon, LoadingIcon } from './Icons';
import { generateIllustration } from '../services/geminiService';
import { DictionaryEntry } from '../types';

const Dictionary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openTerm, setOpenTerm] = useState<string | null>(null);
  const [illustrations, setIllustrations] = useState<Record<string, string>>({});
  const [loadingIllustrations, setLoadingIllustrations] = useState<Record<string, boolean>>({});

  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return dictionaryData;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return dictionaryData.filter(item =>
      item.term.toLowerCase().includes(lowercasedTerm) ||
      item.definition.toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTerm]);

  const handleTermClick = async (item: DictionaryEntry) => {
    const term = item.term;
    if (openTerm === term) {
        setOpenTerm(null); // Close if already open
        return;
    }
    setOpenTerm(term);

    if (!illustrations[term] && !loadingIllustrations[term]) {
        setLoadingIllustrations(prev => ({ ...prev, [term]: true }));
        const prompt = item.illustrationPrompt || `${item.term}: ${item.definition}`;
        const imageUrl = await generateIllustration(prompt);
        if (imageUrl) {
            setIllustrations(prev => ({ ...prev, [term]: imageUrl }));
        }
        setLoadingIllustrations(prev => ({ ...prev, [term]: false }));
    }
  };

  return (
    <div className="flex flex-col h-full">
       <div className="bg-gray-700/30 rounded-lg mb-4 p-4 border border-gray-600">
        <h2 className="text-xl font-semibold text-yellow-400">환영합니다!</h2>
        <p className="text-gray-300 mt-1">
          KBO 공식 규칙에 기반한 야구 용어 사전입니다. 궁금한 용어를 클릭하여 자세한 설명과 일러스트를 확인해보세요.
        </p>
      </div>
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="야구 용어를 검색하세요 (예: 보크)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto pr-2">
        {filteredData.length > 0 ? (
          <ul className="space-y-2">
            {filteredData.map((item, index) => (
              <li key={index} className="bg-gray-800 rounded-lg shadow-inner overflow-hidden">
                <button 
                  onClick={() => handleTermClick(item)}
                  className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-700/50"
                >
                  <h3 className="text-lg font-bold text-yellow-400">{item.term}</h3>
                   <svg className={`w-5 h-5 transition-transform transform ${openTerm === item.term ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {openTerm === item.term && (
                    <div className="p-4 border-t border-gray-700">
                        <p className="mb-4 text-gray-300">{item.definition}</p>
                        {loadingIllustrations[item.term] && (
                             <div className="w-full aspect-video bg-gray-700 rounded-lg flex items-center justify-center animate-pulse">
                                <p className="text-gray-400">일러스트 생성 중...</p>
                            </div>
                        )}
                        {illustrations[item.term] && !loadingIllustrations[item.term] && (
                            <img src={illustrations[item.term]} alt={item.term} className="rounded-lg w-full object-contain bg-gray-900/50" />
                        )}
                    </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-400 py-10">
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dictionary;