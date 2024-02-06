import styles from "../styles/Navbar.module.css";
import Auth from "./Auth";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { supabase } from "../utils/supabaseClient";
import SearchBar from "./SearchBar";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Link,
  useDisclosure,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ChakraProvider,
  Image,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

export default function Navbar({ isLoading, onAuthenticated }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [session, setSession] = useState(null);
  const router = useRouter();

  // Session Verify
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
      <SearchBar isLoading={isLoading} />
      <ul className={styles.navbar}>
        <Link href="/">
          <Image
            src="/logo_10.png"
            alt="poster"
            width="160"
            height="160"
            mt={10}
            style={{
              display: "block",
              marginBottom: "2px",
              marginTop: "2px",
            }}
          />
        </Link>
        <ul className={styles.navbar}>
          <ul className={styles.navbar}>
            <ul className={styles.navbar}>
              <ul className={styles.navbar}>
                <li>
                  <Link href="/">| Home</Link>
                </li>
                <li>
                  <Link href="/watch-today">| What to Watch Today?</Link>
                </li>
                <li>
                  <Link href="/search-movies">| Discover Movies</Link>
                </li>
                <li>
                  <Link href="/search-tvshows">| Discover Tv Shows</Link>
                </li>
                <li>
                  <Link href="/birthday-movies">| Birthday Movie</Link>
                </li>
                <li>
                  <Link href="/trivia">| Trivia</Link>
                </li>

                <br />
                <li>
                  <button onClick={onOpen}>| Login |</button>
                </li>
                <li>
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
                        <Auth
                          onAuthenticated={onAuthenticated}
                          onClose={onClose}
                        />
                      </ModalBody>
                    </ModalContent>
                  </Modal>
                </li>

                {session ? (
                  <li>
                    Profile
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
                          <MenuList
                            style={{ background: "#7657be", padding: "10px" }}
                          >
                            <MenuItem>
                              <Link href="/profile">Data</Link>
                            </MenuItem>
                            <MenuItem>
                              <Link href="/my-movies-page">My Ratings</Link>
                            </MenuItem>
                          </MenuList>
                        </>
                      )}
                    </Menu>
                  </li>
                ) : null}
              </ul>
            </ul>
          </ul>
        </ul>
      </ul>
    </>
  );
}
