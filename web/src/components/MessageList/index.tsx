import styles from "./styles.module.scss";
import logoImg from "../../assets/logo.svg";
import { api } from "../../services/api";
import { useEffect, useState } from "react";
import io from "socket.io-client";

type Message = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  };
};

//criando um fila de mensagem de
const messagesQueue: Message[] = [];

const socket = io("http://localhost:4000");

socket.on("new_message", (newMessage: Message) => {
  messagesQueue.push(newMessage);
});

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setMessages(
          (
            prevState //seguramos a mensagem anteriores.
          ) =>
            [
              messagesQueue[0], //colocamos a última mensagem aqui.
              prevState[0], //colocamos o conteúdo de messages aqui.
              prevState[1], //colocamos aqui também porém em outro index.
            ].filter(Boolean)
          //esse filter(Boolean) faz um filtro removendo tudo que é false
        );
        messagesQueue.shift();
      }
    }, 3000);
  }, []);

  useEffect(() => {
    //get<Message[]> definimos o get com seu retorno seja o mesmo da tipagem.
    api.get<Message[]>("messages/last3").then((response) => {
      setMessages(response.data);
    });
  }, []);
  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />

      {messages.map((message) => {
        return (
          <ul key={message.id} className={styles.messageList}>
            <li className={styles.message}>
              <p className={styles.messageContent}>{message.text}</p>
              <div className={styles.messageUser}>
                <div className={styles.userImage}>
                  <img src={message.user.avatar_url} alt={message.user.name} />
                </div>
                <span>Diego Lopes</span>
              </div>
            </li>
          </ul>
        );
      })}
    </div>
  );
}
