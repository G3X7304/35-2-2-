import React, { useState, useRef, useEffect } from 'react';
import { streamQuery } from '../services/geminiService';
import { SendIcon } from './Icons';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const RuleSearch: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!messages.length) {
       setMessages([{
           sender: 'ai',
           text: '안녕하세요! KBO 공식 규칙에 대해 궁금한 점이 있으신가요? 어떤 상황이든 편하게 질문해주세요.'
       }])
    }
  }, []);

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const systemInstruction = "당신은 KBO 공식 야구 규칙에 대해 매우 잘 아는 전문가입니다. 제공된 규칙 본문을 바탕으로 사용자의 질문에 대해 초보자도 이해하기 쉽게 친절하고 명확하게 설명해주세요. 답변은 한국어로 해주세요.";
    
    let aiResponse = '';
    setMessages(prev => [...prev, { sender: 'ai', text: '' }]);

    try {
      for await (const chunk of streamQuery(systemInstruction, input)) {
        aiResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = aiResponse;
          return newMessages;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = "죄송합니다. 답변을 생성하는 중 오류가 발생했습니다.";
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[65vh]">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-800 rounded-t-lg">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg p-3 rounded-lg ${msg.sender === 'user' ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
              <p className="whitespace-pre-wrap">{msg.text || "..."}</p>
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
            placeholder="야구 규칙에 대해 질문해보세요 (예: 병살이 뭐에요?)"
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

export default RuleSearch;