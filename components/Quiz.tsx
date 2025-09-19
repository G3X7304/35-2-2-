import React, { useState, useEffect, useCallback } from 'react';
import { generateQuizSet, generateIllustration } from '../services/geminiService';
import type { QuizQuestion } from '../types';
import { LoadingIcon } from './Icons';

type QuizState = 'loading' | 'playing' | 'finished';

// Helper to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const Quiz: React.FC = () => {
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [quizState, setQuizState] = useState<QuizState>('loading');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const [illustration, setIllustration] = useState<string | null>(null);
  const [isIllustrationLoading, setIsIllustrationLoading] = useState(false);

  const startNewQuiz = useCallback((questions: QuizQuestion[]) => {
    const selectedQuestions = shuffleArray(questions).slice(0, 5);
    setCurrentQuizQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setQuizState('playing');
  }, []);
  
  const fetchQuestionSet = async () => {
    setQuizState('loading');
    const newQuestions = await generateQuizSet();
    if (newQuestions) {
      setAllQuestions(newQuestions);
      startNewQuiz(newQuestions);
    } else {
      setQuizState('finished'); // Or an error state
    }
  };

  useEffect(() => {
    fetchQuestionSet();
  }, [startNewQuiz]);
  
  useEffect(() => {
    const generateImageForCurrentQuestion = async () => {
      if (quizState === 'playing' && currentQuizQuestions.length > 0) {
        setIsIllustrationLoading(true);
        setIllustration(null);
        const currentQuestion = currentQuizQuestions[currentQuestionIndex];
        const imageUrl = await generateIllustration(currentQuestion.question, true);
        setIllustration(imageUrl);
        setIsIllustrationLoading(false);
      }
    };
    generateImageForCurrentQuestion();
  }, [currentQuestionIndex, currentQuizQuestions, quizState]);


  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    if (index === currentQuizQuestions[currentQuestionIndex]?.correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < currentQuizQuestions.length - 1) {
        setCurrentQuestionIndex(i => i + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
    } else {
        setQuizState('finished');
    }
  }

  const handleRestart = () => {
    if (allQuestions.length > 0) {
      startNewQuiz(allQuestions);
    } else {
      fetchQuestionSet();
    }
  };


  if (quizState === 'loading') {
    return <div className="text-center p-8 flex items-center justify-center gap-2"><LoadingIcon />퀴즈 문제를 생성 중입니다...</div>;
  }

  if (quizState === 'finished') {
    return (
        <div className="text-center p-8 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">퀴즈 완료!</h2>
            <p className="text-lg text-gray-300 mb-6">
                총 {currentQuizQuestions.length}문제 중 <span className="text-yellow-400 font-semibold">{score}</span>문제를 맞혔습니다!
            </p>
            <button onClick={handleRestart} className="mt-6 px-6 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors">
                다시 풀어보기
            </button>
        </div>
    );
  }

  const question = currentQuizQuestions[currentQuestionIndex];
  if (!question) {
    return <div className="text-center p-8">퀴즈 문제를 불러오는 데 실패했습니다.</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-yellow-400">야구 규칙 퀴즈</h2>
            <p className="text-lg font-semibold text-gray-300">문제 {currentQuestionIndex + 1} / {currentQuizQuestions.length}</p>
        </div>
        
        {isIllustrationLoading && (
          <div className="w-full aspect-video bg-gray-700 rounded-lg flex items-center justify-center mb-4 animate-pulse">
            <p className="text-gray-400">일러스트 생성 중...</p>
          </div>
        )}
        {illustration && !isIllustrationLoading && (
          <img src={illustration} alt="퀴즈 관련 이미지" className="w-full aspect-video object-contain rounded-lg mb-4 bg-gray-900/50" />
        )}

        <p className="text-lg text-gray-200 mb-6">{question.question}</p>
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isCorrect = index === question.correctAnswerIndex;
            const isSelected = selectedAnswer === index;
            let buttonClass = 'w-full text-left p-3 rounded-lg transition-colors border-2 border-gray-600 hover:bg-gray-700';
            if (isAnswered) {
              if (isCorrect) {
                buttonClass += ' bg-green-500/30 border-green-500';
              } else if (isSelected) {
                buttonClass += ' bg-red-500/30 border-red-500';
              }
            }
            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={isAnswered}
                className={buttonClass}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
       {isAnswered && (
         <button onClick={handleNext} className="mt-6 px-6 py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors">
            {currentQuestionIndex === currentQuizQuestions.length - 1 ? '결과 보기' : '다음 문제'}
          </button>
        )}
    </div>
  );
};

export default Quiz;