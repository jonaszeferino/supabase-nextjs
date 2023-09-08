import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import Auth from "./Auth";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

import { supabase } from "../utils/supabaseClient";

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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router"; 
export default function Navbar({ isLoading, onAuthenticated }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchText, setSearchText] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [session, setSession] = useState(null);
  const [isError, setError] = useState(false); // You can keep this line if it's used somewhere
  const [loading, setIsLoading] = useState(false); // Remove this line

  const router = useRouter();

  // Verificar sessão
  useEffect(() => {
    let mounted = true;
    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted) {
        if (session) {
          setSession(session);
        }
        setIsLoading(false);
      }
    }
    getInitialSession();
    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {showAuth && <Auth />}{" "}
      </div>
      <ul className={styles.navbar}>
        <li>
          <Link href="/">
            <a>| Home</a>
          </Link>
        </li>
        <li>
          <Link href="/watch-today">
            <a>| O que Ver Hoje? |</a>
          </Link>
        </li>

        {/* <li>
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
        </li> */}

        <br />

        <li>
          <button onClick={onOpen}>Login |</button>
        </li>
        {session ? (
          <li>
            Perfil
            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    isActive={isOpen}
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                  >
                    {""}
                  </MenuButton>
                  <MenuList>
                    <MenuItem>
                      <Link href="/profile">
                        <a>Dados</a>
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link href="/my-movies-page">
                        <a>Minhas Avaliações</a>
                      </Link>
                    </MenuItem>
                  </MenuList>
                </>
              )}
            </Menu>
          </li>
        ) : null}

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent style={{ background: "white" }}>
            <ModalHeader>
              Login
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
              Login{" "}
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
