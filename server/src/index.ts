import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { Router } from "./routes/userRoutes";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", Router);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});


//testando