"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  ChefHat,
  Sparkles,
  Scissors,
  Heart,
  Copy,
  Check,
  Droplet,
  Leaf,
  DollarSign,
  Shield,
  Zap,
  Clock,
  Play,
  RotateCcw,
  Eye,
  Presentation,
  Sun,
  Moon,
  Minimize2,
  X,
  CheckCircle2,
  XCircle,
  Trophy,
  Sparkle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import confetti from "canvas-confetti"

const slides = [
  {
    id: 1,
    text: "Olive oil is commonly used in cooking because it gives food a delicious flavor and makes it healthier.",
    icon: ChefHat,
    image: "/olive-oil-cooking-in-kitchen-with-vegetables.jpg",
    alt: "Olive oil being used in cooking with fresh vegetables",
  },
  {
    id: 2,
    text: "Many people apply olive oil to their skin because it helps keep it soft, smooth, and well hydrated.",
    icon: Sparkles,
    image: "/olive-oil-skincare-natural-beauty-treatment.jpg",
    alt: "Olive oil being applied for skincare",
  },
  {
    id: 3,
    text: "Olive oil is also used on hair to make it shiny, strong, and easy to manage.",
    icon: Scissors,
    image: "/olive-oil-hair-treatment-shiny-healthy-hair.jpg",
    alt: "Olive oil being used as hair treatment",
  },
  {
    id: 4,
    text: "Some people use olive oil for massages or to remove makeup because it is natural and gentle on the skin.",
    icon: Heart,
    image: "/olive-oil-massage-and-makeup-removal-spa.jpg",
    alt: "Olive oil being used for massage and makeup removal",
  },
]

const quizQuestions = [
  {
    question: "Olive oil is commonly used in cooking.",
    type: "true-false" as const,
    correctAnswer: "true",
    explanation: "Yes! Olive oil gives food delicious flavor and makes it healthier.",
  },
  {
    question: "Which of these is NOT a use of olive oil?",
    type: "multiple" as const,
    options: ["Cooking", "Skincare", "Cleaning windows", "Hair treatment"],
    correctAnswer: "Cleaning windows",
    explanation: "Olive oil is used for cooking, skincare, and hair treatment, but not for cleaning windows!",
  },
  {
    question: "Olive oil helps keep skin soft and hydrated.",
    type: "true-false" as const,
    correctAnswer: "true",
    explanation: "Correct! Many people apply olive oil to their skin for hydration.",
  },
  {
    question: "What does olive oil do for hair?",
    type: "multiple" as const,
    options: ["Makes it shiny", "Makes it strong", "Makes it easy to manage", "All of the above"],
    correctAnswer: "All of the above",
    explanation: "Olive oil makes hair shiny, strong, and easy to manage!",
  },
  {
    question: "Olive oil can be used to remove makeup.",
    type: "true-false" as const,
    correctAnswer: "true",
    explanation: "Yes! Olive oil is natural and gentle, perfect for removing makeup.",
  },
  {
    question: "Why is olive oil good for massages?",
    type: "multiple" as const,
    options: ["It's natural", "It's gentle on skin", "It's affordable", "All of the above"],
    correctAnswer: "All of the above",
    explanation: "Olive oil is natural, gentle, and affordable - perfect for massages!",
  },
  {
    question: "Olive oil is only used for cooking.",
    type: "true-false" as const,
    correctAnswer: "false",
    explanation: "False! Olive oil has many uses: cooking, skincare, hair care, and more.",
  },
  {
    question: "How many main uses of olive oil did we learn about?",
    type: "multiple" as const,
    options: ["2", "3", "4", "5"],
    correctAnswer: "4",
    explanation: "We learned 4 main uses: cooking, skincare, hair care, and massage/makeup removal!",
  },
]

