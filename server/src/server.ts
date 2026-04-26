import { createServer } from "http";
import app from "./app.js";
import config from "./core/config/config.js";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { WebSocketManager } from "./sockets/ws.server.js";
import { redisClient } from "./core/providers/redis.js";

mongoose.connect(config.db.db_string).then((conn) => {});
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "https://ludoly.vercel.app",
    credentials: true,
  },
});

const webSocketManager = new WebSocketManager(io, redisClient);
httpServer.listen(config.app.port, () =>
  console.log("server running on port ", config.app.port),
);
