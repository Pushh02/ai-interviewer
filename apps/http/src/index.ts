import express from "express";
import "dotenv/config";
import { aiRoutes } from "./routers/aiRoutes";

const app = express();

const PORT = process.env.PORT || 8001;

app.use(express.json());

app.use("/chat", aiRoutes);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});