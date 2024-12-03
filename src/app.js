import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/", (req, res) => {
  res.send("Servidor");
});

app.get("/", (req, res) => {
  res.send("Servidor del sexo");
});

app.get("/hola", (req, res) => {
  res.send("Servidor del sexo");
});

export default app;
