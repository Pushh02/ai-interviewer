import { Request, Response } from "express";
import OpenAI from "openai";
import { generatePrompt } from "../system-prompt/promt";
import { InterviewSession } from "../states/InterviewSession";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const aiController = {
  startInterview: async (req: Request, res: Response) => {
    const { topic, expertise, name, sessionId } = req.body;

    const response = InterviewSession.getInstance(sessionId).startSession(topic, expertise, name, sessionId);
    
    if (!response) {
      res.status(400).send({ message: "Failed to start interview session" });
      return;
    }

    res.send({ sessionId: response });
  },

  chat: async (req: Request, res: Response) => {
    const { topic, expertise, name, sessionId, answer } = req.body;
    const responseData = InterviewSession.getInstance(sessionId);
    
  },

  endInterview: async (req: Request, res: Response) => {
    const { sessionId } = req.body;
    const responseData = InterviewSession.getInstance(sessionId);
    responseData.clearSession();
    res.send({ message: "Interview session cleared successfully" });
  },
};
