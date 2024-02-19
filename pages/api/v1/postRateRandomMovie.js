import client from "../../../mongoConnection";
import moment from "moment-timezone";

export default async function handler(req, res) {
  console.log("call internal insert api")
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }
  const {
    movie_id,
    poster_path,
    original_title,
    vote_average_by_provider,
    rating_by_user,
    portuguese_title,
    user_email,
  } = req.body;

  console.log(req.body)

  let date = moment().tz("UTC-03:00").toDate();
  const collection = client.db("moviesSeriesLikes").collection("movieLikes");

  try {
    const result = await collection.insertOne({
      movie_id: movie_id ? movie_id : null,
      poster_path: poster_path ? poster_path : "/callback_gray.png",
      original_title: original_title ? original_title : null,
      portuguese_title: portuguese_title ? portuguese_title : null,
      vote_average_by_provider: vote_average_by_provider
        ? vote_average_by_provider
        : null,
      rating_by_user: rating_by_user ? rating_by_user : null,
      like_date: date ? date : null,
      user_email: user_email ? user_email : "movietoday@gmail.com",
    });

    console.log(result);
    res.status(200).json({ message: "Insert Like API", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
