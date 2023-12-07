import Link from "next/link";
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
  ModalFooter,
  useDisclosure,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ChakraProvider,
  ModalCloseButton,
  Center,
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
      <ul className={styles.navbar}>
        <li>
          <Link href="/">
            <a>| Home</a>
          </Link>
        </li>
        <li>
          <Link href="/watch-today">
            <a>| What to Watch Today?</a>
          </Link>
        </li>
        <li>
          <Link href="/search-movies">
            <a>| Discovery Movies</a>
          </Link>
        </li>
        <li>
          <Link href="/search-tvshows">
            <a>| Find Tv Shows</a>
          </Link>
        </li>
        <li>
          <Link href="/where-is-my-movie">
            <a>| Where is My Movie? |</a>
          </Link>
        </li>
        <br />
        <li>
          <button onClick={onOpen}>Login |</button>
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
                <Auth onAuthenticated={onAuthenticated} onClose={onClose} />
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
                  <MenuList>
                    <MenuItem>
                      <Link href="/profile">
                        <a
                          style={{ background: "#7657bd", paddingLeft: "10px" }}
                        >
                          Data
                        </a>
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link href="/my-movies-page">
                        <a style={{ background: "#7657bd", padding: "10px" }}>
                          My Ratings
                        </a>
                      </Link>
                    </MenuItem>
                  </MenuList>
                </>
              )}
            </Menu>
          </li>
        ) : null}
      </ul>
      <SearchBar isLoading={isLoading} />
    </>
  );
}
