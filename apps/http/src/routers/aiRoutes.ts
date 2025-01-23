import { Router } from "express";
import { aiController } from "../controllers/aiController";

const router = Router();

router.post("/start-session", aiController.startInterview);
router.post("/", aiController.chat);
router.post("/end", aiController.endInterview);

export { router as aiRoutes };