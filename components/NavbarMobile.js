import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Stack,
  Center,
  ChakraProvider,
  Image,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Link from "next/link";
import SearchBar from "./SearchBar";

const MobileNavbar = ({ isLoading }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(true);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowSearchBar(window.scrollY <= 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 999 }}>
      <Box
        bg="purple.500"
        color="white"
        p={4}
        display={{ base: "block", md: "none" }}
        transition="all 0.3s ease"
        height={isScrolled ? "60px" : "145px"}
        boxShadow={isScrolled ? "md" : "none"}
      >
        <Center>
          <Image
            src="/logo_12.png"
            alt="Logo"
            height={isScrolled ? "60px" : "90px"}
            transition="height 0.3s ease"
            marginTop={-4}
            marginBottom={0}
          />
        </Center>
        <Box
          opacity={showSearchBar ? 1 : 0}
          transform={showSearchBar ? "translateY(0)" : "translateY(-20px)"}
          transition="opacity 0.6s ease, transform 0.6s ease"
          marginTop={-4}
          padding={-2}
        >
          <Center>
            <ChakraProvider>
              <SearchBar isLoading={isLoading} style={{ backgroundColor: 'gray', marginTop: '-10px', width: '300px' }} />
            </ChakraProvider>
          </Center>
        </Box>

        <Stack direction="row" align="center" justify="space-between" mt={-30}>
          <Link href="/" onClick={closeMenu}>
            Home
          </Link>

          <Button onClick={toggleMenu}>
            {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </Button>
        </Stack>

        {menuOpen && (
          <Stack
            spacing={4}
            mt={14}
            bg="purple.500"
            p={4}
            borderRadius="md"
            boxShadow="md"
          >
            <Link href="/watch-today" onClick={closeMenu}>
              What to Watch Today?
            </Link>
            <Link href="/search-movies" onClick={closeMenu}>
              Discover Movies
            </Link>
            <Link href="/search-tvshows" onClick={closeMenu}>
              Discover TV Shows
            </Link>
            <Link href="/birthday-movies" onClick={closeMenu}>
              Birthday Movie
            </Link>
          </Stack>
        )}
      </Box>
    </div>
  );
};

export default MobileNavbar;
