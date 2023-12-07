import React, { useState, useEffect } from "react"; // Importe useState e useEffect
import { Alert, Button, Space } from "antd";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient"; // Certifique-se de importar supabase aqui

const LoginAlert = () => {
  const [session, setSession] = useState(); // Defina session usando useState
  const [isLoading, setIsLoading] = useState(); // Defina isLoading usando useState

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
    <>
      {!session && (
        <Space
          direction="vertical"
          style={{
            width: "100%",
          }}
        >
          <Alert
            message="Sign in for free and Have the Possibility to Evaluate the Movie Suggestions from 'What to Watch Today?' - After Logging In - Access Profile > My Ratings"
            type="success"
            showIcon
            action={
              <Button size="small" type="text">
                <Link href="/signUp">
                  <a>Go to Login Page</a>
                </Link>
              </Button>
            }
            closable
          />
        </Space>
      )}
    </>
  );
};

export default LoginAlert;
