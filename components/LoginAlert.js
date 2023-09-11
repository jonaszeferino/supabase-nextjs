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
            message="Faça o Login Gratuito e Tenha a Possibilidade de Avaliar as Sugestões de Filme do 'O Que Ver Hoje?' - Depois de Logar - Acesse Perfil > Minhas Avaliações"
            type="success"
            showIcon
            action={
              <Button size="small" type="text">
                <Link href="/signUp">
                  <a>Ir para a página de Login</a>
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
