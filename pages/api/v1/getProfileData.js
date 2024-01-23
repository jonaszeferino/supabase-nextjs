import client from "../../../mongoConnection";

export default async function getProfileData(req, res) {
  console.log("Req: ", req);
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { email } = req.query;

  try {
    const collection = client.db("moviesTvshows").collection("users");
    console.log("mongo collection: ", collection);

    const user = await collection.findOne({ email: email });
    console.log("user: ", user);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
