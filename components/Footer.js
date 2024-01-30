import { VStack, HStack, Link, Text, Box } from "@chakra-ui/react";
import { SiThemoviedatabase } from "react-icons/si";

export default function Footer() {
  return (
    <footer style={{ marginBottom: 0 }}>
      <HStack
        direction="row"
        justify="start"
        align="flex-start"
        p={{ base: 10, md: 10 }}
        bgColor="#574384"
        color="white"
        h={{ base: "auto", md: "200px" }}
        spacing={5}
      >
        <VStack align="flex-start" spacing={4} padding={20} flexGrow={1}>
          <Text fontWeight="bold" mb={2}>
            Watch Today Guide
          </Text>
          <Text>&copy; Jonas Zeferino 2024</Text>

          <HStack spacing={2}>
            <Text>Powered by</Text>
            <Link href="https://www.themoviedb.org/" isExternal>
              <SiThemoviedatabase size={24} />
            </Link>
          </HStack>
          <Link href="/watch-today">Watch Today</Link>
        </VStack>

        <VStack
          flexGrow={1}
          align="flex-start"
          spacing={4}
          padding={20}
          marginLeft={2}
          marginRight={5}
        >
          <Text fontWeight="bold" mb={2}>
            Quick Links
          </Text>
          <Link href="/">Home</Link>
          <Link href="/search-movies">Movies</Link>
          <Link href="/search-tvshows">Tv Shows</Link>
        </VStack>

        <VStack
          flexGrow={1}
          align="flex-start"
          spacing={4}
          padding={20}
          marginLeft={2}
          marginRight={5}
        >
          <Text fontWeight="bold" mb={2}>
            Quick Links{" "}
          </Text>
          <Link href="/search-free?query=">Free Search</Link>
          <Link href="/where-is-my-movie">Where Is My Movie?</Link>
          <Link href="/trivia">Trivia</Link>
        </VStack>

        <VStack
          flexGrow={1}
          align="flex-start"
          spacing={4}
          padding={20}
          marginLeft={2}
          marginRight={5}
        >
          <Text fontWeight="bold" mb={2}>
            Auth
          </Text>
          <Link href="/signUp">Login / Sign Up</Link>
          <Link href="/send-email-password-reset">Password Reset</Link>
          <Link href="/policies">Policy</Link>
          <br />
          <br />
        </VStack>
      </HStack>
    </footer>
  );
}
