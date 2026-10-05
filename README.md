# FastGrowth SaaS Startup

**Website:** [https://fastgrowthsa.com/](https://fastgrowthsa.com/)

FastGrowth is an innovative AI-powered SaaS platform designed to accelerate the growth of e-commerce businesses and startups. It provides a comprehensive suite of intelligent tools that automate marketing, customer service, and store optimization.

## Features & AI Capabilities

FastGrowth leverages cutting-edge Artificial Intelligence (using APIs like Groq, Gemini, and Claude) to deliver the following services:

- **Smart Chatbot Maker:** Train a custom AI customer service agent for your store in seconds. It understands your store policies, tone of voice, and products to assist customers intelligently.
- **Meta Ads Generator:** Generate highly converting ad copies for Facebook, Instagram, and TikTok using psychological marketing strategies.
- **Store Audit & SEO Analyzer:** Deep AI analysis of your e-commerce store's UI/UX and SEO with actionable insights to increase conversion rates.
- **AI Image Generation:** Create professional product photography and lifestyle images instantly.
- **Content Ideas Generator:** Generate viral content ideas tailored to your target audience.
- **SEO Product Descriptions:** Write SEO-optimized product descriptions that rank higher on search engines.
- **Competitor Price Analyzer:** Analyze competitor pricing strategies to position your products effectively.
- **Store Designer:** Generate professional UI/UX store layouts using AI.

## Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS
- **Backend/Database:** Supabase (PostgreSQL)
- **AI Integrations:** Groq (Llama 3), Google Gemini, Anthropic Claude, Stable Horde API
- **Deployment:** Vercel

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ranahassan2/fastgrowth-saas-startup.git
cd fastgrowth-saas-startup
```

2. Install dependencies:
```bash
npm install
```

3. Configure Environment Variables:
Create a `.env.local` file in the root directory and add your API keys:
```env
VITE_GROQ_API_KEY=your_groq_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_ANTHROPIC_API_KEY=your_claude_api_key
VITE_HORDE_API_KEY=your_horde_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

## Security
All sensitive API keys and database credentials are securely loaded via environment variables and are NOT committed to the repository.
