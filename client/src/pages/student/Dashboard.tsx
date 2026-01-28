import { useAuth } from "@/hooks/use-auth";
import { StudentLayout } from "@/components/StudentLayout";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Star, Zap, Leaf } from "lucide-react";
import heroImg from "@assets/hero.jpg"; // Placeholder logic for now

export default function StudentDashboard() {
  const { user } = useAuth();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Welcome Hero */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white p-8 md:p-12 shadow-xl shadow-purple-200">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Hi, {user?.firstName}!
            </h2>
            <p className="text-xl md:text-2xl text-purple-100 font-medium mb-8">
              Ready to explore the universe today?
            </p>
            <Link href="/student/mission-control">
              <button className="bg-white text-violet-600 px-8 py-4 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 group">
                Start Mission
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
        </section>

        {/* Quick Stats / My Room Preview */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={item} className="col-span-1 md:col-span-2">
            <Card className="h-full p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-display font-bold text-slate-800">My Trophy Case</h3>
                <Link href="/student/achievements" className="text-indigo-600 font-bold hover:underline">See All</Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 student-scroll">
                <div className="flex-shrink-0 w-24 h-24 bg-amber-100 rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-amber-200">
                  🏆
                </div>
                <div className="flex-shrink-0 w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center text-4xl border border-slate-200 opacity-50 grayscale">
                  🚀
                </div>
                <div className="flex-shrink-0 w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center text-4xl border border-slate-200 opacity-50 grayscale">
                  ⭐
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item} className="col-span-1">
            <Card className="h-full p-6 border-0 shadow-lg bg-indigo-50 border-indigo-100 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-indigo-200 rounded-full mb-4 flex items-center justify-center text-5xl shadow-inner">
                👾
              </div>
              <h3 className="text-xl font-display font-bold text-indigo-900">My Avatar</h3>
              <p className="text-indigo-600 mb-4">Customize your look!</p>
              <button className="mt-auto w-full py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                Edit Style
              </button>
            </Card>
          </motion.div>
        </motion.div>

        {/* Featured Topics */}
        <div className="pt-4">
          <h3 className="text-2xl font-display font-bold text-slate-800 mb-6">Continue Learning</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link href="/student/mission-control?topic=electricity">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-6 text-white shadow-lg cursor-pointer h-48 flex flex-col justify-between relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                  <Zap className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">Level 2</span>
                </div>
                <div className="relative z-10">
                  <h4 className="text-2xl font-display font-bold">Electricity</h4>
                  <p className="opacity-90">Power up your brain!</p>
                </div>
              </motion.div>
            </Link>

            <Link href="/student/mission-control?topic=space">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg cursor-pointer h-48 flex flex-col justify-between relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                  <Star className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">Level 1</span>
                </div>
                <div className="relative z-10">
                  <h4 className="text-2xl font-display font-bold">Space</h4>
                  <p className="opacity-90">Blast off to the stars!</p>
                </div>
              </motion.div>
            </Link>

            <Link href="/student/mission-control?topic=plants">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-emerald-400 to-green-600 rounded-3xl p-6 text-white shadow-lg cursor-pointer h-48 flex flex-col justify-between relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                  <Leaf className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">Level 3</span>
                </div>
                <div className="relative z-10">
                  <h4 className="text-2xl font-display font-bold">Plants</h4>
                  <p className="opacity-90">Grow your knowledge!</p>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
