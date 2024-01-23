import client from "../../../mongoConnection";

export default async function handler(req, res) {
  console.log("Call Api delete: ")
  if (req.method !== "DELETE") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const {
    movie_id,
    user_mail,
  } = req.body;

  const collection = client.db("moviesSeriesLikes").collection("movieLikes");

  try {
    const filter = { movie_id: movie_id, user_mail: user_mail };

    const result = await collection.deleteOne(filter);

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Delete successful" });
    } else {
      res.status(404).json({ message: "No matching document found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
