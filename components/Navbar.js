import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import Auth from "./Auth";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router"; // Importe o hook useRouter

export default function Navbar({ isLoading, onAuthenticated }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchText, setSearchText] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  const router = useRouter();

  return (
    <>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {showAuth && <Auth />}{" "}
      </div>
      <ul className={styles.navbar}>
        <li>
          <button onClick={onOpen}>Fazer Login</button>
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
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent style={{ background: "white" }}>
            <ModalHeader>
              Acesso por meio do e-mail
              <IconButton
                icon={<FaTimes />}
                colorScheme="gray"
                variant="ghost"
                ml="auto"
                onClick={onClose}
              />
            </ModalHeader>
            <ModalBody>
              <Auth onClose={onClose} />
            </ModalBody>
          </ModalContent>
        </Modal>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent style={{ background: "white" }}>
            <ModalHeader>
              Acesso por meio do e-mail
              <IconButton
                icon={<FaTimes />}
                colorScheme="gray"
                variant="ghost"
                position="absolute"
                top="0"
                right="0"
                onClick={onClose}
              />
            </ModalHeader>
            <ModalBody>
              <Auth onAuthenticated={onAuthenticated} onClose={onClose} />
            </ModalBody>
          </ModalContent>
        </Modal>

        <br />
      </ul>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}></div>
    </>
  );
}
