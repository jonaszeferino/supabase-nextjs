import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";
import Image from "next/image";
import Head from "next/head";
import {
  Box,
  Button,
  Input,
  Spinner,
  Text,
  ChakraProvider,
  Center,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import TranslateProfile from "../components/TranslateProfile";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";


export default function Discovery() {
  const router = useRouter();
  const { query } = router.query;

  let [movieId, setMovieId] = useState();
  let [searchMovies, setSearchMovies] = useState([]);
  let [searchText, setSearchText] = useState(query || "");
  const { showBackToTopButton, scrollToTop } = useBackToTopButton(); 

  console.log(query);

  //paginação
  let [page, setPage] = useState(1);
  let [searchMovieTotalPages, setSearchMovieTotalPages] = useState("");
  let [searchMovieRealPage, setSearchMovieRealPage] = useState(1);
  let [searchMovieTotalResults, setSearchMovieTotalResults] = useState("");
  // erro e loading
  let [isError, setError] = useState(false);
  let [isLoading, setIsLoading] = useState(false);

  //mostragem de filtros
  let [showMovies, setShowMovies] = useState(true);
  let [showTvShows, setShowTvShows] = useState(true);
  let [showPerson, setShowPerson] = useState(true);

  console.log(showMovies);
  console.log(showTvShows);
  console.log(showPerson);

  useEffect(() => {
    setSearchText(query || "");
  }, [query]);

  useEffect(() => {
    if (searchText) {
      apiCall(page);
    }
  }, [searchText, page]);

  const apiCall = (currentPage) => {
    setIsLoading(true);
    setError(false);

    const url = `https://api.themoviedb.org/3/search/multi?api_key=dd10bb2fbc12dfb629a0cbaa3f47810c&language=pt-BR&query=${searchText}&include_adult=false&page=${currentPage}`;

    fetch(url, {
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          setError(false);
          return response.json();
        } else {
          throw new Error("Dados Incorretos");
        }
      })
      .then((result) => {
        setSearchMovies(result.results);
        setSearchMovieTotalPages(result.total_pages);
        setSearchMovieRealPage(result.page);
        setSearchMovieTotalResults(result.total_results);
        setPage(result.page);
        setIsLoading(false);
      })
      .catch((error) => setError(true));
  };

  const nextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const previousPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  let totalPages = searchMovieTotalPages;
  let currentPage = searchMovieRealPage;
  let totalResults = searchMovieTotalResults;

  const handleMoviesClick = () => {
    setShowMovies(!showMovies); // Inverte o valor do estado showMovies
  };

  const handleTvShowsClick = () => {
    setShowTvShows(!showTvShows); // Inverte o valor do estado showTvShows
  };

  const handlePersonClick = () => {
    setShowPerson(!showPerson); // Inverte o valor do estado showPerson
  };

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="keywords" content="movies,watch,review"></meta>
        <meta name="description" content="encontre tudo de nba aqui"></meta>
      </Head>

      <br />
      <div>
        <div className={styles.top}>
          <h3 className={styles.title}> Busca Livre</h3>
        </div>
        <br />
        <ChakraProvider>
          <Center>
            <HStack spacing={6}>
              <Tooltip label="Habilita/Desabilita Filmes">
                <Button
                  colorScheme={showMovies ? "blue" : "gray"}
                  onClick={handleMoviesClick}
                >
                  Filmes
                </Button>
              </Tooltip>

              <Tooltip label="Habilita/Desabilita Séries">
                <Button
                  colorScheme={showTvShows ? "green" : "gray"}
                  onClick={handleTvShowsClick}
                >
                  Séries
                </Button>
              </Tooltip>

              <Tooltip label="Habilita/Desabilita Pessoas">
                <Button
                  colorScheme={showPerson ? "yellow" : "gray"}
                  onClick={handlePersonClick}
                >
                  Pessoas
                </Button>
              </Tooltip>
            </HStack>
          </Center>
          <Center>
            <Box>
              <br />

              <Text>
                Termo de Busca: <strong>{searchText}</strong>
              </Text>
              <br />

              <Box>
                <Text className={styles.spantext}>
                  {isLoading ? <Spinner /> : " "}
                </Text>
              </Box>
            </Box>
          </Center>
        </ChakraProvider>

        {isError === true ? (
          <ErrorPage message={`Verifique as Credenciais`}></ErrorPage>
        ) : (
          <div className={styles.grid}>
            {searchMovies.map((search) => (
              <div key={search.id}>
                <span className={styles.spantext}>
                  {showPerson && search.media_type === "person" ? (
                    <span></span>
                  ) : (
                    <span></span>
                  )}
                  {search.media_type === "person" && showPerson
                    ? search.name
                    : search.media_type === "movie" && showMovies
                    ? search.title
                    : search.media_type === "tv" && showTvShows
                    ? search.name
                    : ""}
                </span>
                <br />
                {showPerson && search.media_type === "person" ? (
                  <span>
                    Posição:{" "}
                    <TranslateProfile
                      text={search.known_for_department}
                      language={"pt"}
                    />
                  </span>
                ) : null}
                <br />
                {showTvShows && search.media_type == "tv" ? (
                  <span className={styles.spantext}>
                    {search.poster_path != null ? (
                      <span className={styles.spantext}>
                        <Image
                          className={styles.card_image}
                          src={
                            "https://image.tmdb.org/t/p/original" +
                            search.poster_path
                          }
                          alt="poster"
                          width="240"
                          height="360"
                        />{" "}
                      </span>
                    ) : (
                      <span className={styles.spantext}>
                        <Image
                          className={styles.card_image}
                          src="/callback.png"
                          alt="poster"
                          width="240"
                          height="360"
                        />
                      </span>
                    )}
                    <br />
                  </span>
                ) : null}

                {showMovies && search.media_type == "movie" ? (
                  <span className={styles.spantext}>
                    {search.poster_path != null ? (
                      <span className={styles.spantext}>
                        <Image
                          className={styles.card_image}
                          src={
                            "https://image.tmdb.org/t/p/original" +
                            search.poster_path
                          }
                          alt="poster"
                          width="240"
                          height="360"
                        />{" "}
                      </span>
                    ) : (
                      <span className={styles.spantext}>
                        <Image
                          className={styles.card_image}
                          src="/callback.png"
                          alt="poster"
                          width="240"
                          height="360"
                        />
                      </span>
                    )}
                    <br />
                  </span>
                ) : null}

                {showPerson && search.media_type === "person" ? (
                  <span className={styles.spantext}>
                    {search.profile_path != null ? (
                      <span className={styles.spantext}>
                        <Image
                          className={styles.card_image}
                          src={
                            "https://image.tmdb.org/t/p/original" +
                            search.profile_path
                          }
                          alt="poster"
                          width="240"
                          height="360"
                        />{" "}
                      </span>
                    ) : (
                      <span className={styles.spantext}>
                        <Image
                          className={styles.card_image}
                          src="/callback.png"
                          alt="poster"
                          width="240"
                          height="360"
                        />
                      </span>
                    )}
                    <br />
                  </span>
                ) : null}

                {showPerson && search.media_type === "person" ? (
                  <Link
                    href={{
                      pathname: "/person-page",
                      query: { personId: search.id },
                    }}
                  >
                    <a className={styles.button}>Detalhes</a>
                  </Link>
                ) : null}

                {showMovies && search.media_type === "movie" ? (
                  <Link
                    href={{
                      pathname: "/movie-page",
                      query: { movieId: search.id },
                    }}
                  >
                    <a className={styles.button}>Detalhes</a>
                  </Link>
                ) : null}

                {showTvShows && search.media_type === "tv" ? (
                  <Link
                    href={{
                      pathname: "/tvshow-page",
                      query: { tvShowId: search.id },
                    }}
                  >
                    <a className={styles.button}>Detalhes</a>
                  </Link>
                ) : null}

                <br />
                <br />
              </div>
            ))}
          </div>
        )}

        <span className={styles.spantext}>
          <br />
        </span>

        <span>
          <button
            onClick={previousPage}
            disabled={page <= 1}
            className={styles.button}
          >
            Anterior
          </button>
          <span className={styles.button}>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={page >= totalPages}
            className={styles.button}
          >
            Próxima
          </button>
          <br />
          <br />
          <span className={styles.spantext}>
            Total Resultados: {totalResults}
          </span>{" "}
        </span>
        {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}

      </div>
    </>
  );
}
