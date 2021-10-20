import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
};

type AuthContextData = {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
};

export const AuthContext = createContext({} as AuthContextData);
type AuthProvider = {
  //ReactNode significar qualquer coisar aceitável por react, assim facilita nosso uso.
  children: ReactNode;
};

type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  };
};

export function AuthProvider(props: AuthProvider) {
  const [user, setUser] = useState<User | null>(null);

  //usando scope=user, queremos apenas informações principais do usuário
  //vamos precisar de mais duas variáveis, para isso usamo o "&" para concatenar.
  //&redirect_uri=http://localhost:3000, redirect_uri faz redirecionamento após validação.
  //client_id é o id da do aplicativo do github.

  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=24fe442bcf9c9994487a`;

  async function signIn(codeGithub: string) {
    //mandamos para o back o código de autenticação, e armazenamos o callback em response com o token
    // que recebemos do backand;
    //<AuthResponse> vai devolver um retorno com esse formato que passamo entre menor que, maior que.
    const response = await api.post<AuthResponse>("authenticate", {
      code: codeGithub,
    });

    const { token, user } = response.data; //fazemos a desestruturação.

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    //armazenando o token do usuário no navegador.
    //"@dowhile:token" o nome que damos.
    //token o valor dele.
    localStorage.setItem("@dowhile:token", token);
    setUser(user);
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem("@dowhile:token");
  }

  useEffect(() => {
    const token = localStorage.getItem("@dowhile:token");
    //quando da f5 na pagaina
    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;
      //essa linha faz com que toda vez que faz uma chamada já manda em toda aplicação o token no cabeçalho.

      api.get<User>("profile").then((response) => {
        setUser(response.data);
      });
    }
  }, []);

  useEffect(() => {
    //pegando na url o codigo de autenticação do github.
    const url = window.location.href;
    const hasGithubCode = url.includes("?code="); //verificamos se a url contém ?code=

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split("?code=");
      //aqui está acontecendo o seguinte ação.
      //split vai fazer a separação, onde, antes do ?code= vai ficar na variável urlWithoutCode.
      //e após o ?code= vai ficar no githubCode.
      console.log({ urlWithoutCode, githubCode });

      //escondendo o retorno da autenticação da url do usuário.
      window.history.pushState({}, "", urlWithoutCode);

      //enviando para o backand
      signIn(githubCode);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
}
