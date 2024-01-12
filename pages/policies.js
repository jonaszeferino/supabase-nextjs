import Head from "next/head";
import {
  ChakraProvider,
  Flex,
  Box,
  Text,
  Heading,
  Link as ChakraLink,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  Center,
} from "@chakra-ui/react";
import Link from "next/link";

const PoliciesPage = () => {
  return (
    <ChakraProvider>
      <Box bg="white" p={4} textAlign="center">
        <Head>
          <title>Site Policies</title>
        </Head>

        <Heading as="h1" mb={4}>
          Site Policies
        </Heading>

        <Tabs variant="soft-rounded" colorScheme="purple">
          <Center>
            <TabList>
              <Tab>Privacy</Tab>
              <Tab>Terms of Service</Tab>
              <Tab>Authentication</Tab>
            </TabList>
          </Center>
          <TabPanels>
            <TabPanel>
              <Box maxW="460px" mx="auto">
                <Text>
                  We do not collect any user information through cookies or
                  other means on our website. 
                </Text>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box maxW="460px" mx="auto">
                <Text>
                  Our site relies on open data provided by{" "}
                  <ChakraLink
                    href="https://www.themoviedb.org/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    TMDB (The Movie Database)
                  </ChakraLink>
                  . Users are encouraged to review TMDB's terms of service on
                  their website.Our Trivia service, powered by{" "}
                  <ChakraLink
                    href="https://the-trivia-api.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    The Trivia API
                  </ChakraLink>
                  , may collect data as per their privacy policy, which you can
                  find on their website.
                </Text>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box maxW="460px" mx="auto">
                <Text>
                  User authentication is handled securely through{" "}
                  <ChakraLink
                    href="https://supabase.io/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Supabase
                  </ChakraLink>
                  . We do not store sensitive authentication information
                  locally.
                </Text>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <Box bg="white" p={4} textAlign="center">
        <Text>
         ®️ {new Date().getFullYear()} The Only Apps. All rights
          
          reserved.
        </Text>
        <nav>
          <Button size="lg" colorScheme="purple" mt="24px">
            <Link href="/">Back to Home Page</Link>
          </Button>
        </nav>
      </Box>
    </ChakraProvider>
  );
};

export default PoliciesPage;
