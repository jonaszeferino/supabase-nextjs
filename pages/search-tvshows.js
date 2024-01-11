import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";
import Image from "next/image";
import Head from "next/head";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Spinner,
  ChakraProvider,
  Center,
  Flex,
  Progress,
  Link as LinkChakra,
} from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import LoggedUser from "../components/LoggedUser";
import { Tooltip } from "antd";
import Link from "next/link";
import { Rate } from "antd";

export default function Discovery() {
  let [searchMovies, setSearchMovies] = useState([]);
  let [searchRatingSort, setSearchRatingSort] = useState("vote_average.desc");
  let [searchVoteCount, setSearchVoteCount] = useState(100);

  let [searchMovieTotalResults, setSearchMovieTotalResults] = useState("");
  let [searchMovieReleaseDateFrom, setSearchMovieReleaseDateFrom] =
    useState(1800);
  let [searchMovieReleaseDateTo, setSearchMovieReleaseDateTo] = useState(2023);

  //pagination
  let [searchMovieTotalPages, setSearchMovieTotalPages] = useState("");
  let [searchMovieRealPage, setSearchMovieRealPage] = useState("");
  let [page, setPage] = useState(1);

  let [isError, setError] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  let [searchTvType, setSearchTvType] = useState("");

  const { showBackToTopButton, scrollToTop } = useBackToTopButton(); // tranformado num hook

  let urlString =
    "https://api.themoviedb.org/3/discover/tv?&include_adult=false&include_video=false&vote_count.gte=" +
    searchVoteCount +
    "&vote_count.lte=10000000&sort_by=" +
    searchRatingSort +
    "&first_air_date.gte=" +
    (searchMovieReleaseDateFrom + 1) +
    "&first_air_date.lte=" +
    (searchMovieReleaseDateTo + 1);

  if (searchTvType !== "") {
    urlString += "&with_type=" + searchTvType;
  }

  const apiCall = (currentPage) => {
    if (currentPage === "" || isNaN(currentPage)) {
      currentPage = 1;
    } else {
      currentPage = parseInt(currentPage);
    }
    const url = urlString + "&page=" + currentPage;
    setIsLoading(true);

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
          throw new Error("Wrong Data");
        }
      })
      .then(
        (result) => (
          setSearchMovies(result.results),
          setSearchMovieTotalPages(result.total_pages),
          setSearchMovieRealPage(result.page),
          setSearchMovieTotalResults(result.total_results),
          setPage(result.page),
          setIsLoading(false)
        )
      )
      .catch((error) => setError(true));
  };

  const nextPage = (event) => {
    setPage(page + 1), apiCall(page + 1);
  };
  const previousPage = (event) => {
    setPage(page - 1), apiCall();
  };

  let totalPages = searchMovieTotalPages;
  let currentPage = searchMovieRealPage;
  let totalResults = searchMovieTotalResults;

  const handleFromChange = (event) => {
    setSearchMovieReleaseDateFrom(parseInt(event.target.value));
  };

  const handleToChange = (event) => {
    setSearchMovieReleaseDateTo(parseInt(event.target.value));
  };
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
      <Head>
        <title>Discover Tv Shows</title>
        <meta name="keywords" content="tvshow,watch,review"></meta>
        <meta name="description" content="movies, tvshows"></meta>
      </Head>

      <LoggedUser />
      <div className={styles.top}>
        <h3 className={styles.title}> Discover Tv Shows</h3>
      </div>
      <br />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ChakraProvider>
            <FormLabel htmlFor="orderby">Order By</FormLabel>
            <Select
              width="400px"
              value={searchRatingSort}
              onChange={(event) => setSearchRatingSort(event.target.value)}
            >
              <option value="vote_average.asc">
                From Worst Rating to Best
              </option>
              <option value="vote_average.desc">
                From Best Rating to Worst
              </option>
            </Select>

            <br />

            <FormLabel>Vote Number</FormLabel>
            <Select
              value={searchVoteCount}
              onChange={(event) => setSearchVoteCount(event.target.value)}
            >
              <option value="0">0 Votes</option>
              <option value="50">More than 50</option>
              <option value="100">More than 100</option>
              <option value="200">More than 200</option>
              <option value="500">More than 500</option>
              <option value="1000">More than 1000</option>
              <option value="5000">More than 5000</option>
            </Select>

            <br />

            <FormLabel>Tv Show Type</FormLabel>
            <Select
              value={searchTvType}
              onChange={(event) => setSearchTvType(event.target.value)}
            >
              <option value="">All</option>
              <option value="0">Documentary</option>
              <option value="1">News</option>
              <option value="2">Mini Series</option>
              <option value="3">Reality</option>
              <option value="4">Scripted</option>
              <option value="5">Talk Show</option>
              <option value="6">Videos</option>
            </Select>

            <br />

            <FormControl>
              <Center>
                <FormLabel>Initial and Final Year</FormLabel>
              </Center>
              <Flex align="center">
                <Select
                  value={searchMovieReleaseDateFrom}
                  onChange={handleFromChange}
                >
                  {Array.from({ length: 2025 - 1900 + 1 }, (_, index) => (
                    <option key={index} value={1900 + index}>
                      {1900 + index}
                    </option>
                  ))}
                </Select>
                <Box w="20px" />
                <Select
                  value={searchMovieReleaseDateTo}
                  onChange={handleToChange}
                >
                  {Array.from({ length: 2025 - 1900 + 1 }, (_, index) => (
                    <option key={index} value={1900 + index}>
                      {1900 + index}
                    </option>
                  ))}
                </Select>
              </Flex>
            </FormControl>

            <br />

            <Button size="lg" colorScheme="purple" onClick={apiCall}>
              Go
            </Button>
          </ChakraProvider>
          <br />
          <br />
        </div>
      </div>

      <ChakraProvider>{isLoading && <Spinner />}</ChakraProvider>

      {isError === true ? (
        <ErrorPage message={`Verify your credentials`}></ErrorPage>
      ) : (
        <div className={styles.grid}>
          {searchMovies.map((search) => (
            <div key={search.id}>
              <ChakraProvider>
                {/* <Link as={`/tvshow-page?tvShowId=${search.id}`}> */}

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
                        `https://image.tmdb.org/t/p/original${search.poster_path}` ||
                        `/callback.png`
                      }
                      alt="poster"
                      width={240}
                      height={360}
                    />
                  </Tooltip>
                </Link>
              </ChakraProvider>

              <div style={{ maxWidth: "240px", margin: "5px" }}>
                <ChakraProvider>
                  <Progress
                    size="lg"
                    value={search.vote_average}
                    max={10}
                    colorScheme={getProgressColor(search.vote_average)}
                  />
                  {search.vote_average} <Rate value={1} count={1} />
                </ChakraProvider>
                
              </div>
              <br />
            </div>
          ))}
        </div>
      )}

      {searchMovieTotalResults > 0 ? (
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
      ) : (
        ""
      )}

      {!totalResults ? (
        <span>
          {/* Escolha os filtros acima, e clique em Verificar para uma consulta de
            acordo com o seu desejo! */}
        </span>
      ) : (
        ""
      )}

      {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
    </>
  );
}
