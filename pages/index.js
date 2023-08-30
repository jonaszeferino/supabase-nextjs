import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import Auth from "../components/Auth";
import Account from "../components/Account";
import Navbar from "../components/Navbar";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);

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
      <Navbar />

      <div className="container" style={{ padding: "50px 0 100px 0" }}>
        {!session ? (
          // <Auth />
           <></>
        ) : (
          <Account key={session.user.id} session={session} />
        )}
        <div>
          Aqui o Site Normal abaixo - auth e account estão como componentes
          importados
        </div>
      </div>
    </>
  );
}
