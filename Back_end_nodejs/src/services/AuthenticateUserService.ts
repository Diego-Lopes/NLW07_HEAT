/**
 * regras que precisamos aplicar.
 * 1 receber o code via string
 * recuperar o access_token no github
 * recuperar infos do user no github.
 * verificar se o usuário existe no bd
 * se sim, gerar um token
 * se não, criar no db e gera um token.
 * retornar o token com as infos user.
 */

import axios from "axios";
import prismaClient from "../prisma";
import { sign } from "jsonwebtoken";

interface IAccessTokenResponse {
  //interface para pegarmos apenas o que queremos que é o access_token.
  access_token: string;
}

interface IUserResponse {
  avatar_url: string;
  login: string;
  id: number;
  name: string;
}

class AuthenticateUserService {
  async execute(code: string) {
    const url = "https://github.com/login/oauth/access_token"; //pegamos access_token direto do github.

    //criando uma chamada await vai dar um resposta ao usuário. como não
    //vamos passar informações no body podemos deixar null.
    const { data: accessTokenResponse } =
      await axios.post<IAccessTokenResponse>(url, null, {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: "application/json",
        },
      });

    const response = await axios.get<IUserResponse>(
      "https://api.github.com/user",
      {
        headers: {
          authorization: `Bearer ${accessTokenResponse.access_token}`,
        },
      }
    );

    //criação do prisma.
    const { login, id, avatar_url, name } = response.data; //uma desestruturação no data vindo do github

    let user = await prismaClient.user.findFirst({
      //fazendo um select onde o usuário foi igual ao id.
      where: {
        github_id: id,
      },
    });
    //caso não tenha no bd criamos um com comando logo abaixo.
    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          avatar_url,
          name,
        },
      });
    }
    const token = sign(
      {
        //recebe 3 argumentos
        user: {
          //primeiro
          name: user.name,
          avata_url: user.avatar_url,
          id: user.id,
        },
      },
      process.env.JWT_SECRET, //segundo
      {
        //terceiro
        //este fazemdos uma verificação e damos um tempo de duração do token.
        subject: user.id,
        expiresIn: "1d", //expirar em um dia.
      }
    );

    return { token, user }; //retornando o token e as infomações do usuário.
  }
}

export { AuthenticateUserService };
