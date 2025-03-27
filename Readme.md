# Twitter Sentiment Analysis

A modern web application that performs real-time sentiment analysis on tweets using Natural Language Processing (NLP) and the Twitter API. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔍 Real-time tweet analysis using Twitter API
- 📊 Sentiment analysis with natural language processing
- 📈 Interactive data visualization
- 🎨 Modern, responsive UI with dark mode
- 🔒 Secure API key management
- 📱 Mobile-friendly design

## Tech Stack

- **Frontend:**
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Chart.js
  - Lucide Icons

- **Backend:**
  - Node.js
  - Natural.js for NLP
  - Twitter API v2
  - MongoDB for data storage

## Prerequisites

- Node.js 18.x or later
- Twitter API credentials
- MongoDB connection string

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_SECRET=your_twitter_access_secret
MONGODB_URI=your_mongodb_connection_string
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/twitter-sentiment-analysis.git
   cd twitter-sentiment-analysis
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up environment variables as described above.

4. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a topic or hashtag in the search bar
2. Click "Analyze" to fetch and analyze tweets
3. View sentiment analysis results and visualizations
4. Explore individual tweet sentiments and details

## API Endpoints

- `GET /api/analyses` - Get sentiment analysis results
- `POST /api/analyses` - Perform new sentiment analysis

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Arhaan Girdhar
- Website: [arhaangirdhar.com](https://arhaangirdhar.com)
- GitHub: [@arhaangirdhar](https://github.com/arhaangirdhar)
- LinkedIn: [Arhaan Girdhar](https://linkedin.com/in/arhaangirdhar)
- Email: 17arhaan.connect@gmail.com

## Acknowledgments

- [Twitter API](https://developer.twitter.com/en/docs/twitter-api)
- [Natural.js](https://github.com/NaturalNode/natural)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

![Twitter Sentiment Analysis Dashboard](https://placeholder.svg?height=400&width=800)

## Features

- **Real-time Sentiment Analysis**: Analyze tweets on any topic with customizable sample size
- **Visual Data Representation**: View sentiment distribution through interactive pie charts
- **Sample Tweet Display**: See examples of tweets with their sentiment classification
- **User Authentication**: Create an account to save your analysis history
- **Recent Analysis History**: Track and revisit your previous analyses
- **Dark Theme**: Sleek black-themed UI for comfortable viewing
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT, bcrypt
- **Twitter API**: Twitter API v2 via twitter-api-v2
- **Sentiment Analysis**: Natural.js with AFINN lexicon

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/17arhaan/Sentiment_Analysis.git
   cd twitter-sentiment-analysis

