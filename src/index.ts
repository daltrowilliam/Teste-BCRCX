import express from "express";
import { AddressInfo } from "net";
import { userRouter } from "./controller/routes/userRouter";
import { recipeRouter } from "./controller/routes/recipeRouter";
import cors from "cors";

const app = express();

app.use(cors())

app.use(express.json());

app.use("/user", userRouter);
app.use("/recipe", recipeRouter);



const server = app.listen(process.env.PORT || 3003, () => {
   if (server) {
      const address = server.address() as AddressInfo;
      console.log(`Servidor rodando em http://localhost:${address.port}`);
   } else {
      console.error(`Falha ao rodar o servidor.`);
   }
});