import app from "./app.js";
import config from './config/config.ts'

const port = config.port

const server = app.listen(port, () =>
  console.log("server running on port ", port),
);
