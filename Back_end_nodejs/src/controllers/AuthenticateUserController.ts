import { Request, Response } from "express";
import { AuthenticateUserService } from "../services/AuthenticateUserService";

class AuthenticateUserController {
  async handle(req: Request, res: Response) {
    //pegando o code na desestruturação
    const { code } = req.body; //falando que vou pegar dentro do body.

    const service = new AuthenticateUserService(); //construindo uma autenticação.

    //vamos colocar o result por volta de um try catch

    try {
      const result = await service.execute(code);
      return res.json(result);
    } catch (err) {
      //pegando o erro e tratando.
      return res.json({ error: err.message });
    }
  }
}

export { AuthenticateUserController };
