import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  ChakraProvider,
  Center,
  Alert,
  AlertIcon,
  Divider,
} from "@chakra-ui/react";
import Head from "next/head";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  console.log(email);

  const handlePasswordLinkReset = async () => {
    setAlertMessage("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://www.watchtodayguide.com/password-reset",
      });
      if (error) {
        throw error;
      }
      setAlertMessage("Link do Reset Send To E-mail");
    } catch (e) {
      console.log(e);
      setAlertMessage(e.message);
    }
  };

  return (
    <ChakraProvider>
      <Head>
        <title>Reset Password</title>
        <meta name="keywords" content="tvshow,watch,review"></meta>
        <meta name="description" content="movies, series, tvshows"></meta>
      </Head>
      <></>
      <Center height="100vh">
        <Box
          p={4}
          borderWidth="1px"
          maxW="400px"
          width="100%"
          position="relative"
        >
          <Heading as="h1" size="xl" textAlign="center" mb={4}>
            Password Reset{" "}
          </Heading>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </FormControl>

          <br />
          <Center>
            <Button
              onClick={() => handlePasswordLinkReset()}
              colorScheme="green"
              size="sm"
            >
              Send a Link
            </Button>
          </Center>
          <br />
          {alertMessage && (
            <ChakraProvider>
              <Alert status="info">
                <AlertIcon />
                {alertMessage}
              </Alert>
            </ChakraProvider>
          )}
          <br />

          <Divider my={4} />

          <br />
        </Box>
      </Center>
    </ChakraProvider>
  );
}
