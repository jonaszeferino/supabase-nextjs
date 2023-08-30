import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import Auth from "./Auth"; 
import { useState } from "react";

import { useRouter } from "next/router"; // Importe o hook useRouter

export default function Navbar({ isLoading }) {
  const [searchText, setSearchText] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  const router = useRouter();

  return (
    <>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {showAuth && <Auth />}{" "}
        {/* Renderiza o componente Auth se showAuth for verdadeiro */}
      </div>
      <ul className={styles.navbar}>
        <li>
          <button onClick={() => setShowAuth(true)}>Fazer Login</button>
        </li>
        <li>
          <Link href="/">
            <a>| Home</a>
          </Link>
        </li>
        <li>
          <Link href="/watch-today">
            <a>| O que Ver Hoje?</a>
          </Link>
        </li>
        <li>
          <Link href="/search-movies">
            <a>| Descobrir Filmes</a>
          </Link>
        </li>
        <li>
          <Link href="/search-tvshows">
            <a>| Busca de Séries</a>
          </Link>
        </li>
        <li>
          <Link href="/where-is-my-movie">
            <a>| Onde Está Meu Filme? |</a>
          </Link>
        </li>
        <br />
      </ul>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}></div>
    </>
  );
}
