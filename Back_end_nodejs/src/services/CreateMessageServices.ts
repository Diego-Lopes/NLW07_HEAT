import { io } from "../app";
import prismaClient from "../prisma";

class CreateMessageService {
  //precisamos receber duas informações, texto e user_id no bd.
  async execute(text: string, user_id: string) {
    const message = await prismaClient.message.create({
      data: {
        text,
        user_id,
      },
      include: {
        //aqui vai buscar todas as informações do usuario que fez a postagem da mensagem.
        user: true,
      },
    });

    //isso tudo é de informação que vai voltar ao usuário.
    const infWS = {
      text: message.text,
      user_id: message.user_id,
      created_at: message.created_at,
      user: {
        name: message.user.name,
        avatar_url: message.user.avatar_url,
      },
    };

    io.emit("new_message", infWS);
    return message;
  }
}
export { CreateMessageService };
