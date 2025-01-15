import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Flex,
  Link,
  Image,
  ChakraProvider,
  HStack,
  Button,
  Center,
} from "@chakra-ui/react";
import SearchBar from "./SearchBar";

export default function Navbar({ isLoading }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(true);
  const router = useRouter();

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
    <ChakraProvider>
      <Box
        as="nav"
        bg="purple.100"
        color="black"
        position="fixed"
        top={0}
        width="100%"
        zIndex={1000}
        boxShadow={isScrolled ? "md" : "none"}
        transition="all 0.3s ease-in-out"
        p={2}
      >
        {/* SearchBar com transição */}
        <Box
          bg="purple.100"
          p={2}
          borderBottom="1px solid purple.50"
          paddingBottom={8}
          opacity={showSearchBar ? 1 : 0}
          transform={showSearchBar ? "translateY(0)" : "translateY(-20px)"}
          transition="opacity 0.6s ease, transform 0.6s ease"
        >
          <Center>
            <SearchBar isLoading={isLoading} />
          </Center>
        </Box>

        {/* Navbar */}
        <Flex
          align="center"
          justify="center"
          mt={isScrolled ? -10 : -5}
          px={3}
          py={isScrolled ? -1 : -4} // Reduzido o padding vertical quando navbar está pequeno
          bg="purple.100"          
        >
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logo_10.png"
              alt="logo"
              height={isScrolled ? "80px" : "180px"} // Reduzido para 80px quando navbar está pequeno
              marginTop={isScrolled ? "0" : "10px"}
              objectFit="contain"
              transition="height 0.8s ease, margin-top 0.8s ease"
              marginRight={10}
            />
          </Link>

          {/* Navigation Links */}
          <HStack spacing={6}>
            {[
              "Home",
              "Search Movies",
              "Search TvShows",
              "Watch Today",
              "Birthday Movies",
            ].map((label, index) => (
              <Button
                key={index}
                borderRadius={15}
                as="a"
                href={`/${label.toLowerCase().replace(/\s+/g, "-")}`}
                bg="purple.500"
                color="white"
                _hover={{
                  bg: "purple.100",
                }}
                transition="background-color 0.3s ease-in-out"
              >
                {label}
              </Button>
            ))}
          </HStack>
        </Flex>
      </Box>
    </ChakraProvider>
  );
}
