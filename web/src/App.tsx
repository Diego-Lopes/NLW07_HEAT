import { useContext } from "react";
import styles from "./App.module.scss";
import { LoginBox } from "./components/LoginBox";
import { MessageList } from "./components/MessageList";
import { SendMessageForm } from "./components/SendMessageForm";
import { AuthContext } from "./contexts/auth";
//usando o module isolamos os estilos para cada chamada do mesmo, impedindo estilização em componente indesejado.
export function App() {
  const { user } = useContext(AuthContext);

  return (
    //chaves para implementar funções javascript em react
    <main
      className={`${styles.contentWrapper} ${
        !!user ? styles.contentSigned : ""
      }`}
    >
      <MessageList />
      {/* !! representa um boolean ? se  : se não  */}
      {!!user ? <SendMessageForm /> : <LoginBox />}
    </main>
  );
}
