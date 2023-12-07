import client from "../../../mongoConnection";

export default async function getProfileData(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { email } = req.query; // Use o endereço de e-mail fornecido na consulta

  const collection = client.db("moviesTvshows").collection("users");

  try {
    const user = await collection.findOne({ email: email });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
