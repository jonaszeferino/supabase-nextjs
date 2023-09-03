// SignInPage.js

import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  ChakraProvider
} from "@chakra-ui/react";
import { supabase } from "../utils/supabaseClient";

export default function SignInPage({ onAuthenticated }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { user, error } = await supabase.auth.signIn({
        email,
        password,
      });
      if (error) {
        throw error;
      }

      // Login successful
      setMessage("Login successful!");
      onAuthenticated(user);
    } catch (error) {
      setMessage(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChakraProvider>
    <Box width="md" p={6} borderWidth={1} borderRadius="lg" shadow="lg">
      <Text mb={4}>Coloque se e-mail e Senha.</Text>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        mb={4}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        mb={4}
      />
      <Button
        onClick={handleLogin}
        colorScheme="blue"
        isLoading={loading}
        isFullWidth
      >
        Sign In
      </Button>
      {message && (
        <Text mt={4} color={message.includes("error") ? "red.500" : "green.500"}>
          {message}
        </Text>
      )}
    </Box>
    </ChakraProvider>
  );
}
