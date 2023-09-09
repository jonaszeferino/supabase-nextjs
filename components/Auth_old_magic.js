import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import {
  Box,
  Button,
  Input,
  Center,
  Heading,
  Text,
  ChakraProvider,
  Link,
} from "@chakra-ui/react";

export default function Auth({ onAuthenticated, onClose }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);

  const handleLogin = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setMessage("Verifique seu e-Mail para o Login!");

      // Assuming authentication was successful
      const { session } = await supabase.auth.getSession(); // Get the session
      if (session) {
        onAuthenticated(session); // Pass the session back to the Navbar
        onClose(); // Close the modal
      }
    } catch (error) {
      setMessage(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <Center height="100vh">
        <Box width="md" p={6} borderWidth={1} borderRadius="lg" shadow="lg">
          <Heading as="h1" size="xl" mb={4}>
            Acesso por e-mail{" "}
          </Heading>
          <Text mb={4}>
            Informe seu e-mail para acesso. Aguarde a confirmação em sua caixa de entrada.{" "}
          </Text>
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            mb={4}
          />
          <Button
            onClick={() => {
              handleLogin(email);
            }}
            colorScheme="blue"
            isLoading={loading}
            loadingText="Loading"
            isFullWidth
          >
            Envie o Link de Acesso
          </Button>

          <br />

          <Link href="/">
            <Button variant="link">Home</Button>
          </Link>

          {message && (
            <Text
              mt={4}
              color={message.includes("error") ? "red.500" : "green.500"}
            >
              {message}
            </Text>
          )}
        </Box>
      </Center>
    </ChakraProvider>
  );
}
