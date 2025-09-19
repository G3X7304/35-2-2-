// FIX: Removed unused and non-exported 'ContentPart' from import.
import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';
import { QuizQuestion } from '../types';
import { KBO_RULES_2025 } from '../lib/rulesData';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const quizSchema = {
  type: Type.OBJECT,
  properties: {
    question: {
      type: Type.STRING,
      description: "야구 규칙에 대한 객관식 질문"
    },
    options: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: "4개의 선택지"
    },
    correctAnswerIndex: {
      type: Type.INTEGER,
      description: "정답 선택지의 인덱스 (0-3)"
    },
  },
  required: ["question", "options", "correctAnswerIndex"]
};

const quizSetSchema = {
    type: Type.OBJECT,
    properties: {
        quizzes: {
            type: Type.ARRAY,
            items: quizSchema
        }
    },
    required: ["quizzes"]
}


export const generateQuizSet = async (): Promise<QuizQuestion[] | null> => {
  const prompt = `
    다음 KBO 공식 야구 규칙 내용을 바탕으로, 야구 초보자가 흥미를 느낄 만한 객관식 퀴즈 질문을 15개 만들어줘.
    질문과 4개의 선택지, 그리고 정답의 인덱스를 JSON 형식으로 제공해야 해.
    질문은 너무 전문적이거나 지엽적이지 않게, 핵심적인 규칙 위주로 만들어줘. 서로 다른 내용의 질문 15개를 만들어야 해.
    
    [야구 규칙 본문]
    ${KBO_RULES_2025.substring(0, 40000)}
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            temperature: 0.7,
            topP: 0.95,
            topK: 64,
            responseMimeType: "application/json",
            responseSchema: quizSetSchema,
        },
    });

    const text = response.text.trim();
    const quizData = JSON.parse(text);

    if (quizData.quizzes && Array.isArray(quizData.quizzes) && quizData.quizzes.length > 0) {
        return quizData.quizzes as QuizQuestion[];
    }
    console.error("Invalid quiz set data structure received:", quizData);
    return null;

  } catch (error) {
    console.error("Error generating quiz set:", error);
    return null;
  }
};

export async function* streamQuery(
    systemInstruction: string,
    userQuery: string
  ): AsyncGenerator<string> {
    const prompt = `
        [야구 규칙 본문]
        ${KBO_RULES_2025}
        
        [사용자 질문]
        ${userQuery}
    `;

    try {
        const responseStream = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.5,
                topP: 0.95,
                topK: 64,
                systemInstruction: systemInstruction,
            },
        });

        for await (const chunk of responseStream) {
            yield chunk.text;
        }

    } catch (error) {
        console.error("Error in streamQuery:", error);
        yield "AI와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    }
}

export const generateIllustration = async (prompt: string, isForQuiz: boolean = false): Promise<string | null> => {
  let illustrationPrompt = `A simple, minimalist, clear line art illustration for a baseball rulebook. No text. Black and white with yellow accents. The illustration should visually represent the following baseball concept without using any words: ${prompt}`;
  
  if (isForQuiz) {
    illustrationPrompt = `A simple, minimalist, clear line art illustration for a baseball rulebook. No text. Black and white with yellow accents. The illustration should be related to the theme of the question but remain ambiguous and NOT give away the correct answer. The question is about: ${prompt}`;
  }
    
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: illustrationPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    }
    return null;
  } catch (error) {
    console.error("Error generating illustration:", error);
    return null;
  }
};