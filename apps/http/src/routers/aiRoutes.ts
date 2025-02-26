import { Router } from "express";
import { aiController } from "../controllers/aiController";

const router = Router();

router.get("/:id", aiController.getSessions);

router.post("/start-session", aiController.startInterview);
router.post("/:id", aiController.chat);
router.post("/end", aiController.endInterview);

export { router as aiRoutes };