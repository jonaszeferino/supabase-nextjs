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
import LoggedUser from "../components/LoggedUser";

export default function Discovery() {
  const router = useRouter();
  const { query } = router.query;
  let [movieId, setMovieId] = useState();
  let [searchMovies, setSearchMovies] = useState([]);
  const [searchText, setSearchText] = useState(router.query.query || "");
  const { showBackToTopButton, scrollToTop } = useBackToTopButton();

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

  useEffect(() => {
    setSearchText(router.query.query || "");
  }, [router.query.query]);

  useEffect(() => {
    const apiCall = () => {
      setIsLoading(true);
      setError(false);

      const url = `https://api.themoviedb.org/3/search/multi?&query=${searchText}&include_adult=false&page=${page}`;

      fetch(url, {
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
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
          setSearchMovieRealPage(1);
          setSearchMovieTotalResults(result.total_results);

          setIsLoading(false);
        })
        .catch((error) => setError(true));
    };

    if (searchText) {
      apiCall();
    }
  }, [searchText,page]);

  const nextPage = () => {
    setPage((prevPage) => prevPage + 1);
    setSearchMovieRealPage((prevPage) => prevPage + 1);
  };

  const previousPage = () => {
    setPage((prevPage) => prevPage - 1);
    setSearchMovieRealPage((prevPage) => prevPage - 1);
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
        <title>Free Search</title>
        <meta
          name="keywords"
          content="movies,watch,review,series,filmes"
        ></meta>
        <meta name="description" content="encontre filmes e series"></meta>
      </Head>

      <br />
      <div>
        <LoggedUser />

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
                  Movies
                </Button>
              </Tooltip>

              <Tooltip label="Habilita/Desabilita Séries">
                <Button
                  colorScheme={showTvShows ? "green" : "gray"}
                  onClick={handleTvShowsClick}
                >
                  Tv Shows
                </Button>
              </Tooltip>

              <Tooltip label="Habilita/Desabilita Pessoas">
                <Button
                  colorScheme={showPerson ? "yellow" : "gray"}
                  onClick={handlePersonClick}
                >
                  Persons
                </Button>
              </Tooltip>
            </HStack>
          </Center>
          <Center>
            <Box>
              <br />

              <Text>
                Search Term <strong>{searchText}</strong>
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
                          src="/callback_gray.png"
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
                          src="/callback_gray.png"
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
                          src="/callback_gray.png"
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
                    Details
                  </Link>
                ) : null}

                {showMovies && search.media_type === "movie" ? (
                  <Link
                    href={{
                      pathname: "/movie-page",
                      query: { movieId: search.id },
                    }}
                  >
                    Details
                  </Link>
                ) : null}

                {showTvShows && search.media_type === "tv" ? (
                  <Link
                    href={{
                      pathname: "/tvshow-page",
                      query: { tvShowId: search.id },
                    }}
                  >
                    Details
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
            Back
          </button>
          <span className={styles.button}>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={page >= totalPages}
            className={styles.button}
          >
            Next
          </button>
          <br />
          <br />
          <span className={styles.spantext}>
            Total Results: {totalResults}
          </span>{" "}
        </span>
        {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
      </div>
    </>
  );
}
