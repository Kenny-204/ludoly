import app from "./app.js";
import config from "./core/config/config.js";
import mongoose from "mongoose";

mongoose.connect(config.db.db_string).then((conn) => {});

const server = app.listen(config.app.port, () =>
  console.log("server running on port ", config.app.port),
);
