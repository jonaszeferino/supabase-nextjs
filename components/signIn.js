const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email, password });
      if (error) {
        throw error;
      }
  
      // Login successful
      const { session } = await supabase.auth.getSession();
      if (session) {
        onAuthenticated(session);
        onClose();
      }
    } catch (error) {
      setMessage(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };