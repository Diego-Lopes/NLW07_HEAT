import "dotenv/config";
import express from "express";
import { router } from "./routers";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(cors()); //habilitando cors no app.

//rodando o serve no http para podermos uar server de socket.io, que faz integração com front.
const serverHttp = http.createServer(app);
const io = new Server(serverHttp, {
  cors: {
    origin: "*", //por enquanto estamos passando qualquer origem.
  },
});

//isto é um evento de escuta, vai disparar um consolog quando um usuário se conectar no socket.
io.on("connection", (socket) =>
  console.log(`Usuário conectado no socket ${socket.id}`)
);

app.use(express.json());

app.use(router);

//create as new routes

//route of login
app.get("/github", (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
});

//route de callback para ver se tem validação.
app.get("/signIn/callback", (req, res) => {
  const { code } = req.query; //aqui fizemos um desestruturação.

  return res.json(code);
});

export { serverHttp, io };