export default function OliveOilLanding() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [copied, setCopied] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [copyCount, setCopyCount] = useState(0)
  const [largeText, setLargeText] = useState(false)
  const [highlightKeywords, setHighlightKeywords] = useState(false)
  const [showMoreTips, setShowMoreTips] = useState(false)
  const [presentationMode, setPresentationMode] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [timeLeft, setTimeLeft] = useState(15)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizWon, setQuizWon] = useState(false)
  const [showSecondChance, setShowSecondChance] = useState(false)
  const [secondChanceQuestion, setSecondChanceQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<{ question: string; userAnswer: string; correct: boolean }[]>([])
  const [showReview, setShowReview] = useState(false)
  const [goldenFilter, setGoldenFilter] = useState(false)
  const [quizAttempts, setQuizAttempts] = useState(0)

  // Fun stats
  const [usesShown] = useState(4)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  const copyText = async (text: string, id: number) => {
    await navigator.clipboard.writeText(text)
    setCopied(id)
    setCopyCount((prev) => prev + 1)
    setTimeout(() => setCopied(null), 2000)
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" })
  }

  const highlightText = (text: string) => {
    if (!highlightKeywords) return text

    const keywords = [
      "cooking",
      "flavor",
      "healthier",
      "skin",
      "soft",
      "hydrated",
      "hair",
      "shiny",
      "strong",
      "massages",
      "makeup",
      "natural",
      "gentle",
    ]
    let highlightedText = text

    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi")
      highlightedText = highlightedText.replace(regex, `<mark class="bg-golden/30 px-1 rounded">$&</mark>`)
    })

    return highlightedText
  }

  // Autoplay
  useEffect(() => {
    if (isPaused || presentationMode) return
    const interval = setInterval(nextSlide, presentationMode ? 8000 : 5000)
    return () => clearInterval(interval)
  }, [isPaused, nextSlide, presentationMode])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (quizStarted && !quizCompleted) return
      if (e.key === "ArrowLeft") prevSlide()
      if (e.key === "ArrowRight") nextSlide()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [nextSlide, prevSlide, quizStarted, quizCompleted])

  // Touch swipe
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) nextSlide()
    if (touchStart - touchEnd < -75) prevSlide()
  }

  // Quiz timer
  useEffect(() => {
    if (!quizStarted || quizCompleted || showFeedback || showSecondChance) return

    if (timeLeft === 0) {
      handleTimeout()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, timeLeft, quizCompleted, showFeedback, showSecondChance])

  const handleTimeout = () => {
    setLives((prev) => prev - 1)
    setShowFeedback(true)
    setIsCorrect(false)
    setUserAnswers((prev) => [
      ...prev,
      {
        question: quizQuestions[currentQuestion].question,
        userAnswer: "No answer (timeout)",
        correct: false,
      },
    ])

    setTimeout(() => {
      if (lives - 1 <= 0) {
        endQuiz(false)
      } else {
        nextQuestion()
      }
    }, 2000)
  }

  const startQuiz = () => {
    setQuizStarted(true)
    setCurrentQuestion(0)
    setScore(0)
    setLives(3)
    setTimeLeft(15)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setQuizCompleted(false)
    setQuizWon(false)
    setShowSecondChance(false)
    setUserAnswers([])
    setShowReview(false)
    setQuizAttempts((prev) => prev + 1)
  }

  const handleAnswer = (answer: string) => {
    if (showFeedback) return
    setSelectedAnswer(answer)

    const question = quizQuestions[currentQuestion]
    const correct = answer === question.correctAnswer

    setIsCorrect(correct)
    setShowFeedback(true)

    setUserAnswers((prev) => [
      ...prev,
      {
        question: question.question,
        userAnswer: answer,
        correct,
      },
    ])

    if (correct) {
      setScore((prev) => prev + 1)
    } else {
      setLives((prev) => prev - 1)
      if (lives - 1 <= 0) {
        setTimeout(() => endQuiz(false), 2000)
        return
      }
    }

    setTimeout(() => {
      if (currentQuestion + 1 >= quizQuestions.length) {
        endQuiz(true)
      } else {
        nextQuestion()
      }
    }, 2000)
  }

  const nextQuestion = () => {
    setCurrentQuestion((prev) => prev + 1)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setTimeLeft(15)
  }

  const endQuiz = (won: boolean) => {
    setQuizCompleted(true)
    setQuizWon(won)

    if (won) {
      triggerWinEffects()
    } else {
      triggerLoseEffects()
    }
  }

  const triggerWinEffects = () => {
    // Confetti
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#3A5A40", "#A3B18A", "#D4A373"],
      })
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#3A5A40", "#A3B18A", "#D4A373"],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()

    // Fireworks
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3A5A40", "#A3B18A", "#D4A373", "#F6F6F3"],
      })
    }, 500)

    // Golden filter
    setGoldenFilter(true)
    setTimeout(() => setGoldenFilter(false), 10000)

    // Celebration sound (simulated with vibration)
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200])
    }
  }

  const triggerLoseEffects = () => {
    // Vibration
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200])
    }

    // Show second chance after a delay
    setTimeout(() => {
      setShowSecondChance(true)
      setSecondChanceQuestion(0)
      setTimeLeft(15)
    }, 3000)
  }

  const startSecondChance = () => {
    setShowSecondChance(true)
    setSecondChanceQuestion(0)
    setTimeLeft(15)
    setSelectedAnswer(null)
    setShowFeedback(false)
  }

  const handleSecondChanceAnswer = (answer: string) => {
    if (showFeedback) return
    setSelectedAnswer(answer)

    const question = quizQuestions[secondChanceQuestion]
    const correct = answer === question.correctAnswer

    setIsCorrect(correct)
    setShowFeedback(true)

    if (!correct) {
      setTimeout(() => {
        setShowSecondChance(false)
      }, 2000)
      return
    }

    setTimeout(() => {
      if (secondChanceQuestion + 1 >= 3) {
        // Won second chance!
        setQuizWon(true)
        setShowSecondChance(false)
        triggerSecondChanceWin()
      } else {
        setSecondChanceQuestion((prev) => prev + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
        setTimeLeft(15)
      }
    }, 2000)
  }

  const triggerSecondChanceWin = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#3A5A40", "#A3B18A", "#D4A373"],
    })
  }

  const downloadBadge = () => {
    const canvas = document.createElement("canvas")
    canvas.width = 400
    canvas.height = 400
    const ctx = canvas.getContext("2d")

    if (ctx) {
      // Background
      ctx.fillStyle = "#3A5A40"
      ctx.fillRect(0, 0, 400, 400)

      // Circle
      ctx.fillStyle = "#D4A373"
      ctx.beginPath()
      ctx.arc(200, 200, 150, 0, Math.PI * 2)
      ctx.fill()

      // Text
      ctx.fillStyle = "#F6F6F3"
      ctx.font = "bold 32px Arial"
      ctx.textAlign = "center"
      ctx.fillText("OLIVE MASTER", 200, 180)
      ctx.font = "24px Arial"
      ctx.fillText("🏆", 200, 220)
      ctx.font = "18px Arial"
      ctx.fillText(`Score: ${score}/${quizQuestions.length}`, 200, 250)
    }

    const link = document.createElement("a")
    link.download = "olive-master-badge.png"
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div
      className={`min-h-screen ${highContrast ? "bg-black text-white" : "bg-warm-white"} ${
        goldenFilter ? "relative" : ""
      } transition-colors duration-300`}
    >
      {goldenFilter && (
        <div className="fixed inset-0 bg-golden/20 pointer-events-none z-50 animate-pulse" aria-hidden="true" />
      )}

      {/* FixedNavbar */}
      {!presentationMode && (
        <nav
          className={`fixed top-0 left-0 right-0 z-50 ${
            highContrast ? "bg-black border-white" : "bg-warm-white/95 border-olive-light/20"
          } backdrop-blur-sm border-b transition-colors duration-300`}
        >
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 text-2xl">
              <span>🌿</span>
              <span className={`font-semibold ${highContrast ? "text-white" : "text-olive-dark"}`}>Olive Oil</span>
            </div>
            <div className="flex items-center gap-8 text-sm font-medium">
              <button
                onClick={() => scrollToSection("home")}
                className={`${
                  highContrast ? "text-white hover:text-golden" : "text-olive-dark hover:text-golden"
                } transition-colors`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("carousel")}
                className={`${
                  highContrast ? "text-white hover:text-golden" : "text-olive-dark hover:text-golden"
                } transition-colors`}
              >
                Uses
              </button>
              <button
                onClick={() => scrollToSection("game")}
                className={`${
                  highContrast ? "text-white hover:text-golden" : "text-olive-dark hover:text-golden"
                } transition-colors`}
              >
                Game
              </button>
              <button
                onClick={() => scrollToSection("fun-stats")}
                className={`${
                  highContrast ? "text-white hover:text-golden" : "text-olive-dark hover:text-golden"
                } transition-colors`}
              >
                Fun
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Hero Section */}
      <section
        id="home"
        className={`relative ${presentationMode ? "pt-20 pb-16" : "pt-32 pb-20"} px-4 overflow-hidden`}
      >
        {/* Particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-olive-light/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={
                reduceMotion
                  ? {}
                  : {
                      y: [0, -30, 0],
                      opacity: [0.2, 0.5, 0.2],
                    }
              }
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.8 }}
          className="container mx-auto text-center relative z-10"
        >
          <motion.div
            animate={reduceMotion ? {} : { y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className={`inline-block mb-6 ${presentationMode ? "text-8xl" : "text-6xl"}`}
          >
            🫒
          </motion.div>
          <h1
            className={`${
              presentationMode ? "text-6xl md:text-8xl" : "text-5xl md:text-7xl"
            } font-bold ${highContrast ? "text-white" : "text-olive-dark"} mb-6 text-balance`}
          >
            Olive Oil: Everyday Uses
          </h1>
          <p
            className={`${presentationMode ? "text-2xl md:text-3xl" : "text-lg md:text-xl"} ${
              highContrast ? "text-gray-300" : "text-olive-light"
            } max-w-2xl mx-auto mb-8 text-pretty`}
          >
            Discover the natural benefits and versatile applications of olive oil in your daily life
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={() => scrollToSection("carousel")}
              size="lg"
              className={`${
                highContrast
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-olive-dark hover:bg-olive-dark/90 text-warm-white"
              } px-8 py-6 ${
                presentationMode ? "text-xl" : "text-lg"
              } rounded-full transition-all hover:scale-105 hover:shadow-lg`}
            >
              Explore Uses
            </Button>
            <Button
              onClick={() => scrollToSection("game")}
              size="lg"
              variant="outline"
              className={`${
                highContrast
                  ? "border-white text-white hover:bg-white hover:text-black"
                  : "border-olive-dark text-olive-dark hover:bg-olive-dark hover:text-warm-white"
              } px-8 py-6 ${
                presentationMode ? "text-xl" : "text-lg"
              } rounded-full transition-all hover:scale-105 hover:shadow-lg`}
            >
              <Play className="w-5 h-5 mr-2" />
              Play Game
            </Button>
          </div>
        </motion.div>

        {/* Parallax background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: highContrast ? 0.05 : 0.1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-b from-olive-light/10 to-transparent"
          aria-hidden="true"
        />
      </section>

      {/* Carousel Section */}
      <section
        id="carousel"
        className={`${presentationMode ? "py-16" : "py-20"} px-4 ${
          highContrast ? "bg-black" : "bg-gradient-to-b from-warm-white to-olive-light/5"
        }`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={`container mx-auto ${presentationMode ? "max-w-7xl" : "max-w-6xl"}`}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${presentationMode ? "text-5xl md:text-6xl" : "text-4xl md:text-5xl"} font-bold ${
              highContrast ? "text-white" : "text-olive-dark"
            } text-center mb-12`}
          >
            Four Amazing Uses
          </motion.h2>

          <div className="relative">
            <div
              className="relative overflow-hidden rounded-2xl"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait" custom={currentSlide}>
                <motion.div
                  key={currentSlide}
                  custom={currentSlide}
                  initial={reduceMotion ? {} : { opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? {} : { opacity: 0, x: -100 }}
                  transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeInOut" }}
                  className={`${
                    highContrast ? "bg-gray-900 border-2 border-white" : "bg-white"
                  } rounded-2xl shadow-xl overflow-hidden`}
                >
                  <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                    {/* Content */}
                    <motion.div
                      initial={reduceMotion ? {} : { opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: reduceMotion ? 0 : 0.2, duration: reduceMotion ? 0 : 0.5 }}
                      className="flex flex-col justify-center"
                    >
                      <motion.div
                        initial={reduceMotion ? {} : { opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: reduceMotion ? 0 : 0.1, duration: reduceMotion ? 0 : 0.4 }}
                        className={`${presentationMode ? "text-9xl" : "text-8xl"} font-bold text-golden/20 mb-4`}
                      >
                        {slides[currentSlide].id}
                      </motion.div>

                      <motion.div
                        initial={reduceMotion ? {} : { opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: reduceMotion ? 0 : 0.3, duration: reduceMotion ? 0 : 0.5 }}
                        className="mb-6"
                      >
                        {(() => {
                          const Icon = slides[currentSlide].icon
                          return (
                            <Icon
                              className={`${presentationMode ? "w-16 h-16" : "w-12 h-12"} ${
                                highContrast ? "text-white" : "text-olive-dark"
                              }`}
                            />
                          )
                        })()}
                      </motion.div>

                      <motion.div
                        initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: reduceMotion ? 0 : 0.4, duration: reduceMotion ? 0 : 0.5 }}
                        className={`${largeText ? "text-xl md:text-2xl" : "text-lg md:text-xl"} ${
                          highContrast ? "text-white" : "text-olive-dark"
                        } leading-relaxed mb-6 text-pretty`}
                        dangerouslySetInnerHTML={{ __html: highlightText(slides[currentSlide].text) }}
                      />

                      <motion.div
                        initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: reduceMotion ? 0 : 0.5, duration: reduceMotion ? 0 : 0.5 }}
                      >
                        <Button
                          onClick={() => copyText(slides[currentSlide].text, slides[currentSlide].id)}
                          variant="outline"
                          className={`${
                            highContrast
                              ? "border-white text-white hover:bg-white hover:text-black"
                              : "border-olive-dark text-olive-dark hover:bg-olive-dark hover:text-warm-white"
                          } transition-all hover:scale-105`}
                        >
                          {copied === slides[currentSlide].id ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy text
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                      initial={reduceMotion ? {} : { opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: reduceMotion ? 0 : 0.3, duration: reduceMotion ? 0 : 0.5 }}
                      className="relative h-64 md:h-full min-h-[300px] rounded-xl overflow-hidden"
                    >
                      <img
                        src={slides[currentSlide].image || "/placeholder.svg"}
                        alt={slides[currentSlide].alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                highContrast ? "bg-white text-black hover:bg-gray-200" : "bg-white/90 hover:bg-white text-olive-dark"
              } p-3 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-olive-dark hidden md:block`}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                highContrast ? "bg-white text-black hover:bg-gray-200" : "bg-white/90 hover:bg-white text-olive-dark"
              } p-3 rounded-full shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-olive-dark hidden md:block`}
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Pagination Dots & Counter */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-olive-dark ${
                      index === currentSlide
                        ? highContrast
                          ? "bg-white w-8"
                          : "bg-olive-dark w-8"
                        : highContrast
                          ? "bg-gray-600 hover:bg-gray-500"
                          : "bg-olive-light/40 hover:bg-olive-light"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <span className={`text-sm font-medium ${highContrast ? "text-white" : "text-olive-dark"}`}>
                {currentSlide + 1}/{slides.length}
              </span>
            </div>
          </div>

          {/* Removed Copy Panel sidebar */}
        </div>
      </section>

      {/* Quick Benefits Grid */}
      <section className={`py-20 px-4 ${highContrast ? "bg-gray-900" : "bg-warm-white"}`}>
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-4xl md:text-5xl font-bold ${highContrast ? "text-white" : "text-olive-dark"} text-center mb-12`}
          >
            Quick Benefits
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Heart, title: "Heart-healthy", desc: "Good fats for cardiovascular health" },
              { icon: Zap, title: "Versatile", desc: "Multiple uses in daily life" },
              { icon: DollarSign, title: "Budget-friendly", desc: "Affordable natural solution" },
              { icon: Leaf, title: "Natural", desc: "Pure and organic ingredient" },
              { icon: Shield, title: "Gentle on skin", desc: "Safe for sensitive skin" },
              { icon: Sparkle, title: "Shiny hair", desc: "Natural shine and strength" },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={reduceMotion ? {} : { scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                className={`${
                  highContrast ? "bg-black border-2 border-white" : "bg-white"
                } rounded-xl p-6 shadow-lg transition-all cursor-pointer`}
              >
                <benefit.icon className={`w-10 h-10 ${highContrast ? "text-white" : "text-olive-dark"} mb-4`} />
                <h3 className={`text-xl font-bold ${highContrast ? "text-white" : "text-olive-dark"} mb-2`}>
                  {benefit.title}
                </h3>
                <p className={`${highContrast ? "text-gray-300" : "text-olive-light"}`}>{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fun Stats */}
      <section id="fun-stats" className={`py-20 px-4 ${highContrast ? "bg-black" : "bg-olive-light/5"}`}>
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-4xl md:text-5xl font-bold ${highContrast ? "text-white" : "text-olive-dark"} text-center mb-12`}
          >
            Fun Stats
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              { value: usesShown, label: "Uses Shown", icon: Droplet },
              { value: quizAttempts, label: "Quiz Attempts", icon: Play },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${
                  highContrast ? "bg-gray-900 border-2 border-white" : "bg-white"
                } rounded-2xl p-8 shadow-xl text-center`}
              >
                <stat.icon className={`w-12 h-12 ${highContrast ? "text-white" : "text-olive-dark"} mx-auto mb-4`} />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className={`text-5xl font-bold ${highContrast ? "text-white" : "text-golden"} mb-2`}
                >
                  {stat.value}
                </motion.div>
                <p className={`text-lg ${highContrast ? "text-gray-300" : "text-olive-light"}`}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz Game Section */}
      <section id="game" className={`py-20 px-4 ${highContrast ? "bg-gray-900" : "bg-warm-white"}`}>
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-4xl md:text-5xl font-bold ${highContrast ? "text-white" : "text-olive-dark"} text-center mb-12`}
          >
            Quiz Challenge
          </motion.h2>

          {!quizStarted && !quizCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${
                highContrast ? "bg-black border-2 border-white" : "bg-white"
              } rounded-2xl shadow-2xl p-8 md:p-12 text-center`}
            >
              <Trophy className={`w-20 h-20 ${highContrast ? "text-white" : "text-golden"} mx-auto mb-6`} />
              <h3 className={`text-3xl font-bold ${highContrast ? "text-white" : "text-olive-dark"} mb-4`}>
                Test Your Olive Oil Knowledge!
              </h3>
              <p className={`text-lg ${highContrast ? "text-gray-300" : "text-olive-light"} mb-8`}>
                Answer {quizQuestions.length} questions about olive oil uses. You have 3 lives and 15 seconds per
                question. Good luck!
              </p>
              <Button
                onClick={startQuiz}
                size="lg"
                className={`${
                  highContrast
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-olive-dark hover:bg-olive-dark/90 text-warm-white"
                } px-12 py-6 text-xl rounded-full transition-all hover:scale-105 hover:shadow-lg`}
              >
                <Play className="w-6 h-6 mr-2" />
                Start Quiz
              </Button>
            </motion.div>
          )}

          {quizStarted && !quizCompleted && !showSecondChance && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${highContrast ? "bg-black border-2 border-white" : "bg-white"} rounded-2xl shadow-2xl p-8 md:p-12`}
            >
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${highContrast ? "text-white" : "text-olive-dark"}`}>
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </span>
                  <div className="flex items-center gap-2">
                    {[...Array(3)].map((_, i) => (
                      <Heart
                        key={i}
                        className={`w-5 h-5 ${
                          i < lives
                            ? highContrast
                              ? "fill-white text-white"
                              : "fill-red-500 text-red-500"
                            : highContrast
                              ? "text-gray-600"
                              : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div
                  className={`h-2 ${highContrast ? "bg-gray-700" : "bg-olive-light/20"} rounded-full overflow-hidden`}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                    className={`h-full ${highContrast ? "bg-white" : "bg-olive-dark"}`}
                  />
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <Clock
                  className={`w-5 h-5 ${timeLeft <= 5 ? "text-red-500" : highContrast ? "text-white" : "text-olive-dark"}`}
                />
                <span
                  className={`text-2xl font-bold ${
                    timeLeft <= 5 ? "text-red-500" : highContrast ? "text-white" : "text-olive-dark"
                  }`}
                >
                  {timeLeft}s
                </span>
              </div>

              {/* Question */}
              <h3 className={`text-2xl font-bold ${highContrast ? "text-white" : "text-olive-dark"} mb-8 text-center`}>
                {quizQuestions[currentQuestion].question}
              </h3>

              {/* Answers */}
              <div className="space-y-4">
                {quizQuestions[currentQuestion].type === "true-false" ? (
                  <>
                    <Button
                      onClick={() => handleAnswer("true")}
                      disabled={showFeedback}
                      className={`w-full py-6 text-lg ${
                        showFeedback && selectedAnswer === "true"
                          ? isCorrect
                            ? "bg-green-500 hover:bg-green-500"
                            : "bg-red-500 hover:bg-red-500"
                          : highContrast
                            ? "bg-white text-black hover:bg-gray-200"
                            : "bg-olive-dark hover:bg-olive-dark/90 text-warm-white"
                      }`}
                    >
                      {showFeedback &&
                        selectedAnswer === "true" &&
                        (isCorrect ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />)}
                      True
                    </Button>
                    <Button
                      onClick={() => handleAnswer("false")}
                      disabled={showFeedback}
                      className={`w-full py-6 text-lg ${
                        showFeedback && selectedAnswer === "false"
                          ? isCorrect
                            ? "bg-green-500 hover:bg-green-500"
                            : "bg-red-500 hover:bg-red-500"
                          : highContrast
                            ? "bg-white text-black hover:bg-gray-200"
                            : "bg-olive-dark hover:bg-olive-dark/90 text-warm-white"
                      }`}
                    >
                      {showFeedback &&
                        selectedAnswer === "false" &&
                        (isCorrect ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />)}
                      False
                    </Button>
                  </>
                ) : (
                  quizQuestions[currentQuestion].options?.map((option) => (
                    <Button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      disabled={showFeedback}
                      className={`w-full py-6 text-lg ${
                        showFeedback && selectedAnswer === option
                          ? isCorrect
                            ? "bg-green-500 hover:bg-green-500"
                            : "bg-red-500 hover:bg-red-500"
                          : highContrast
                            ? "bg-white text-black hover:bg-gray-200"
                            : "bg-olive-dark hover:bg-olive-dark/90 text-warm-white"
                      }`}
                    >
                      {showFeedback &&
                        selectedAnswer === option &&
                        (isCorrect ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />)}
                      {option}
                    </Button>
                  ))
                )}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-6 p-4 rounded-xl ${
                      isCorrect
                        ? highContrast
                          ? "bg-green-900 border-2 border-white"
                          : "bg-green-50"
                        : highContrast
                          ? "bg-red-900 border-2 border-white"
                          : "bg-red-50"
                    }`}
                  >
                    <p
                      className={`font-medium ${isCorrect ? (highContrast ? "text-white" : "text-green-700") : highContrast ? "text-white" : "text-red-700"}`}
                    >
                      {quizQuestions[currentQuestion].explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Score */}
              <div className={`mt-6 text-center text-sm ${highContrast ? "text-gray-300" : "text-olive-light"}`}>
                Score: {score} / {quizQuestions.length}
              </div>
            </motion.div>
          )}

          {/* Second Chance Challenge */}
          {showSecondChance && !quizWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${highContrast ? "bg-black border-2 border-white" : "bg-white"} rounded-2xl shadow-2xl p-8 md:p-12`}
            >
              <div className="text-center mb-8">
                <motion.div
                  animate={reduceMotion ? {} : { rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="inline-block text-6xl mb-4"
                >
                  ⚡
                </motion.div>
                <h3 className={`text-3xl font-bold ${highContrast ? "text-white" : "text-olive-dark"} mb-4`}>
                  Second Chance Challenge!
                </h3>
                <p className={`text-lg ${highContrast ? "text-gray-300" : "text-olive-light"} mb-6`}>
                  Answer 3 bonus questions correctly to recover your victory!
                </p>
                <div className={`text-sm ${highContrast ? "text-gray-300" : "text-olive-light"}`}>
                  Question {secondChanceQuestion + 1} of 3
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <Clock
                  className={`w-5 h-5 ${timeLeft <= 5 ? "text-red-500" : highContrast ? "text-white" : "text-olive-dark"}`}
                />
                <span
                  className={`text-2xl font-bold ${
                    timeLeft <= 5 ? "text-red-500" : highContrast ? "text-white" : "text-olive-dark"
                  }`}
                >
                  {timeLeft}s
                </span>
              </div>

              {/* Question */}
              <h3 className={`text-2xl font-bold ${highContrast ? "text-white" : "text-olive-dark"} mb-8 text-center`}>
                {quizQuestions[secondChanceQuestion].question}
              </h3>

              {/* Answers */}
              <div className="space-y-4">
                {quizQuestions[secondChanceQuestion].type === "true-false" ? (
                  <>
                    <Button
                      onClick={() => handleSecondChanceAnswer("true")}
                      disabled={showFeedback}
                      className={`w-full py-6 text-lg ${
                        showFeedback && selectedAnswer === "true"
                          ? isCorrect
                            ? "bg-green-500 hover:bg-green-500"
                            : "bg-red-500 hover:bg-red-500"
                          : highContrast
                            ? "bg-white text-black hover:bg-gray-200"
                            : "bg-olive-dark hover:bg-olive-dark/90 text-warm-white"
                      }`}
                    >
                      {showFeedback &&
                        selectedAnswer === "true" &&
                        (isCorrect ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />)}
                      True
                    </Button>
                    <Button
                      onClick={() => handleSecondChanceAnswer("false")}
                      disabled={showFeedback}
                      className={`w-full py-6 text-lg ${
                        showFeedback && selectedAnswer === "false"
                          ? isCorrect
                            ? "bg-green-500 hover:bg-green-500"
                            : "bg-red-500 hover:bg-red-500"
                          : highContrast
                            ? "bg-white text-black hover:bg-gray-200"
                            : "bg-olive-dark hover:bg-olive-dark/90 text-warm-white"
                      }`}
                    >
                      {showFeedback &&
                        selectedAnswer === "false" &&
                        (isCorrect ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />)}
                      False
                    </Button>
                  </>
                ) : (
                  quizQuestions[secondChanceQuestion].options?.map((option) => (
                    <Button
                      key={option}
                      onClick={() => handleSecondChanceAnswer(option)}
                      disabled={showFeedback}
                      className={`w-full py-6 text-lg ${
                        showFeedback && selectedAnswer === option
                          ? isCorrect
                            ? "bg-green-500 hover:bg-green-500"
                            : "bg-red-500 hover:bg-red-500"
                          : highContrast
                            ? "bg-white text-black hover:bg-gray-200"
                            : "bg-olive-dark hover:bg-olive-dark/90 text-warm-white"
                      }`}
                    >
                      {showFeedback &&
                        selectedAnswer === option &&
                        (isCorrect ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />)}
                      {option}
                    </Button>
                  ))
                )}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-6 p-4 rounded-xl ${
                      isCorrect
                        ? highContrast
                          ? "bg-green-900 border-2 border-white"
                          : "bg-green-50"
                        : highContrast
                          ? "bg-red-900 border-2 border-white"
                          : "bg-red-50"
                    }`}
                  >
                    <p
                      className={`font-medium ${isCorrect ? (highContrast ? "text-white" : "text-green-700") : highContrast ? "text-white" : "text-red-700"}`}
                    >
                      {quizQuestions[secondChanceQuestion].explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Quiz Completed */}
          {quizCompleted && !showReview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${
                highContrast ? "bg-black border-2 border-white" : "bg-white"
              } rounded-2xl shadow-2xl p-8 md:p-12 text-center relative overflow-hidden`}
            >
              {quizWon ? (
                <>
                  {/* Win Animation */}
                  <motion.div
                    animate={reduceMotion ? {} : { rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                    className="inline-block text-8xl mb-6"
                  >
                    🏆
                  </motion.div>
                  <motion.div
                    animate={reduceMotion ? {} : { y: [0, -10, 0] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    className="text-6xl mb-6"
                  >
                    🫒
                  </motion.div>
                  <h3 className={`text-4xl font-bold ${highContrast ? "text-white" : "text-olive-dark"} mb-4`}>
                    Congratulations, Olive Master!
                  </h3>
                  <p className={`text-xl ${highContrast ? "text-gray-300" : "text-olive-light"} mb-8`}>
                    You scored {score} out of {quizQuestions.length}! You're an olive oil expert!
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <Button
                      onClick={downloadBadge}
                      size="lg"
                      className={`${
                        highContrast
                          ? "bg-white text-black hover:bg-gray-200"
                          : "bg-golden hover:bg-golden/90 text-warm-white"
                      } px-8 py-6 text-lg rounded-full`}
                    >
                      <Trophy className="w-5 h-5 mr-2" />
                      Download Badge
                    </Button>
                    <Button
                      onClick={startQuiz}
                      size="lg"
                      variant="outline"
                      className={`${
                        highContrast
                          ? "border-white text-white hover:bg-white hover:text-black"
                          : "border-olive-dark text-olive-dark hover:bg-olive-dark hover:text-warm-white"
                      } px-8 py-6 text-lg rounded-full`}
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Play Again
                    </Button>
                    <Button
                      onClick={() => setShowReview(true)}
                      size="lg"
                      variant="outline"
                      className={`${
                        highContrast
                          ? "border-white text-white hover:bg-white hover:text-black"
                          : "border-olive-dark text-olive-dark hover:bg-olive-dark hover:text-warm-white"
                      } px-8 py-6 text-lg rounded-full`}
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      Review Answers
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Lose Animation */}
                  <div className="relative mb-6">
                    <motion.div
                      animate={reduceMotion ? {} : { rotate: [0, -5, 5, -5, 0] }}
                      transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                      className="text-8xl"
                    >
                      ⛈️
                    </motion.div>
                    <motion.div
                      animate={reduceMotion ? {} : { y: [0, 100], opacity: [1, 0] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 text-4xl"
                    >
                      🫒
                    </motion.div>
                  </div>
                  <h3 className={`text-4xl font-bold ${highContrast ? "text-white" : "text-olive-dark"} mb-4`}>
                    Don't Give Up!
                  </h3>
                  <p className={`text-xl ${highContrast ? "text-gray-300" : "text-olive-light"} mb-8`}>
                    You scored {score} out of {quizQuestions.length}. Keep learning about olive oil!
                  </p>
                  {!showSecondChance && (
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <Button
                        onClick={startQuiz}
                        size="lg"
                        className={`${
                          highContrast
                            ? "bg-white text-black hover:bg-gray-200"
                            : "bg-olive-dark hover:bg-olive-dark/90 text-warm-white"
                        } px-8 py-6 text-lg rounded-full`}
                      >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Try Again
                      </Button>
                      <Button
                        onClick={() => setShowReview(true)}
                        size="lg"
                        variant="outline"
                        className={`${
                          highContrast
                            ? "border-white text-white hover:bg-white hover:text-black"
                            : "border-olive-dark text-olive-dark hover:bg-olive-dark hover:text-warm-white"
                        } px-8 py-6 text-lg rounded-full`}
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        Review Answers
                      </Button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* Review Answers */}
          {showReview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${highContrast ? "bg-black border-2 border-white" : "bg-white"} rounded-2xl shadow-2xl p-8 md:p-12`}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className={`text-3xl font-bold ${highContrast ? "text-white" : "text-olive-dark"}`}>
                  Review Your Answers
                </h3>
                <Button
                  onClick={() => setShowReview(false)}
                  variant="ghost"
                  size="icon"
                  className={highContrast ? "text-white hover:bg-gray-800" : ""}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="space-y-6">
                {userAnswers.map((answer, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl ${
                      answer.correct
                        ? highContrast
                          ? "bg-green-900 border-2 border-white"
                          : "bg-green-50"
                        : highContrast
                          ? "bg-red-900 border-2 border-white"
                          : "bg-red-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {answer.correct ? (
                        <CheckCircle2
                          className={`w-6 h-6 ${highContrast ? "text-white" : "text-green-500"} flex-shrink-0 mt-1`}
                        />
                      ) : (
                        <XCircle
                          className={`w-6 h-6 ${highContrast ? "text-white" : "text-red-500"} flex-shrink-0 mt-1`}
                        />
                      )}
                      <div className="flex-1">
                        <p
                          className={`font-medium ${answer.correct ? (highContrast ? "text-white" : "text-green-700") : highContrast ? "text-white" : "text-red-700"} mb-2`}
                        >
                          {answer.question}
                        </p>
                        <p
                          className={`text-sm ${highContrast ? "text-gray-300" : answer.correct ? "text-green-600" : "text-red-600"}`}
                        >
                          Your answer: {answer.userAnswer}
                        </p>
                        {!answer.correct && (
                          <p className={`text-sm ${highContrast ? "text-gray-300" : "text-green-600"} mt-1`}>
                            Correct answer: {quizQuestions[index].correctAnswer}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button
                  onClick={startQuiz}
                  size="lg"
                  className={`${
                    highContrast
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-olive-dark hover:bg-olive-dark/90 text-warm-white"
                  } px-8 py-6 text-lg rounded-full`}
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className={`py-20 px-4 ${highContrast ? "bg-gray-900" : "bg-olive-light/5"}`}>
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${highContrast ? "bg-black border-2 border-white" : "bg-white"} rounded-2xl shadow-2xl p-8 md:p-12`}
          >
            <Presentation className={`w-16 h-16 ${highContrast ? "text-white" : "text-olive-dark"} mx-auto mb-6`} />
            <h3 className={`text-3xl font-bold ${highContrast ? "text-white" : "text-olive-dark"} mb-4`}>
              Ready to Present?
            </h3>
            <p className={`text-lg ${highContrast ? "text-gray-300" : "text-olive-light"} mb-8`}>
              Activate Presentation Mode for an optimized viewing experience with larger text and enhanced animations.
            </p>
            <Button
              onClick={() => setPresentationMode(!presentationMode)}
              size="lg"
              className={`${
                highContrast
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-olive-dark hover:bg-olive-dark/90 text-warm-white"
              } px-12 py-6 text-xl rounded-full transition-all hover:scale-105 hover:shadow-lg`}
            >
              <Presentation className="w-6 h-6 mr-2" />
              {presentationMode ? "Exit" : "Enter"} Presentation Mode
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-8 px-4 ${highContrast ? "bg-black border-t-2 border-white" : "bg-olive-dark text-warm-white"}`}
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <p className={`text-sm ${highContrast ? "text-white" : ""}`}>
              Created by Cristhian Orbes and Janneth • English Class Project • {new Date().getFullYear()}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="high-contrast" className={`text-sm ${highContrast ? "text-white" : ""}`}>
                  {highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </label>
                <Switch id="high-contrast" checked={highContrast} onCheckedChange={setHighContrast} />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="reduce-motion" className={`text-sm ${highContrast ? "text-white" : ""}`}>
                  <Minimize2 className="w-4 h-4" />
                </label>
                <Switch id="reduce-motion" checked={reduceMotion} onCheckedChange={setReduceMotion} />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
