"use client"

import { SentimentForm } from "@/components/sentiment-form"
import { RecentAnalyses } from "@/components/recent-analyses"
import { BarChart2, TrendingUp, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-61px)] bg-gradient-to-br from-zinc-950 to-black py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center max-w-3xl mx-auto"
        >
          <div className="inline-block p-3 bg-blue-600/10 rounded-2xl mb-4">
            <BarChart2 className="h-10 w-10 text-blue-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Sentiment Analysis
          </h1>
          <p className="text-zinc-400 text-lg mb-1">
            Analyze the sentiment of tweets on any topic and gain valuable insights into public opinion
          </p>
          <p className="text-zinc-500 text-sm">by Arhaan Girdhar</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
                <div className="p-2 bg-blue-600/10 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold text-white">Analyze Tweets</h2>
              </div>
              <div className="p-6">
                <SentimentForm />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
                <div className="p-2 bg-blue-600/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold text-white">Recent Analyses</h2>
              </div>
              <RecentAnalyses />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="p-3 bg-blue-600/10 rounded-lg inline-block mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

const features = [
  {
    icon: <BarChart2 className="h-6 w-6 text-blue-500" />,
    title: "Real-time Analysis",
    description: "Get instant sentiment analysis on any topic with customizable tweet counts.",
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
    title: "Visual Insights",
    description: "View sentiment distribution through interactive charts and visualizations.",
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-blue-500" />,
    title: "Real Tweets",
    description: "See real life tweets with their sentiment classification and scores.",
  },
]

