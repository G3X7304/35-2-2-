
import React, { useState, useRef, useEffect } from 'react';
import { streamQuery, generateIllustration } from '../services/geminiService';
import { SendIcon, LoadingIcon } from './Icons';
import { SituationalMessage } from '../types';


const SituationalExplainer: React.FC = () => {
  const [messages, setMessages] = useState<SituationalMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: SituationalMessage = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const systemInstruction = "당신은 KBO 베테랑 심판입니다. 제공된 공식 야구 규칙 본문을 기반으로 사용자가 묘사하는 특정 야구 상황에 대해 어떤 규칙이 적용되는지, 그리고 가능한 판정과 결과가 무엇인지 명확하고 상세하게 설명해주세요. 답변은 한국어로, 실제 심판이 설명해주는 듯한 어조로 해주세요.";
    
    let aiResponse = '';
    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '' }]);

    try {
      for await (const chunk of streamQuery(systemInstruction, currentInput)) {
        aiResponse += chunk;
        setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, text: aiResponse } : m));
      }

      setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, isIllustrationLoading: true } : m));
      const illustrationPrompt = `User question: ${currentInput}\nAI Answer: ${aiResponse}`;
      const imageUrl = await generateIllustration(illustrationPrompt);

      if (imageUrl) {
        setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, illustrationUrl: imageUrl, isIllustrationLoading: false } : m));
      } else {
        setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, isIllustrationLoading: false } : m));
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, text: "죄송합니다. 답변을 생성하는 중 오류가 발생했습니다.", isIllustrationLoading: false } : m));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[65vh]">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-800 rounded-t-lg">
         {!messages.length && (
            <div className="text-center text-gray-400 p-4">
                <p className="font-semibold">궁금한 야구 상황을 설명해보세요!</p>
                <p className="text-sm mt-2">예: "1사 만루, 2-2 카운트에서 타자가 번트를 댔는데 파울이 됐어요. 어떻게 되나요?"</p>
            </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg p-3 rounded-lg ${msg.sender === 'user' ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
              {msg.isIllustrationLoading && (
                <div className="w-full aspect-video bg-gray-600 rounded-lg flex items-center justify-center mb-2 animate-pulse">
                  <p className="text-gray-400 text-sm">일러스트 생성 중...</p>
                </div>
              )}
              {msg.illustrationUrl && (
                <img src={msg.illustrationUrl} alt="상황 설명 이미지" className="rounded-lg mb-2 bg-gray-800/50" />
              )}
              <p className="whitespace-pre-wrap">{msg.text || <LoadingIcon/>}</p>
            </div>
          </div>
        ))}
         <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-gray-800 rounded-b-lg border-t border-gray-700">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="궁금한 야구 상황을 설명해주세요..."
            className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="p-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SituationalExplainer;
