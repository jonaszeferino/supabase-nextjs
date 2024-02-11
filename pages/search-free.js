import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import {
  Box,
  Button,
  Spinner,
  Text,
  ChakraProvider,
  Center,
  HStack,
  Tooltip,
  Image,
  useMediaQuery
} from "@chakra-ui/react";
import PageTitle from "../components/PageTitle";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";


export default function Discovery() {
  const router = useRouter();
  const { query } = router.query;
  const [isMobile] = useMediaQuery('(max-width: 768px)');

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
          setSearchMovieRealPage(page);
          setSearchMovieTotalResults(result.total_results);
          setIsLoading(false);
        })
        .catch((error) => setError(true));
    };

    if (searchText) {
      apiCall();
    }
  }, [searchText, page]);

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
    setShowMovies(!showMovies);
  };

  const handleTvShowsClick = () => {
    setShowTvShows(!showTvShows);
  };

  const handlePersonClick = () => {
    setShowPerson(!showPerson);
  };

  return (
    <>
      <Head>
        <title>Free Search</title>
        <meta
          name="keywords"
          content="movies,watch,review,series,filmes"
        ></meta>
        <meta name="description" content="find movies, tvshows, persons"></meta>
      </Head>

      <br />
      <div>

        <PageTitle
          title="Search Free"
          isMobile={isMobile}
          showLoggedUser={true}
        />


        <br />
        <ChakraProvider>
          <Center>
            <HStack spacing={6}>
              <Tooltip label="Enabel/Disable Movies">
                <Button
                  colorScheme={showMovies ? "blue" : "gray"}
                  onClick={handleMoviesClick}
                >
                  Movies
                </Button>
              </Tooltip>

              <Tooltip label="Enable/Disable TvShows">
                <Button
                  colorScheme={showTvShows ? "green" : "gray"}
                  onClick={handleTvShowsClick}
                >
                  Tv Shows
                </Button>
              </Tooltip>

              <Tooltip label="Enable/Disable People">
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

        <div className={styles.grid}>
          {searchMovies.map((search) => (
            <div key={search.id}>
              {showPerson || showMovies || showTvShows ? (
                <ChakraProvider>




                  <Text style={{ maxWidth: "768px" }}>
                    {search.media_type === "person" && showPerson
                      ? search.name
                      : null}
                    {search.media_type === "movie" && showMovies
                      ? search.title
                      : null}
                    {search.media_type === "tv" && showTvShows
                      ? search.name
                      : null}
                  </Text>


                  <Text style={{ maxWidth: "768px" }}>
                    {search.media_type === "person" && showPerson
                      ? search.known_for_department
                      : null}
                    {search.media_type === "movie" && showMovies
                      ? "Movie"
                      : null}
                    {search.media_type === "tv" && showTvShows
                      ? "TvShow"
                      : null}
                  </Text>




                </ChakraProvider>
              ) : null}

              {showTvShows && search.media_type == "tv" ? (
                <ChakraProvider>
                  <Link
                    href={{
                      pathname: "/tvshow-page",
                      query: { tvShowId: search.id },
                    }}
                  >
                    <Tooltip
                      title="More"
                      style={{
                        color: "white",
                        borderColor: "purple",
                        background: "purple",
                      }}
                    >
                      <Image
                        className={styles.card_image}
                        src={
                          search.poster_path
                            ? `https://image.tmdb.org/t/p/original${search.poster_path}`
                            : "/callback.png"
                        }
                        alt="poster"
                        width={240}
                        height={360}
                      />
                    </Tooltip>
                  </Link>
                </ChakraProvider>
              ) : null}

              {showMovies && search.media_type == "movie" ? (
                <ChakraProvider>
                  <Link
                    href={{
                      pathname: "/movie-page",
                      query: { movieId: search.id },
                    }}
                  >
                    <Tooltip
                      title="More"
                      style={{
                        color: "white",
                        borderColor: "purple",
                        background: "purple",
                      }}
                    >
                      <Image
                        className={styles.card_image}
                        src={
                          search.poster_path
                            ? `https://image.tmdb.org/t/p/original${search.poster_path}`
                            : "/callback.png"
                        }
                        alt="poster"
                        width={240}
                        height={360}
                      />
                    </Tooltip>
                  </Link>
                </ChakraProvider>
              ) : null}

              {showPerson && search.media_type === "person" ? (
                <ChakraProvider>
                  <Link
                    href={{
                      pathname: "/person-page",
                      query: { personId: search.id },
                    }}
                  >
                    <Tooltip
                      title="More"
                      style={{
                        color: "white",
                        borderColor: "purple",
                        background: "purple",
                      }}
                    >
                      <Image
                        className={styles.card_image}
                        src={
                          search.profile_path
                            ? `https://image.tmdb.org/t/p/original${search.profile_path}`
                            : "/callback.png"
                        }
                        alt="poster"
                        width={240}
                        height={360}
                      />
                    </Tooltip>
                  </Link>
                </ChakraProvider>
              ) : null}

              <br />
              <br />
            </div>
          ))}
        </div>

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
