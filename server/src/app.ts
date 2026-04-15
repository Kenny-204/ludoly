import express from "express";
import globalErrorHandler  from '../controller/errorController.ts'

const app = express();

app.use(express.json());

app.use(globalErrorHandler)

export default app;
