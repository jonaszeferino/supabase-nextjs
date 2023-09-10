import { Box, Text, Link, Icon, useMediaQuery } from "@chakra-ui/react";
import { SiThemoviedatabase } from "react-icons/si";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaAppStore,
  FaGooglePlay,
} from "react-icons/fa";

export default function Footer() {
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <Box bg="gray.900" p={4} textAlign="center">
        <Text color="white" fontSize="sm">
          O Que Assistir Hoje? &copy; Jonas Zeferino - 2023
        </Text>
        <Text color="white" fontSize="sm">
          Alimentado Por:
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
    );
  }
}
