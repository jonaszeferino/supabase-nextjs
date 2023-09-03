import react, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient"; // Importe o 'supabase' desta forma
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
  CloseButton,
  Link,
} from "@chakra-ui/react";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState(""); // Estado para a mensagem do Alert
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Estado para controlar a visibilidade do Alert
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignUp = async () => {
    try {
      const { user, signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (user) {
        console.log("Usuário cadastrado com sucesso:", user);
        setAlertMessage("Check your email to confirm sign up");
        setIsAlertOpen(true);

        // setTimeout(() => {
        setAlertMessage("");
        setIsAlertOpen(false);
        // }, 10000);
      } else if (signUpError) {
        console.log("Erro durante o cadastro:", signUpError);
        setAlertMessage(signUpError.message);
        setIsAlertOpen(true);
      }
    } catch (e) {
      console.error("Erro completo:", e);
      setAlertMessage(e.message);
      setIsAlertOpen(true);
    }
  };

  const handleSignIn = async () => {
    try {
      const { user, session, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      console.log("User:", user);
      console.log("Session:", session);
      console.log("Error:", error);

      if (error) {
        throw error;
      }
      setAlertMessage("Usuário Logado");
      setIsAlertOpen(true);
      console.log(user);
      console.log(session);

      setTimeout(() => {
        setAlertMessage("");
        setIsAlertOpen(false);
      }, 10000);
    } catch (e) {
      setAlertMessage(e.message);
      setIsAlertOpen(true);
    }
  };

  const changeForm = () => {
    setIsSignUp((value) => !value);
  };

  useEffect(() => {
    let mounted = true;
    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted) {
        if (session) {
          setSession(session);
        }
        setIsLoading(false);
      }
    }
    getInitialSession();
    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <ChakraProvider>
      <>
        <ChakraProvider>
          {session ? (
            <p>
              Usuário: {session.user.email} <br />
              <Button
                onClick={() => supabase.auth.signOut()}
                colorScheme="red"
                size="sm"
              >
                Sair
              </Button>
            </p>
          ) : null}
          {/* Resto do seu código */}
        </ChakraProvider>
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
            {isSignUp ? "Cadastre-se" : "Login"}
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
            <Input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </FormControl>

          {isSignUp && (
            <Button mt={4} colorScheme="teal" size="md" onClick={handleSignUp}>
              Cadastre-Se
            </Button>
          )}
          {!isSignUp && (
            <Button mt={4} colorScheme="teal" size="md" onClick={handleSignIn}>
              Login
            </Button>
          )}

          {isAlertOpen && (
            <Alert status="success" mt={4}>
              <AlertIcon />
              {alertMessage}
              <CloseButton
                position="absolute"
                right="8px"
                top="8px"
                onClick={() => setIsAlertOpen(false)}
              />
            </Alert>
          )}

          <br />
          <br />
          <br />
          <br />
          {/* Link para alternar entre Sign In e Sign Up */}
          <Link
            position="absolute"
            bottom="16px"
            left="50%"
            transform="translateX(-50%)"
            onClick={changeForm}
            cursor="pointer"
          >
            {isSignUp
              ? "Você já tem uma Conta? Faça o Login!"
              : "Você é Novo? Cadastre-se!"}
          </Link>
        </Box>
      </Center>
    </ChakraProvider>
  );
}
