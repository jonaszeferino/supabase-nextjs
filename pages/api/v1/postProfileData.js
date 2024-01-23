import client from "../../../mongoConnection";

export default async function getProfileData(req, res) {
  console.log("Received request:", req.method, req.url);

  if (req.method !== "POST") {
    console.log("Method Not Allowed");
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { email } = req.body;
  console.log("Request body:", req.body);

  if (!email) {
    console.log("Email is required in the request body");
    res.status(400).json({ error: "Email is required in the request body" });
    return;
  }

  const collection = client.db("moviesTvshows").collection("users");

  try {
    const user = await collection.findOne({ email });

    if (user) {
      console.log("User found:", user);
      res.status(200).json(user);
    } else {
      console.log("User not found");
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
