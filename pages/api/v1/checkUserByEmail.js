import { supabase } from "../../../utils/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (data) {
        return res.status(200).json({ user: data });
      }

      return res.status(404).json({ error: "User not found" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
