import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { PicturePassword } from "@/components/PicturePassword";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GraduationCap, Baby, Users, ArrowRight, Loader2, Rocket } from "lucide-react";
import { loginSchema } from "@shared/routes";

// Split schemas for different forms
const studentSchema = loginSchema.pick({ username: true, password: true });

const standardSchema = loginSchema.pick({ username: true, password: true });

export default function Login() {
  const { login, isLoggingIn } = useAuth();
  const [role, setRole] = useState<"student" | "teacher" | "parent">("student");

  // Student Form
  const studentForm = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: { username: "", password: "" },
  });

  // Teacher/Parent Form
  const standardForm = useForm<z.infer<typeof standardSchema>>({
    resolver: zodResolver(standardSchema),
    defaultValues: { username: "", password: "" },
  });

  const onStudentSubmit = (data: z.infer<typeof studentSchema>) => {
    login({ ...data, role: "student" });
  };

  const onStandardSubmit = (data: z.infer<typeof standardSchema>) => {
    login({ ...data, role });
  };

  return (
    <div className="min-h-screen w-full bg-[#F2F0EC] flex items-center justify-center p-4">
      <div className="w-full max-w-[500px] relative">
        {/* Mascot */}
        <div className="absolute right-[-140px] bottom-0 hidden lg:block">
          <div className="relative w-[180px] h-[220px] bg-orange-400 rounded-[40px_40px_10px_10px] border-[3px] border-black flex flex-col items-center pt-8">
            <div className="flex gap-4 mb-2">
              <div className="w-4 h-4 bg-black rounded-full" />
              <div className="w-4 h-4 bg-black rounded-full" />
            </div>
            <div className="w-2 h-2 bg-black rounded-full" />
            <div className="absolute top-[-20px] left-4 w-12 h-16 bg-black rounded-t-full -rotate-12" />
            <div className="absolute top-[-20px] right-4 w-12 h-16 bg-black rounded-t-full rotate-12" />
          </div>
        </div>

        <div className="bg-[#1B5EAB] rounded-2xl overflow-hidden border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
          {/* Tabs */}
          <div className="grid grid-cols-3 h-16 border-b-[3px] border-black">
            <button 
              onClick={() => setRole("student")}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${role === 'student' ? 'bg-[#1B5EAB] text-white' : 'bg-[#283145] text-slate-400 hover:bg-[#323d56]'}`}
            >
              <div className="w-6 h-6 bg-yellow-400 rounded-sm border-2 border-black flex items-center justify-center text-[10px] text-black font-bold">DOG</div>
              <span className="text-[10px] font-bold uppercase">Student</span>
            </button>
            <button 
              onClick={() => setRole("teacher")}
              className={`flex flex-col items-center justify-center gap-1 transition-colors border-x-[3px] border-black ${role === 'teacher' ? 'bg-[#1B5EAB] text-white' : 'bg-[#3b445a] text-slate-300 hover:bg-[#45506a]'}`}
            >
              <GraduationCap className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase">Teacher</span>
            </button>
            <button 
              onClick={() => setRole("parent")}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${role === 'parent' ? 'bg-[#1B5EAB] text-white' : 'bg-[#7c5cdb] text-white hover:bg-[#8b6fe0]'}`}
            >
              <Users className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase">Parent</span>
            </button>
          </div>

          <div className="p-8 space-y-8">
            <h1 className="text-4xl font-black text-white text-center tracking-tighter italic">PLAY EDUKID!</h1>
            
            <div className="space-y-4">
              <Button variant="outline" className="w-full bg-white text-[#1B5EAB] border-2 border-black h-10 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] font-bold hover:bg-slate-50">
                Log in with MyLogin
              </Button>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/30"></span>
                </div>
                <span className="relative bg-[#1B5EAB] px-4 text-white font-bold text-sm">OR</span>
              </div>
            </div>

            <Form {...(role === 'student' ? studentForm : standardForm)}>
              <form 
                onSubmit={role === 'student' ? studentForm.handleSubmit(onStudentSubmit) : standardForm.handleSubmit(onStandardSubmit)} 
                className="space-y-6"
              >
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-white font-black text-right text-sm">USERNAME</label>
                  <FormField
                    control={(role === 'student' ? studentForm : standardForm).control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Input 
                            className="bg-white border-[3px] border-black rounded-none h-12 text-black font-bold shadow-[3px_6px_0px_0px_rgba(0,0,0,0.5)] focus-visible:ring-0 focus-visible:border-black" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-300 font-bold" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                  <label className="text-white font-black text-right text-sm">PASSWORD</label>
                  <FormField
                    control={(role === 'student' ? studentForm : standardForm).control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <div className="relative">
                          <FormControl>
                            <Input 
                              type="password"
                              className="bg-white border-[3px] border-black rounded-none h-12 text-black font-bold shadow-[3px_6px_0px_0px_rgba(0,0,0,0.5)] focus-visible:ring-0 focus-visible:border-black" 
                              {...field} 
                            />
                          </FormControl>
                          <div className="absolute right-[-50px] top-0 h-12 w-12 bg-[#5d87ff] border-[3px] border-black flex items-center justify-center cursor-pointer shadow-[3px_6px_0px_0px_rgba(0,0,0,0.5)]">
                            <Baby className="w-6 h-6 text-black" />
                          </div>
                        </div>
                        <FormMessage className="text-red-300 font-bold" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-center pt-4">
                  <Button 
                    type="submit" 
                    className="bg-[#1BAD31] hover:bg-[#158c27] text-white border-[3px] border-black rounded-none px-12 h-12 font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? "LOGGING IN..." : "LOG IN"}
                  </Button>
                </div>
              </form>
            </Form>

            <div className="text-center">
              <button className="text-white font-bold text-sm hover:underline italic">I FORGOT MY LOGIN</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
