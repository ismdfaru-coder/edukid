import { useState } from "react";
import { StudentLayout } from "@/components/StudentLayout";
import { useTopics } from "@/hooks/use-learning";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Loader2, Lock, Play, Star, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MissionControl() {
  const { data: topics, isLoading } = useTopics("KS2");
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <StudentLayout>
        <div className="h-[60vh] flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <p className="text-xl font-display text-indigo-400">Loading missions...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        <header>
          <h2 className="text-3xl font-display font-bold text-slate-800">Mission Control</h2>
          <p className="text-slate-500 text-lg">Choose a mission to earn coins!</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics?.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-2 hover:border-indigo-400 transition-colors group cursor-pointer relative">
                {/* Background Image Placeholder */}
                <div className={cn(
                  "h-32 bg-gradient-to-r",
                  topic.name === "Space" ? "from-indigo-900 to-purple-900" :
                  topic.name === "Electricity" ? "from-yellow-400 to-orange-500" :
                  topic.name === "Plants" ? "from-green-400 to-emerald-600" :
                  "from-slate-200 to-slate-300"
                )} />
                
                <div className="p-6 relative">
                  {/* Topic Icon Overlay */}
                  <div className="absolute -top-10 left-6 w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl border-4 border-white">
                    {topic.name === "Space" ? "🚀" :
                     topic.name === "Electricity" ? "⚡" :
                     topic.name === "Plants" ? "🌿" : "📚"}
                  </div>

                  <div className="mt-8 space-y-4">
                    <div>
                      <h3 className="text-xl font-display font-bold">{topic.name}</h3>
                      <p className="text-slate-500 text-sm line-clamp-2">{topic.description || "Start learning now!"}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                        <span>Mastery</span>
                        <span>{Math.round((topic.mastery || 0) * 100)}%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(topic.mastery || 0) * 100}%` }}
                          className="h-full bg-indigo-500 rounded-full"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => setLocation(`/student/play/${topic.id}`)}
                      className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      Play Now
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
}
