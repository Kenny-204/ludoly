import app from "./app.js";
import config from "./core/config/config.js";
import mongoose from "mongoose";

const { port, DB } = config;
mongoose.connect(DB).then((conn) => {});

const server = app.listen(port, () =>
  console.log("server running on port ", port),
);
