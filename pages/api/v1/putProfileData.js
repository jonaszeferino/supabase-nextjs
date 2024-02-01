import client from "../../../mongoConnection";
import moment from "moment-timezone";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }
  const {
    email,
    name,
    surname,
    nationality,
    birth_date,
    gender,
    first_favorite_movie,
    second_favorite_movie,
    third_favorite_movie,
    favorite_movie_genre,
    first_favorite_tvshow,
    second_favorite_tvshow,
    third_favorite_tvshow,
    favorite_tvshow_genre,
    favorite_actor,
    favorite_actress,
    favorite_directing,
    avatar
  } = req.body;

  let date = moment().tz("UTC-03:00").toDate();
  const collection = client.db("moviesTvshows").collection("users");

  try {
    const filter = { email: email };
    const update = {
      $set: {
        email: email,
        name: name,
        surname: surname,
        nationality: nationality,
        birth_date: birth_date,
        gender: gender,
        first_favorite_movie: first_favorite_movie,
        second_favorite_movie: second_favorite_movie,
        third_favorite_movie: third_favorite_movie,
        favorite_movie_genre: favorite_movie_genre,
        first_favorite_tvshow: first_favorite_tvshow,
        second_favorite_tvshow: second_favorite_tvshow,
        third_favorite_tvshow: third_favorite_tvshow,
        favorite_tvshow_genre: favorite_tvshow_genre,
        favorite_actor: favorite_actor,
        favorite_actress: favorite_actress,
        updated_date: date ? date : null,
        favorite_directing: favorite_directing,
        avatar: avatar,
      },
    };
    const result = await collection.updateOne(filter, update, { upsert: true });

    if (result.matchedCount === 1 || result.upsertedCount === 1) {
      res.status(200).json({ message: "Sucess", result });
    } else {
      res.status(500).json({ message: "Fail, try again." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
