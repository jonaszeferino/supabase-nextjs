'use client'
import React, { useState } from 'react';
import { Flex, Box, Button, Link, ChakraProvider, Divider, Image, FormControl, FormLabel, Input, Center, useMediaQuery, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Alert, AlertIcon } from '@chakra-ui/react';
import { supabase } from '../utils/supabaseClient';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log('Formulário enviado:', { email, password });
  };

  const handlePasswordReset = async () => {
    setAlertMessage('');
    try {
      const { error } = await supabase.auth.api.resetPasswordForEmail(resetEmail);
      if (error) {
        throw error;
      }
      setAlertMessage('Email de redefinição de senha enviado');
    } catch (e: any) {
      setAlertMessage(e.message);
    }
  };

  return (
    <ChakraProvider>
      <Flex justify="center" align="center" h="100vh">
        <Box w="50%" p={8}>
          <Center>
            <Box as="form" onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  w={400}
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="flushed"
                  borderRadius={10}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel htmlFor="password">Senha</FormLabel>
                <Input
                  w={400}
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="flushed"
                  borderRadius={10}
                />
              </FormControl>
              <Link onClick={() => setIsModalOpen(true)}>Esqueceu a senha?</Link>
              <br />
              <Button mt={8} type="submit" colorScheme="blue">
                Entrar
              </Button>
            </Box>
          </Center>
        </Box>
        <Box w="50%" bg="#01377D" h="100%" p={8}>
          <Flex justify="center" align="center" h="100%">
            <Image src="/car_trade_logo_oficial.png" w={400} alt="Logo" />
          </Flex>
        </Box>
      </Flex>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Redefinir Senha</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel htmlFor="reset-email">Email</FormLabel>
              <Input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                variant="flushed"
                borderRadius={10}
              />
            </FormControl>
            {alertMessage && (
              <Alert status="info" mt={4}>
                <AlertIcon />
                {alertMessage}
              </Alert>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handlePasswordReset}>
              Enviar Email
            </Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default Login;
