import { Request, Response } from "express";
import OpenAI from "openai";
import { generatePrompt } from "../system-prompt/promt";
import { InterviewSession } from "../states/InterviewSession";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const aiController = {
  getSessions: async (req: Request, res: Response) => {
    try {
      const sessionId = req.params.id;
      if (!sessionId) {
        res.status(400).send({ message: "Session ID is required" });
        return;
      }

      const { responses } = InterviewSession.getInstance().getSessionResponses(sessionId);
      res.send(responses);
    } catch (error) {
      res.status(400).send({ message: "Failed to get interview session" });
    }
  },

  startInterview: async (req: Request, res: Response) => {
    const { topic, expertise, name, sessionId } = req.body;
    const systemPrompt = generatePrompt(topic, expertise, name);

    const response = InterviewSession.getInstance().startSession(topic, expertise, name, sessionId, systemPrompt);

    if (!response) {
      res.status(400).send({ message: "Failed to start interview session" });
      return;
    }

    const questionResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
      ],
    });

    if (!questionResponse.choices[0].message.content) {
      res.status(400).send({ message: "Failed to generate question" });
      return;
    }

    const question = questionResponse.choices[0].message.content;

    InterviewSession.getInstance().addToCache(response, {
      questionNumber: 1,
      question: question,
      answer: "",
    });

    res.send({ sessionId: response, question });
  },

  chat: async (req: Request, res: Response) => {
    try {
      const { message, InteractionCount } = req.body;
      const sessionId = req.params.id;
      const {responses, systemPrompt} = InterviewSession.getInstance().getSessionResponses(sessionId);

      const UpdatedResponse = responses.map((item) => {
        if (item.questionNumber === InteractionCount) {
          return { ...item, answer: message };
        }
        return item;
      });

      InterviewSession.getInstance().updateSessionResponses(sessionId, UpdatedResponse);

      const conversationHistory = UpdatedResponse.map(item => 
        `Question ${item.questionNumber}: ${item.question}\nAnswer: ${item.answer}`
      ).join('\n\n');

      console.log(conversationHistory, "conversationHistory");

      const questionResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: conversationHistory },
        ],
      });

      const question = questionResponse.choices[0].message.content;

      if (!question) {
        res.status(400).send({ message: "Failed to generate question" });
        return;
      }

      InterviewSession.getInstance().addToCache(sessionId, {
        questionNumber: InteractionCount + 1,
        question: question,
        answer: "",
      });

      res.send({ responses, question });
    } catch (error) {
      res.status(500).send({ error });
    }
  },

  endInterview: async (req: Request, res: Response) => {
    const { sessionId } = req.body;
    InterviewSession.getInstance().clearSession(sessionId);
    res.send({ message: "Interview session cleared successfully" });
  },
};
