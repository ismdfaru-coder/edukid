
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api, loginSchema } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";
import { db } from "./db";
import { questions, topics, users } from "@shared/schema";

const SessionStore = MemoryStore(session);

declare module "express-session" {
  interface SessionData {
    userId: number;
    role: "student" | "teacher" | "parent";
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session setup
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "edukid_secret",
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({ checkPeriod: 86400000 }),
      cookie: { secure: false }, // Set to true in production with HTTPS
    })
  );

  // === AUTH ===
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(input.username);

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (user.role !== input.role) {
        return res.status(401).json({ message: "Invalid role for this user" });
      }

      // Simple password check (In production, use hashing!)
      // For students with picture password, we check the array match
      if (user.role === "student" && input.picturePassword) {
        const stored = user.picturePassword; // e.g. ["cat", "dog", "apple"]
        const provided = input.picturePassword;
        const isMatch = stored && 
          stored.length === provided.length && 
          stored.every((val, index) => val === provided[index]);
          
        if (!isMatch) return res.status(401).json({ message: "Wrong picture password" });
      } else {
        // Standard password
        if (user.password !== input.password) {
          return res.status(401).json({ message: "Invalid password" });
        }
      }

      req.session.userId = user.id;
      req.session.role = user.role as any;
      res.json(user);
    } catch (e) {
      res.status(400).json({ message: "Validation error" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, async (req, res) => {
    if (!req.session.userId) return res.status(401).send();
    const user = await storage.getUser(req.session.userId);
    if (!user) return res.status(401).send();
    res.json(user);
  });

  // === LEARNING ===
  app.get(api.learning.getTopics.path, async (req, res) => {
    const stage = req.query.stage as string | undefined;
    const topics = await storage.getTopics(stage);
    
    // If student, attach mastery
    if (req.session.role === "student") {
      const topicsWithMastery = await Promise.all(topics.map(async (t) => {
        const m = await storage.getMastery(req.session.userId!, t.id);
        return { ...t, mastery: m?.score || 0 };
      }));
      return res.json(topicsWithMastery);
    }
    
    res.json(topics);
  });

  app.get(api.learning.getNextQuestion.path, async (req, res) => {
    const topicId = Number(req.query.topicId);
    // In a real adaptive engine, we'd pick based on difficulty vs mastery
    const questions = await storage.getQuestionsByTopic(topicId);
    if (questions.length === 0) return res.status(404).json({ message: "No questions found" });
    
    // Random for MVP
    const randomQ = questions[Math.floor(Math.random() * questions.length)];
    res.json(randomQ);
  });

  app.post(api.learning.submitAnswer.path, async (req, res) => {
    if (!req.session.userId) return res.status(401).send();
    
    const { questionId, answer, timeTaken } = req.body;
    const question = await storage.getQuestion(questionId);
    
    if (!question) return res.status(404).json({ message: "Question not found" });
    
    const isCorrect = question.correctAnswer === answer;
    
    // Log event and update mastery
    await storage.logLearningEvent(req.session.userId, questionId, isCorrect, timeTaken);
    await storage.updateMastery(req.session.userId, question.topicId, isCorrect ? 1.0 : 0.0);
    
    // Get new mastery
    const masteryRecord = await storage.getMastery(req.session.userId, question.topicId);
    
    res.json({
      correct: isCorrect,
      correctAnswer: question.correctAnswer,
      coinsEarned: isCorrect ? 10 : 0,
      newMastery: masteryRecord?.score || 0,
      feedback: isCorrect ? "Great job!" : question.explanation || "Keep trying!",
    });
  });

  // === SEED DATA ===
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingUsers = await storage.getUserByUsername("student1");
  if (existingUsers) return;

  // Create Topics
  const topicData = [
    { name: "Electricity", slug: "electricity", stage: "KS2", subjectId: 1, description: "Circuits and conductors" },
    { name: "Plants", slug: "plants", stage: "KS2", subjectId: 1, description: "Photosynthesis and growth" },
    { name: "Space", slug: "space", stage: "KS2", subjectId: 1, description: "Planets and the solar system" },
  ];
  
  const createdTopics = [];
  for (const t of topicData) {
    const [topic] = await db.insert(topics).values({ ...t, subjectId: 1 }).returning();
    createdTopics.push(topic);
  }

  // Create Users
  await storage.createUser({
    username: "admin",
    password: "admin",
    role: "teacher",
    firstName: "Admin",
    picturePassword: null,
    avatarConfig: {},
    classId: null,
    parentId: null,
    yearGroup: null,
  });

  await storage.createUser({
    username: "student1",
    role: "student",
    firstName: "Alex",
    yearGroup: 5,
    picturePassword: null,
    password: "admin",
    avatarConfig: { color: "blue" },
    classId: null,
    parentId: null,
  });

  // Create Questions
  const electricity = createdTopics.find(t => t.slug === "electricity");
  if (electricity) {
    await db.insert(questions).values([
      {
        topicId: electricity.id,
        content: "Which of these is a good conductor of electricity?",
        correctAnswer: "Copper",
        distractors: ["Wood", "Plastic", "Rubber"],
        difficulty: 2,
        type: "multiple_choice",
        explanation: "Metals like copper allow electricity to flow freely."
      },
      {
        topicId: electricity.id,
        content: "What component breaks a circuit to stop the flow?",
        correctAnswer: "Switch",
        distractors: ["Battery", "Bulb", "Wire"],
        difficulty: 3,
        type: "multiple_choice",
        explanation: "A switch opens the circuit gap."
      }
    ]);
  }

  const space = createdTopics.find(t => t.slug === "space");
  if (space) {
    await db.insert(questions).values([
      {
        topicId: space.id,
        content: "Which planet is closest to the Sun?",
        correctAnswer: "Mercury",
        distractors: ["Venus", "Earth", "Mars"],
        difficulty: 2,
        type: "multiple_choice",
        explanation: "Mercury is the first planet."
      }
    ]);
  }
}
