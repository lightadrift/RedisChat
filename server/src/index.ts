import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { Router } from "./routes/userRoutes";
import WebSocket, { WebSocketServer } from "ws";

const app = express();
const wss = new WebSocketServer({ port: 8080 });

interface WebSocketWithID extends WebSocket {
  id?: string;
}


dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", Router);

wss.on("connection", (w: WebSocketWithID, req) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log('Client connected from IP:', ip);
});

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    // let message = JSON.parse(data.toString());
    // const t = message
    console.log(wss.clients)
    wss.clients.forEach(function each(client) {
     console.log(client.url)
        client.send(data);
      
    });
    console.log("received: %s", data);
  });
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

//testando
