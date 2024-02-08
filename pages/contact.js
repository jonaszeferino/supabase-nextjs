import React from "react";
import { useForm, ValidationError } from "@formspree/react";
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  ChakraProvider,
  Box,
  Center
} from "@chakra-ui/react";

function ContactForm() {
  const [state, handleSubmit] = useForm("xqkrpnqg");

  if (state.succeeded) {
    return <p>Thanks for your contact!</p>;
  }

  return (
    <ChakraProvider>
      <Center>
        <Box maxW="900px" mt="4">
          <form onSubmit={handleSubmit}>
            <FormControl id="name" isRequired>
              <FormLabel>Your Name</FormLabel>
              <Input type="text" name="name" />
              <ValidationError
                prefix="Name"
                field="name"
                errors={state.errors}
              />
            </FormControl>

            <FormControl id="email" isRequired mt={4}>
              <FormLabel>Email Address</FormLabel>
              <Input type="email" name="email" />
              <ValidationError
                prefix="Email"
                field="email"
                errors={state.errors}
              />
            </FormControl>

            <FormControl id="message" isRequired mt={4}>
              <FormLabel>Message</FormLabel>
              <Textarea name="message" />
              <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
              />
            </FormControl>

            <Button
              mt={4}
              colorScheme="teal"
              isLoading={state.submitting}
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Box>
      </Center>
    </ChakraProvider>
  );
}

function App() {
  return <ContactForm />;
}

export default App;
