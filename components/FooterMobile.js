import { Box, Text, Link, Icon, useMediaQuery, Center, Heading } from "@chakra-ui/react";
import { SiThemoviedatabase } from "react-icons/si";
import { useRouter } from "next/router";

export default function FooterMobile() {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  if (isMobile) {
    return (
      <Box bg="gray.900" p={4} textAlign="center" flex="1">

        <Center>

          <Heading as="h3" size="md" style={{ color: "white" }}>
            {router.pathname === "/" ? "Home" :
              router.pathname === "/search-movies" ? "Movies" :
                router.pathname === "/search-tvshows" ? "TvShows" :
                router.pathname === "/birthday-movies" ? "Birthday Movies" :
                router.pathname === "/movie-page" ? "Movie Page" :
                router.pathname === "/tvshow-page" ? "TvShow Page" :
                router.pathname === "/trivia" ? "Trivia" :
                router.pathname === "/tvshow-season-page" ? "TvShow Seasons" :
                router.pathname === "/watch-today" ? "What To Watch Today?" :
                router.pathname === "/watch-today" ? "What To Watch Today?" :
                router.pathname === "/my-movies-page" ? "My Tip Ratings" :
                router.pathname === "/contect" ? "Contact" :
                router.pathname === "/person-page" ? "Person Page" :
                router.pathname === "/password-reset" ? "Password Reset" :
                router.pathname === "/signUP" ? "Auth" :
                router.pathname === "/policies" ? "Policies" :
                router.pathname === "/profile" ? "Profile" :
                router.pathname === "/send-email-password-reset" ? "Password Reset" :
                router.pathname === "/search-free" ? "Search Free" :
                  null}
          </Heading>

        </Center>
        <Box>
          <Text color="white" fontSize="sm">
            What to Watch Today? &copy; Jonas Zeferino - 2023{" "}
          </Text>
          <Text color="white" fontSize="sm">
            Powered By:
            <Link
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              ml={1}
            >
              <Icon as={SiThemoviedatabase} boxSize={6} />
            </Link>
          </Text>
        </Box>

      </Box>
    );
  }
}