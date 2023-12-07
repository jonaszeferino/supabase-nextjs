import React, { useState, useEffect } from "react";
import { Button, ChakraProvider } from "@chakra-ui/react";
import { supabase } from "../utils/supabaseClient";

const LoggedUser = () => {
  const [session, setSession] = useState();
  const [isLoading, setIsLoading] = useState();

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

  console.log(session);

  return (
    <ChakraProvider>
      {session ? (
        <p>
          User: {session.user.email} <br />
          <Button
            onClick={() => supabase.auth.signOut()}
            colorScheme="red"
            size="sm"
          >
            Sign Out
          </Button>
        </p>
      ) : null}
    </ChakraProvider>
  );
};

export default LoggedUser;
