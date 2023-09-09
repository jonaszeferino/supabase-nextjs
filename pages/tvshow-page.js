import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { format } from "date-fns";
import { useRouter } from "next/router";
import {
  ChakraProvider,
  Progress,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";

const MoviePage = () => {
  const router = useRouter();
  const tvShowId = router.query.tvShowId;
  const [movieIdRequest, setMovieIdRequest] = useState();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [dataTvShows, setDataTvShows] = useState({});
  const [error, setError] = useState("");
  const [status, setStatus] = useState();
  const [showStatus, setShowStatus] = useState(false);
  const [tvShowSeasonId, setTvShowSeasonId] = useState();
  const { showBackToTopButton, scrollToTop } = useBackToTopButton();

  useEffect(() => {
    let showId;
    setMovieIdRequest(tvShowId);
    Promise.all([
      fetch(
        `https://api.themoviedb.org/3/tv/${tvShowId}?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c&language=pt-BR`
      ),
      fetch(
        `https://api.themoviedb.org/3/tv/${tvShowId}/watch/providers?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c`
      ),
    ])
      .then(([resMovie, resProviders]) =>
        Promise.all([resMovie.json(), resProviders.json()])
      )
      .then(([dataMovies, dataProviders]) => {
        setData({
          firstEpisodeToAir: dataMovies.first_air_date,
          tvShowName: dataMovies.name,
          poster_path: dataMovies.poster_path,
          overview: dataMovies.overview,
          average: dataMovies.vote_average,
          releaseDate: dataMovies.release_date,
          image: dataMovies.poster_path,
          ratingCount: dataMovies.vote_count,
          popularity: dataMovies.popularity,
          originalTitle: dataMovies.original_name,
          portugueseTitle: dataMovies.name,
          gender: dataMovies.genres
            ? dataMovies.genres.map((genre) => genre.name).join(", ")
            : "",
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
        });
        setIsLoading(false);
      });
  }, [tvShowId, movieIdRequest]);

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

  const CallDataTvShows = () => {
    setShowStatus(true);
    if (!tvShowId) {
      return;
    }
    const url = `https://api.themoviedb.org/3/tv/${tvShowId}?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c&language=pt-BR`;

    console.log(tvShowId);
    console.log(url);

    fetch(url, {})
      .then((response) => {
        if (response.status === 200) {
          setError(false);
          return response.json();
        } else {
          setError(true);
          throw console.log("Erro 1");
        }
      })
      .then((result) => {
        const { seasons, created_by } = result;
        setDataTvShows({ seasons, created_by });
        setStatus(result.status);
        setTvShowSeasonId(result.season_number);
      })
      .catch((error) => setError(true));
  };

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
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={styles.card_image_big}
                  src={poster}
                  alt="poster"
                  width="480"
                  height="720"
                />
              ) : (
                <Image
                  className={styles.card_image_big}
                  src="/callback.png"
                  alt="poster"
                  width="480"
                  height="720"
                />
              )}
            </span>
          </span>
        )}
      </div>
      <div>
        <br />

        {/* Tabela aqui para baixo */}
        <div
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            wordBreak: "break-word",
          }}
        >
          <ChakraProvider>
            <TableContainer>
              <Table size="sm">
                <Tbody>
                  <Tr>
                    <Td>Título em Português:</Td>
                    <Td>{data.portugueseTitle}</Td>
                  </Tr>
                  <Tr>
                    <Td>Overview:</Td>
                    <Td>{data.overview ? data.overview : "Sem infos"}</Td>
                  </Tr>
                  <Tr>
                    <Td>Gêneros:</Td>
                    <Td>{data.gender === "Soap" ? "Novela" : data.gender}</Td>
                  </Tr>
                  <Tr>
                    <Td>Nº de votos:</Td>
                    <Td>{data.ratingCount}</Td>
                  </Tr>
                  <Tr>
                    <Td>Nota:</Td>
                    <Td>{data.average}</Td>
                  </Tr>
                  <Tr>
                    <Td>Popularidade:</Td>
                    <Td>{data.popularity}</Td>
                  </Tr>
                  <Tr>
                    <Td>Primeiro Episódio no Ar:</Td>
                    <Td>
                      {data.firstEpisodeToAir
                        ? format(new Date(data.firstEpisodeToAir), "dd/MM/yyyy")
                        : ""}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Streamings Brasil:</Td>
                    <Td>{data.providersBR}</Td>
                  </Tr>
                  <Tr>
                    <Td>Streamings EUA:</Td>
                    <Td>{data.providersUS}</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </ChakraProvider>
          <br />

          <button onClick={CallDataTvShows} className={styles.button}>
            Temporadas
          </button>
          <br />
        </div>
      </div>
      <br />
      {showStatus ? (
        <span>
          Status da Serie:{" "}
          {status === "Returning Series"
            ? "Em andamento"
            : status === "Ended"
            ? "Encerrada"
            : status === "In Production"
            ? "Em produção"
            : status === "Canceled"
            ? "Cancelada"
            : status === "Pilot"
            ? "Em fase piloto"
            : status === "To Be Determined"
            ? "A ser determinado"
            : "Desconhecido"}
        </span>
      ) : null}
      <ChakraProvider>
        <div className={styles.grid}>
          {dataTvShows.seasons &&
            dataTvShows.seasons.map(
              (work) =>
                work.season_number !== 0 ? (
                  <div key={work.id} className={styles.gridItem}>
                    <br />
                    <span>
                      T{work.season_number} - Nome: {work.name}
                    </span>
                    <br />
                    <span>Nº de Episódios: {work.episode_count}</span>
                    <br />
                    <br />
                    <img
                      className={styles.card_image}
                      src={
                        work.poster_path
                          ? "https://image.tmdb.org/t/p/original" +
                            work.poster_path
                          : "/callback.png"
                      }
                      alt="poster"
                      width="240"
                      height="360"
                    />
                    <br />
                    <div>
                      <Link
                        href={{
                          pathname: "/tvshow-seasons-page",
                          query: {
                            tvShowId: tvShowId,
                            tvShowSeasonId: work.season_number,
                          },
                        }}
                      >
                        <a className={styles.button}>Episódios</a>
                      </Link>
                      <br />
                    </div>
                  </div>
                ) : null // Renderiza nulo se season_number for igual a 0
            )}
        </div>
        {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
      </ChakraProvider>
    </>
  );
};

export default MoviePage;
