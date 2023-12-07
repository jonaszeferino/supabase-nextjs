import { Box, Text, Link, Icon, useMediaQuery } from "@chakra-ui/react";
import { SiThemoviedatabase } from "react-icons/si";

export default function FooterMobile() {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  if (isMobile) {
    return (
      <Box bg="gray.900" p={4} textAlign="center" flex="1">
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