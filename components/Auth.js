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
  Text,
} from "@chakra-ui/react";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState(""); // Estado para a mensagem do Alert
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignUp = async () => {
    setAlertMessage("");
    try {
      const { user, error, status } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      console.log("User:", user);
      console.log("Session:", session);
      console.log("Error:", error);
      setAlertMessage("Verifique seu E-mail")

      if (user) {
        console.log("Usuário cadastrado com sucesso:", user);
        setAlertMessage("Verifique seu E-mail");
      } else if (error) {
        if (status === 429) {
          console.log("Status 429 - Muitas solicitações recentes");
          setAlertMessage(
            "Você fez muitas solicitações recentemente. Aguarde um momento."
          );
        } else {
          console.error("Erro durante o cadastro:", error);
          setAlertMessage(error.message);
        }
      }
    } catch (e) {
      console.error("Erro completo:", e);
      setAlertMessage(e.message);
    }
  };

  const handleSignIn = async () => {
    setAlertMessage("");
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
      console.log(user);
      console.log(session);
    } catch (e) {
      setAlertMessage(e.message);
    }
  };

  const changeForm = () => {
    setIsSignUp((value) => !value);
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.api.resetPasswordForEmail(email);
  
      if (!error) {
        console.log("E-mail de redefinição de senha enviado com sucesso.");
        // Lógica adicional, como exibir uma mensagem de sucesso.
      } else {
        console.error("Erro ao enviar e-mail de redefinição de senha:", error);
        // Trate o erro de acordo com as necessidades do seu aplicativo.
      }
    } catch (error) {
      console.error("Erro ao enviar e-mail de redefinição de senha:", error);
      // Trate o erro de acordo com as necessidades do seu aplicativo.
    }
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
          <br />
          <br />
          {alertMessage && (
            <ChakraProvider>
              <Alert status="info">
                <AlertIcon />
                {alertMessage === "Email not confirmed" ? "E-mail Não Confirmado" : alertMessage}
              </Alert>
            </ChakraProvider>
          )}
            <Button mt={4} colorScheme="teal" size="md" onClick={resetPassword}>
              Esqueci a senha
            </Button>

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
