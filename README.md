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
⚾ KBO 야구 규칙 마스터 (KBO Baseball Rules Master)
![alt text](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)

![alt text](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

![alt text](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

![alt text](https://img.shields.io/badge/Google_Gemini-8E75B8?style=for-the-badge&logo=google&logoColor=white)
KBO 공식 야구 규칙을 누구나 쉽고 재미있게 학습할 수 있도록 돕는 AI 기반 인터랙티브 웹 애플리케이션입니다. Google Gemini API를 활용하여 복잡한 야구 규칙을 용어 사전, AI 규칙 검색, 퀴즈, 상황별 해설 등 네 가지 핵심 기능을 통해 제공합니다.
( 여기에 애플리케이션 스크린샷이나 GIF를 추가하세요. )
![App Screenshot](./screenshot.png)
✨ 주요 기능 (Key Features)
📚 용어 사전 (Dictionary)
아코디언 UI: 궁금한 용어를 클릭하면 정의가 펼쳐져 편리하게 내용을 확인할 수 있습니다.
AI 기반 일러스트: 각 용어에 대한 상세한 프롬프트를 기반으로, AI가 상황에 맞는 정확한 일러스트를 실시간으로 생성하여 시각적 이해를 돕습니다.
실시간 검색: 용어와 정의 내용을 기반으로 한 강력한 검색 기능으로 원하는 정보를 빠르게 찾을 수 있습니다.
🤖 AI 규칙 검색 (AI Rule Search)
대화형 인터페이스: 채팅을 통해 자연스러운 언어로 야구 규칙에 대해 질문할 수 있습니다.
실시간 스트리밍 답변: Gemini AI가 KBO 공식 규칙집을 기반으로 실시간으로 답변을 생성하여, 마치 전문가와 대화하는 듯한 경험을 제공합니다.
질문 예시 제공: (예: 병살이 뭐에요?)와 같은 안내 문구로 처음 사용하는 사람도 쉽게 질문을 시작할 수 있습니다.
🧠 야구 규칙 퀴즈 (Quiz)
동적 문제 생성: 앱을 실행할 때마다 AI가 규칙집을 기반으로 새로운 15개의 퀴즈 세트를 생성합니다.
무작위 문제 출제: 생성된 문제 중 5개를 무작위로 출제하여 매번 새로운 퀴즈 경험을 제공합니다.
도전적인 일러스트: 정답을 직접적으로 알려주지 않는 모호한 힌트의 일러스트가 함께 제공되어, 퀴즈의 난이도와 재미를 더합니다.
학습 결과 확인: 퀴즈 종료 후 점수를 확인하고, '다시 풀어보기'를 통해 반복 학습이 가능합니다.
⚾ 상황별 규칙 해설 (Situational Explainer)
복잡한 상황 분석: "1사 1,3루에서 타자가 스퀴즈 번트를 댔는데 투수가 공을 더듬었어요"와 같이 복잡한 경기 상황을 입력하면, AI가 적용되는 규칙과 판정 결과를 상세히 설명합니다.
상황 재현 일러스트: AI가 사용자의 질문과 자신의 답변을 종합하여 해당 상황을 시각적으로 재현한 맞춤형 일러스트를 생성해줍니다.
🛠️ 기술 스택 (Technology Stack)
프론트엔드: React, TypeScript
스타일링: Tailwind CSS
AI 모델:
텍스트 생성 및 분석: Google Gemini (gemini-2.5-flash)
이미지 생성: Google Imagen (imagen-4.0-generate-001)
API 라이브러리: @google/genai
모듈 로딩: Import Maps (Vite, Webpack 등 번들러 없이 브라우저에서 직접 모듈을 로드)
⚙️ 프로젝트 구조 (Project Structure)
code
Code
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
🚀 시작하기 (Getting Started)
프로젝트를 로컬 환경에서 실행하려면 아래 단계를 따르세요.
사전 준비
Google AI Studio에서 Gemini API 키를 발급받으세요.
설치 및 실행
저장소 복제:
code
Bash
git clone https://github.com/your-username/kbo-rules-master.git
cd kbo-rules-master
API 키 설정:
프로젝트 루트 디렉토리에 .env 파일을 생성하고 발급받은 API 키를 추가합니다.
code
Code
API_KEY=YOUR_GEMINI_API_KEY
참고: 이 프로젝트는 별도의 빌드 과정이 없으므로, process.env.API_KEY를 코드에서 직접 사용하려면 Vite와 같은 개발 서버 환경이 필요합니다. 간단한 테스트를 위해서는 geminiService.ts 파일 내의 API_KEY 변수에 직접 키를 할당할 수 있습니다. (단, 이 방법을 사용할 경우 Git에 키를 커밋하지 않도록 주의하세요.)
라이브 서버 실행:
이 프로젝트는 번들러 없이 구성되어 있으므로, 간단한 HTTP 서버로 실행할 수 있습니다. VS Code의 Live Server 확장 프로그램을 사용하는 것을 권장합니다.
VS Code에서 index.html 파일을 열고 우클릭 후 Open with Live Server를 선택하세요.
이제 브라우저에서 KBO 야구 규칙 마스터 애플리케이션을 확인할 수 있습니다
