import { useEffect, useState } from "react";

// Armazenamento de token
export const useSpotifyAuth = () => {
  const [token, setToken] = useState(null);
// Um estado token é criado para armazenar o token de acesso
// Aqui gerenciamos a autenticação.
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken(null);
    window.localStorage.removeItem("token");
  };

  return { token, logout };
};
