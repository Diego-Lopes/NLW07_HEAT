//middle pega as informações para validar o token, valido pode enviar msg.

import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //criamos uma lógica que vai validar o token se é invalido retorna um erro e valido passe a diante.

  const authToken = req.headers.authorization;

  if (!authToken) {
    //verificar se o token está preenchido.
    return res.status(401).json({
      errorCode: "token.invalid",
    });
  }

  // o token vem com Bearer e o número, precisamos desestruturar, e precisamos somente do número.
  //para isso iguinoramos o Bearer usando vírgula.
  //virá assim
  //Bearer 541a5s4f21a5d4f36as1
  //[0] Bearer
  //[1] 541a5s4f21a5d4f36as1
  const [, token] = authToken.split(" ");
  //split corta o espaço.

  try {
    //verificando o token com verify jsonwebtoken
    const { sub } = verify(token, process.env.JWT_SECRET) as IPayload;
    //pegamos a variavel token, e o segunto parâmetro passamos o hash jwt md5
    // sub receberá tudo isso.

    //vamos colocar as informações de sub dentro o request.user_id.
    //tipando sub para que req.user_id seja compatível.
    req.user_id = sub;
    //req.user_id foi rescrito para ser reconhechido globalmente na aplicação no caminha ../@types/express/index.d.ts

    return next();
  } catch (error) {
    return res.status(401).json({
      errorCode: "token.expired",
    });
  }
}
