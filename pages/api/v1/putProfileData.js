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
    favorite_movie_gender,
    first_favorite_tvshow,
    second_favorite_tvshow,
    third_favorite_tvshow,
    favorite_tvshow_gender,
    favorite_actor,
    favorite_actress,
  } = req.body;

  let date = moment().tz("UTC-03:00").toDate();
  const collection = client.db("moviesTvshows").collection("users");

  try {
    const filter = { email: email }; // Use o campo de email como filtro
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
        favorite_movie_gender: favorite_movie_gender,
        first_favorite_tvshow: first_favorite_tvshow,
        second_favorite_tvshow: second_favorite_tvshow,
        third_favorite_tvshow: third_favorite_tvshow,
        favorite_tvshow_gender: favorite_tvshow_gender,
        favorite_actor: favorite_actor,
        favorite_actress: favorite_actress,
        update_date: date ? date : null,
         
      },
    };

    const result = await collection.updateOne(filter, update, { upsert: true });

    if (result.matchedCount === 1 || result.upsertedCount === 1) {
      res.status(200).json({ message: "Update successful", result });
    } else {
      res.status(500).json({ message: "Failed to update or insert" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
