import react, { useState, useEffect } from "react";
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
  Link,
  Divider,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { FaGoogle, FaEyeSlash, FaEye } from "react-icons/fa";
import LoggedUser from "../components/LoggedUser";
import Head from "next/head";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [session, setSession] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordReset = async () => {
    setAlertMessage("");
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        throw error;
      }
      setAlertMessage("Senha Trocada");
    } catch (e) {
      setAlertMessage(e.message);
    }
  };

  return (
    <ChakraProvider>
      <>
        <Head>
          <title>
            Password Reset
          </title>
          <meta
            name="keywords"
            content="movies,watch,review,series,filmes"
          ></meta>
          <meta name="description" content="encontre filmes e series"></meta>
        </Head>
        <LoggedUser />
      </>
      <Center height="100vh">
        <Box
          p={4}
          borderWidth="1px"
          maxW="400px"
          width="100%"
          position="relative"
        >
          <Heading as="h1" size="xl" textAlign="center" mb={4}>
            Reset de Senha
          </Heading>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Senha</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
              />
              <InputRightElement width="3rem">
                <Button
                  h="1.5rem"
                  size="sm"
                  onClick={togglePasswordVisibility}
                  tabIndex="-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <br />
          <Center>
            <Button
              onClick={() => handlePasswordReset()}
              colorScheme="green"
              size="sm"
            >
              Reset
            </Button>
          </Center>
          <br />
          {alertMessage && (
            <ChakraProvider>
              <Alert status="info">
                <AlertIcon />
                {alertMessage === "Email not confirmed"
                  ? "E-mail Não Confirmado"
                  : alertMessage}
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

export default PasswordReset;
