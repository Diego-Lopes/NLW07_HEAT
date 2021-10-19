import prismaClient from "../prisma";

class GetLast3MessagesService {
  //precisamos pegar as 3 ultimas mensagens no bd.
  async execute() {
    const messages = await prismaClient.message.findMany({
      take: 3, //pegando os 3 últimos.
      orderBy: {
        //orderBy ordena na ordem que definimos.
        created_at: "desc",
      },
      include: {
        user: true,
      },
    });
    return messages;

    //vai ser mais ou menos algo desse tipo.
    //SELECT * FROM MESSAGES LIMIT 3 ORDER BY CREATED_AT DESC
  }
}
export { GetLast3MessagesService };
