import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { useRouter } from "next/router";
import TranslationComponent from "../components/translateComponent";
import TranslationComponentCountryName from "../components/translateComponentCountryName";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";


import {
  ChakraProvider,
  Progress,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

const MoviePage = () => {
  const router = useRouter();
  const { query } = router.query;
  const movieId = router.query.movieId;
  const [movieIdRequest, setMovieIdRequest] = useState();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { showBackToTopButton, scrollToTop } = useBackToTopButton(); 

  useEffect(() => {
    setMovieIdRequest(movieId);
    Promise.all([
      fetch(
        `https://api.themoviedb.org/3/movie/${movieIdRequest}?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c&language=pt-BR`
      ),
      fetch(
        `https://api.themoviedb.org/3/movie/${movieIdRequest}/watch/providers?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c`
      ),
      fetch(
        `https://api.themoviedb.org/3/movie/${movieIdRequest}/credits?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c&language=pt-BR`
      ),
    ])
      .then(([resMovie, resProviders, resCredits]) =>
        Promise.all([resMovie.json(), resProviders.json(), resCredits.json()])
      )
      .then(([dataMovies, dataProviders, resCredits]) => {
        if (!Array.isArray(resCredits.crew) || resCredits.crew.length === 0) {
          console.log("Erro: Dados de créditos inválidos");
          return;
        }

        const directors = resCredits.crew
          .filter((member) => member.job === "Director")
          .map((director) => {
            return {
              id: director.id,
              name: director.name,
            };
          });

        setData({
          directors: directors && directors.length > 0 ? directors : null,
          budget: dataMovies.budget,
          originalTitle: dataMovies.original_title,
          portugueseTitle: dataMovies.title,
          poster_path: dataMovies.poster_path,
          overview: dataMovies.overview,
          average: dataMovies.vote_average,
          releaseDate: dataMovies.release_date,
          image: dataMovies.poster_path,
          ratingCount: dataMovies.vote_count,
          popularity: dataMovies.popularity,
          gender: dataMovies.genres
            ? dataMovies.genres.map((genre) => genre.name).join(", ")
            : "",

          adult: dataMovies.adult,

          imdb: dataMovies.imdb_id,

          providersBR: dataProviders.results
            ? dataProviders.results.BR
              ? dataProviders.results.BR.flatrate
                ? dataProviders.results.BR.flatrate
                    .map((providerBR) => providerBR.provider_name)
                    .join(", ")
                : ""
              : ""
            : "",

          providersUS: dataProviders.results
            ? dataProviders.results.US
              ? dataProviders.results.US.flatrate
                ? dataProviders.results.US.flatrate
                    .map((providerUS) => providerUS.provider_name)
                    .join(", ")
                : ""
              : ""
            : "",

          country:
            dataMovies.production_countries &&
            dataMovies.production_countries[0]
              ? dataMovies.production_countries[0].name
              : "",

          originalLanguage: dataMovies.original_language,
        });
        setIsLoading(false);
      });
  }, [movieId, movieIdRequest]);

  if (isLoading) {
    return <p>Carregando dados...</p>;
  }

  let poster = "/callback.png";

  if (data.poster_path) {
    poster = "https://image.tmdb.org/t/p/original" + data.poster_path;
  }

  function getProgressColor(progressValue) {
    if (progressValue >= 0.1 && progressValue <= 3.999) {
      return "red";
    } else if (progressValue >= 4.0 && progressValue <= 5.999) {
      return "yellow";
    } else if (progressValue >= 6 && progressValue <= 7.999) {
      return "green";
    } else if (progressValue >= 8 && progressValue <= 10) {
      return "blue";
    } else {
      return "gray";
    }
  }

  return (
    <>
      {" "}
      <span className={styles.title}>{data.originalTitle}</span>
      <br />
      <br />
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>
        <ChakraProvider>
          <Progress
            hasStripe
            value={data.average}
            max={10}
            colorScheme={getProgressColor(data.average)}
          />
        </ChakraProvider>
      </div>
      <br />
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <span>
            <span>
              {poster != null ? (
                <img
                  className={styles.card_image_big}
                  src={poster}
                  alt="poster"
                  width="480"
                  height="720"
                  style={{
                    objectFit: "contain",
                    maxHeight: "100%",
                    maxWidth: "100%",
                  }}
                />
              ) : (
                <Image
                  className={styles.card_image_big}
                  src="/callback.png"
                  alt="poster"
                  width="480"
                  height="720"
                  style={{
                    objectFit: "contain",
                    maxHeight: "100%",
                    maxWidth: "100%",
                  }}
                />
              )}
            </span>
          </span>
        )}
      </div>
      {/* Tabela aqui para baixo */}
      <br />
      <div
        style={{ maxWidth: "480px", margin: "0 auto", wordBreak: "break-word" }}
      >
        <ChakraProvider>
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Título Em Português</Th>
                  <Td>{data.portugueseTitle}</Td>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Th>
                    {data.budget === 0 || data.budget === null
                      ? null
                      : `Orçamento:`}
                  </Th>
                  <Td>
                    {" "}
                    {data.budget === 0 || data.budget === null
                      ? null
                      : `${new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(data.budget)}`}
                  </Td>
                </Tr>

                <Tr>
                  <Th>Overview</Th>

                  <Td
                    style={{
                      maxWidth: "480px",
                      margin: "0 auto",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {data.overview ? data.overview : "Sem infos"}
                  </Td>
                </Tr>
                <Tr>
                  <Th>Direção</Th>
                  <Td>
                    {data.directors ? (
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {data.directors.map((director, index) => (
                          <li key={index}>
                            {director.name}{" "}
                            <Link
                              href={{
                                pathname: "/person-page",
                                query: { personId: director.id },
                              }}
                            >
                              <a style={{ color: "blue" }}>Ver trabalhos</a>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "Sem informações"
                    )}
                  </Td>
                </Tr>

                <Tr>
                  <Th>Número de votos</Th>
                  <Td>{data.ratingCount}</Td>
                </Tr>
                <Tr>
                  <Th>Nota</Th>
                  <Td>{data.average}</Td>
                </Tr>

                <Tr>
                  <Th>IMDB</Th>
                  <Td>https://www.imdb.com/title/{data.imdb}</Td>
                </Tr>
                <Tr>
                  <Th>País de Origem</Th>
                  <Td>
                    <TranslationComponentCountryName
                      text={data.country}
                      language="pt"
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Th>Idioma</Th>
                  <Td>
                    <TranslationComponent
                      text={data.originalLanguage}
                      language="pt"
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Th>Data de Lançamento</Th>
                  <Td>
                    {data.releaseDate
                      ? format(new Date(data.releaseDate), " dd/MM/yyyy")
                      : ""}
                  </Td>
                </Tr>
                <Tr>
                  <Th>Popularidade</Th>
                  <Td>{data.popularity}</Td>
                </Tr>
                <Tr>
                  <Th>Generos</Th>
                  <Td>{data.gender}</Td>
                </Tr>
                <Tr>
                  <Th>Streamings Brasil</Th>
                  <Td>{data.providersBR}</Td>
                </Tr>

                <Tr>
                  <Th>Streamings EUA</Th>
                  <Td>{data.providersUS}</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </ChakraProvider>
        <div />
        {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}

      </div>
    </>
  );
};

export default MoviePage;
