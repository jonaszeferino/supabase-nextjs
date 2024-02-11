import { useState, useEffect } from "react";
import Auth from "./Auth";
import {
  Box,
  Button,
  Stack,
  useDisclosure,
  Heading,
  Center,
  ChakraProvider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  IconButton,
  ModalBody
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import { FaTimes } from "react-icons/fa";

const MobileNavbar = (isLoading, onAuthenticated) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [session, setSession] = useState();
  const router = useRouter();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Função para fechar o menu
  const closeMenu = () => {
    setMenuOpen(false);
  };

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
      <div
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          zIndex: "999",
        }}
      >
        <Box
          bg="purple.500"
          color="white"
          p={4}
          display={{ base: "block", md: "none" }}
        >
          <Center>
            <Heading as="h3" size="md">Watch Today Guide</Heading>
          </Center>

          <ChakraProvider>
            <SearchBar />
          </ChakraProvider>

          <br />
          <br />
          <br />

          <Stack direction="row" align="center" justify="space-between">
            <Link href="/" onClick={closeMenu}>
              Home
            </Link>
            {!session ?
              <button onClick={onOpen}> <strong>Login</strong> </button>
              : null}
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
            <ChakraProvider>
              {session ? (
                <p>
                  {session.user.email} <br />
                  <></>
                </p>
              ) : null}

            </ChakraProvider>

            <Button onClick={toggleMenu}>
              {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
            </Button>
          </Stack>

          {menuOpen && (
            <Stack spacing={4} mt={4}>
              <Link href="/watch-today" onClick={closeMenu}>

                <span>
                  <ChevronRightIcon /> What to Watch Today?
                </span>

              </Link>
              <Link href="/search-movies" onClick={closeMenu}>

                <span>
                  <ChevronRightIcon /> Discover Movies
                </span>

              </Link>
              <Link href="/search-tvshows" onClick={closeMenu}>

                <span>
                  <ChevronRightIcon /> Discover Tv Shows
                </span>

              </Link>
              <Link href="/birthday-movies" onClick={closeMenu}>

                <span>
                  <ChevronRightIcon /> Birthday Movie
                </span>

              </Link>
              <Link href="/trivia" onClick={closeMenu}>

                <span>
                  <ChevronRightIcon /> Trivia
                </span>

              </Link>

              {session ? (
                <>
                  <Link href="/profile" onClick={closeMenu}>

                    <span>
                      <ChevronRightIcon /> Profile
                    </span>

                  </Link>
                  <Link href="/my-movies-page" onClick={closeMenu}>

                    <span>
                      <ChevronRightIcon /> My Ratings
                    </span>

                  </Link>
                </>
              ) : null}
            </Stack>
          )}
        </Box>

      </div>
      <div style={{ paddingTop: "100px" }}>

      </div>
    </>
  );
};

export default MobileNavbar;
