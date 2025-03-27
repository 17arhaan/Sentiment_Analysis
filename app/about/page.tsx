"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, MapPin, GraduationCap, Code2, Users, FolderKanban, Globe, BarChart2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-61px)] bg-gradient-to-br from-zinc-950 to-black py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 overflow-hidden">
            <div className="p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center mb-12"
              >
                <div className="relative w-28 h-28 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10">
                    <Image
                      src="/pfp.png"
                      alt="Arhaan Girdhar"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Arhaan Girdhar
                </h1>
                <p className="text-zinc-400 text-base mb-4">
                  Software Engineer & AI Enthusiast
                </p>
                <p className="text-zinc-500 max-w-xl mx-auto text-sm">
                  A passionate developer with a strong foundation in software engineering and a keen interest in artificial intelligence.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 text-zinc-300 mb-2">
                      <GraduationCap className="h-5 w-5 text-blue-400" />
                      <h2 className="text-sm font-medium">Education</h2>
                    </div>
                    <p className="text-zinc-400 text-sm">B.Tech in Computer Science</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 text-zinc-300 mb-2">
                      <MapPin className="h-5 w-5 text-purple-400" />
                      <h2 className="text-sm font-medium">Location</h2>
                    </div>
                    <p className="text-zinc-400 text-sm">Noida, India</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 text-zinc-300 mb-2">
                      <Mail className="h-5 w-5 text-pink-400" />
                      <h2 className="text-sm font-medium">Contact</h2>
                    </div>
                    <p className="text-zinc-400 text-sm">17arhaan.connect@gmail.com</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-blue-400/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Code2 className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="text-base font-medium">AI & ML</h3>
                    </div>
                    <p className="text-sm text-zinc-400">
                      Deep expertise in machine learning, natural language processing, and artificial intelligence applications.
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-400/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Users className="w-5 h-5 text-purple-400" />
                      </div>
                      <h3 className="text-base font-medium">Problem Solving</h3>
                    </div>
                    <p className="text-sm text-zinc-400">
                      Strong analytical and problem-solving skills with a track record of delivering innovative solutions.
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 text-zinc-300 mb-4">
                    <FolderKanban className="h-5 w-5 text-pink-400" />
                    <h2 className="text-base font-medium">Featured Projects</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                      href="/"
                      className="group bg-white/5 rounded-xl p-4 border border-white/10 hover:border-blue-400/30 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <BarChart2 className="h-5 w-5 text-blue-400" />
                        <h3 className="text-sm font-medium text-zinc-300 group-hover:text-blue-400 transition-colors">
                          Twitter Sentiment Analysis
                        </h3>
                      </div>
                      <p className="text-zinc-400 text-sm">
                        Real-time sentiment analysis of tweets using NLP and Twitter API
                      </p>
                    </Link>

                    <Link
                      href="https://arhaangirdhar.com/portfolio"
                      target="_blank"
                      className="group bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-400/30 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="h-5 w-5 text-purple-400" />
                        <h3 className="text-sm font-medium text-zinc-300 group-hover:text-purple-400 transition-colors">
                          Personal Portfolio
                        </h3>
                      </div>
                      <p className="text-zinc-400 text-sm">
                        Modern portfolio showcasing my projects and skills
                      </p>
                    </Link>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Link
                    href="https://github.com/arhaangirdhar"
                    target="_blank"
                    className="p-3 bg-white/5 rounded-xl text-zinc-300 hover:bg-white/10 transition-colors border border-white/10"
                  >
                    <Github className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://linkedin.com/in/arhaangirdhar"
                    target="_blank"
                    className="p-3 bg-white/5 rounded-xl text-zinc-300 hover:bg-white/10 transition-colors border border-white/10"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link
                    href="mailto:17arhaan.connect@gmail.com"
                    className="p-3 bg-white/5 rounded-xl text-zinc-300 hover:bg-white/10 transition-colors border border-white/10"
                  >
                    <Mail className="h-5 w-5" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

