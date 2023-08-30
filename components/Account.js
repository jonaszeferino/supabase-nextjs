import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import {
  Input,
  Button,
  Box,
  FormControl,
  FormLabel,
  ChakraProvider,
  extendTheme,
  Text
} from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        width: "100%",
        margin: "0 auto",
        maxWidth: "600px", // Set maximum width here
      },
    },
  },
});

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    getProfile();
    if (session?.user?.email) {
      setEmail(session.user.email); // Set email state when session changes
    }
  }, [session, getProfile]);

  async function getCurrentUser() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    if (!session?.user) {
      throw new Error("User not logged in");
    }

    return session.user;
  }

  async function getProfile() {
    try {
      setLoading(true);
      const user = await getCurrentUser();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true);
      const user = await getCurrentUser();

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ChakraProvider theme={theme}>
      Print session abaixo JSON
      <Text>Quem Está logado: {email}</Text>{" "}
      <Box p={4} borderWidth={1} borderRadius="lg" shadow="lg">
        <FormControl mb={4}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            type="email"
            value={session.user.email}
            isDisabled
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel htmlFor="username">Name</FormLabel>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel htmlFor="website">Website</FormLabel>
          <Input
            id="website"
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </FormControl>
        <Button
          colorScheme="blue"
          isLoading={loading}
          onClick={updateProfile}
          isFullWidth
          mb={4}
        >
          {loading ? "Loading ..." : "Salvar"}
        </Button>
        <Button
          colorScheme="gray"
          onClick={() => supabase.auth.signOut()}
          isFullWidth
        >
          Deslogar
        </Button>
      </Box>
    </ChakraProvider>
  );
}
