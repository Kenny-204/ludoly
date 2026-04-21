import { createServer } from "http";
import app from "./app.js";
import config from "./core/config/config.js";
import mongoose from "mongoose";
import { Server } from "socket.io";

mongoose.connect(config.db.db_string).then((conn) => {});
const httpServer = createServer(app);

const io = new Server(httpServer,{
  cors:{
    origin:'http://localhost:5173',
    credentials:true
  }
});

httpServer.listen(config.app.port, () =>
  console.log("server running on port ", config.app.port),
);
