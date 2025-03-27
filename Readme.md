# Twitter Sentiment Analysis

A modern web application that performs real-time sentiment analysis on tweets using Natural Language Processing (NLP) and the Twitter API. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔍 Real-time tweet analysis using Twitter API
- 📊 Sentiment analysis with natural language processing
- 📈 Interactive data visualization
- 🎨 Modern, responsive UI with dark mode
- 🔒 Secure API key management
- 📱 Mobile-friendly design
- 📊 Visual Data Representation: View sentiment distribution through interactive pie charts
- 💬 Sample Tweet Display: See examples of tweets with their sentiment classification
- 🔐 User Authentication: Create an account to save your analysis history
- 📜 Recent Analysis History: Track and revisit your previous analyses

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
  - JWT for authentication
  - bcrypt for password hashing
  - webworker-threads for parallel processing
  - aws4 for AWS authentication

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
JWT_SECRET=your_jwt_secret
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/17arhaan/Sentiment_Analysis.git
   cd Sentiment_Analysis
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables as described above.

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a topic or hashtag in the search bar
2. Click "Analyze" to fetch and analyze tweets
3. View sentiment analysis results and visualizations
4. Explore individual tweet sentiments and details
5. Save your analysis history by creating an account

## API Endpoints

- `GET /api/analyses` - Get sentiment analysis results
- `POST /api/analyses` - Perform new sentiment analysis
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/user/analyses` - Get user's analysis history

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
- Website: [arhaanportfolio.in](https://www.arhaanportfolio.in)
- GitHub: [@arhaangirdhar](https://github.com/17arhaan)
- LinkedIn: [Arhaan Girdhar](https://linkedin.com/in/arhaan17)
- Email: 17arhaan.connect@gmail.com

## Acknowledgments

- [Twitter API](https://developer.twitter.com/en/docs/twitter-api)
- [Natural.js](https://github.com/NaturalNode/natural)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [MongoDB](https://www.mongodb.com/)
- [JWT](https://jwt.io/)
- [bcrypt](https://github.com/dcodeIO/bcrypt.js/)

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

