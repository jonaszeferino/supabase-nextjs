import { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  useDisclosure,
  Heading,
  Center,
  Text,
  ChakraProvider,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

const MobileNavbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [session, setSession] = useState();
  const router = useRouter();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
          bg="blue.500"
          color="white"
          p={4}
          display={{ base: "block", md: "none" }}
        >
          <Center>
            <Heading>O Que Assistir Hoje?</Heading>
          </Center>

          <Stack direction="row" align="center" justify="space-between">
            <Link href="/">Home</Link>
            {!session && <Link href="/signUp">Login</Link>}
            <ChakraProvider>
              {session ? (
                <p>
                  {session.user.email} <br />
                  {/* <Center>
                    <Button
                      onClick={() => supabase.auth.signOut()}
                      colorScheme="red"
                      size="sm"
                    >
                      Sair
                    </Button>
                  </Center> */}
                </p>
              ) : null}
              {/* Resto do seu código */}
            </ChakraProvider>

            <Button onClick={toggleMenu}>
              {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
            </Button>
          </Stack>

          {menuOpen && (
            <Stack spacing={4} mt={4}>
              <Link href="/watch-today">O que Ver Hoje?</Link>
              <Link href="/search-movies">Descobrir Filmes</Link>
              <Link href="/search-tvshows">Busca de Séries</Link>
              <Link href="/where-is-my-movie">Onde Está Meu Filme?</Link>
              {session ? (
                <>
                  <Link href="/profile">Perfil</Link>
                  <Link href="/my-movies-page">Minhas Avaliações</Link>
                </>
              ) : null}
            </Stack>
          )}
        </Box>
      </div>
      <div style={{ paddingTop: "100px" }}>
        {/* Adicione espaço acima do SearchBar para não sobrepor o Navbar */}
        <SearchBar />
      </div>
    </>
  );
};

export default MobileNavbar;
