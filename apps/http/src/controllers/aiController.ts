import { Request, Response } from "express";
import OpenAI from "openai";
import { generatePrompt } from "../system-prompt/promt";
import { ResponseData } from "../states/response";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const aiController = {
  async chat(req: Request, res: Response) {
    const { topic, expertise, name, sessionId, answer } = req.body;
    const responseData = ResponseData.getInstance(sessionId);

    // If answer is provided, it means this is a response to previous question
    if (answer) {
      const currentResponse = responseData.getCurrentResponse();
      currentResponse.answer = answer;
      responseData.addToCache(currentResponse);

      // Get all previous responses to build context
      const sessionResponses = responseData.getSessionResponses();
      const messages = [
        { role: "system", content: generatePrompt(topic, expertise, name) },
        ...sessionResponses.flatMap((resp) => [
          { role: "assistant", content: resp.question },
          { role: "user", content: resp.answer },
        ]),
      ];

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages,
        });
        const newQuestion = completion.choices[0].message.content;
        responseData.addToCache({
          questionNumber: sessionResponses.length + 1,
          question: newQuestion,
          answer: "",
        });
        res.send(newQuestion);
      } catch (err) {
        res.status(500).send(err);
      }
    } else {
      // Initial question
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: generatePrompt(topic, expertise, name) },
          ],
        });
        const question = completion.choices[0].message.content;
        responseData.addToCache({
          questionNumber: 1,
          question,
          answer: "",
        });
        res.send(question);
      } catch (err) {
        res.status(500).send(err);
      }
    }
  },

  async endInterview(req: Request, res: Response) {
    const { sessionId } = req.body;
    const responseData = ResponseData.getInstance(sessionId);
    responseData.clearSession();
    res.send({ message: "Interview session cleared successfully" });
  },
};

export default aiController;
