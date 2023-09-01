import client from "../../../mongoConnection";
import moment from "moment-timezone";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const {
    movie_id,
    rating_by_user,
    user_email,
  } = req.body;

  let date = moment().tz("UTC-03:00").toDate();
  const collection = client.db("moviesSeriesLikes").collection("movieLikes");

  try {
    const filter = { movie_id: movie_id, user_email: user_email };
    const update = {
      $set: {
        update_date: date ? date : null,
        rating_by_user: rating_by_user ? rating_by_user : 0,
      },
    };

    const result = await collection.updateOne(filter, update);

    if (result.matchedCount === 1) {
      res.status(200).json({ message: "Update successful", result });
    } else {
      res.status(404).json({ message: "No matching document found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
