<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1bFFv2gVi8UaE04NhdDzKSCR24kuS7AZP

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
/
├── public/
├── src/
│   ├── components/
│   │   ├── Dictionary.tsx      # 용어 사전 컴포넌트
│   │   ├── RuleSearch.tsx      # AI 규칙 검색 컴포넌트
│   │   ├── Quiz.tsx            # 야구 규칙 퀴즈 컴포넌트
│   │   ├── SituationalExplainer.tsx # 상황별 규칙 해설 컴포넌트
│   │   └── Icons.tsx           # SVG 아이콘 컴포넌트
│   ├── lib/
│   │   ├── dictionaryData.ts   # 용어 사전 데이터 및 일러스트 프롬프트
│   │   └── rulesData.ts        # KBO 공식 규칙 텍스트 데이터
│   ├── services/
│   │   └── geminiService.ts    # Gemini API 연동 로직
│   ├── App.tsx                 # 메인 애플리케이션 컴포넌트
│   ├── index.tsx               # React 렌더링 진입점
│   └── types.ts                # 공용 TypeScript 타입
├── index.html                  # 메인 HTML 파일
└── metadata.json               # 애플리케이션 메타데이터
git clone https://github.com/your-username/kbo-rules-master.git
cd kbo-rules-master
API_KEY=YOUR_GEMINI_API_KEY
