import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuestion, useSubmitAnswer } from "@/hooks/use-learning";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft, Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

export default function GameEngine() {
  const [, params] = useRoute("/student/play/:topicId");
  const [, setLocation] = useLocation();
  const topicId = Number(params?.topicId);
  
  const { data: question, isLoading, refetch } = useQuestion(topicId);
  const { mutate: submitAnswer, isPending: isSubmitting } = useSubmitAnswer();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<{ correct: boolean; message: string } | null>(null);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    if (question) {
      setStartTime(Date.now());
      setSelectedAnswer(null);
      setResult(null);
    }
  }, [question]);

  if (isLoading || !question) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-400 mb-4" />
        <p className="font-display text-xl animate-pulse">Loading mission data...</p>
      </div>
    );
  }

  const handleAnswer = (answer: string) => {
    if (result) return; // Prevent multiple clicks
    
    setSelectedAnswer(answer);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    
    submitAnswer(
      { questionId: question.id, answer, timeTaken },
      {
        onSuccess: (data) => {
          setResult({
            correct: data.correct,
            message: data.correct ? "Awesome Job!" : "Not quite right..."
          });

          if (data.correct) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        }
      }
    );
  };

  const handleNext = () => {
    refetch(); // Get new question
  };

  // Combine correct answer + distractors and shuffle (simple shuffle for demo)
  // Ideally this should be memoized or handled more robustly
  const allOptions = [question.correctAnswer, ...(question.distractors as string[])].sort();

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden flex flex-col">
      {/* Game Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900" />
        <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl top-10 right-10 animate-float" />
        <div className="absolute w-64 h-64 bg-blue-500/20 rounded-full blur-3xl bottom-10 left-10 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 flex justify-between items-center text-white">
        <button 
          onClick={() => setLocation("/student/mission-control")}
          className="bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="bg-white/10 px-4 py-1 rounded-full backdrop-blur-sm font-display text-lg">
          Mission In Progress
        </div>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Game Area */}
      <main className="flex-1 relative z-10 container max-w-4xl mx-auto p-4 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full"
          >
            {/* Question Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-10 text-white shadow-2xl mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-center leading-relaxed">
                {question.content}
              </h2>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {allOptions.map((option, idx) => {
                let statusClass = "bg-white/5 border-white/10 hover:bg-white/20 hover:border-indigo-400";
                
                if (result && option === question.correctAnswer) {
                  statusClass = "bg-green-500/80 border-green-400 ring-2 ring-green-400 shadow-[0_0_30px_rgba(34,197,94,0.4)]";
                } else if (result && selectedAnswer === option && !result.correct) {
                  statusClass = "bg-red-500/80 border-red-400";
                } else if (result) {
                  statusClass = "opacity-50 bg-white/5 border-transparent";
                }

                return (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handleAnswer(option)}
                    disabled={!!result}
                    className={cn(
                      "p-6 rounded-2xl border-2 text-lg md:text-xl font-bold text-white transition-all duration-200 text-left relative overflow-hidden group",
                      statusClass
                    )}
                  >
                    <span className="relative z-10">{option}</span>
                    {result && option === question.correctAnswer && (
                      <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white" />
                    )}
                    {result && selectedAnswer === option && !result.correct && (
                      <X className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Feedback / Next Button */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-0 left-0 w-full bg-white text-slate-900 p-6 md:p-8 rounded-t-3xl shadow-2xl z-20"
            >
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white",
                    result.correct ? "bg-green-500" : "bg-red-500"
                  )}>
                    {result.correct ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display">{result.message}</h3>
                    {question.explanation && !result.correct && (
                      <p className="text-slate-500 text-sm mt-1">{question.explanation}</p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleNext}
                  className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  Next Question
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
