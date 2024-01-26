import React, { useEffect, useState } from "react";
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
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import LoggedUser from "../components/LoggedUser";
import { Tooltip } from "antd";
import Link from "next/link";
import { Rate } from "antd";

export default function Discovery() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  

  const [searchFilters, setSearchFilters] = useState({
    voteCount: "5000", 
    ratingSort: "vote_average.desc",
    releaseDateFrom: 1900,
    releaseDateTo: 2024,
    tvShowCategory: "NOTHING",
    tvType: "",
  });

  const {
    voteCount,
    ratingSort,
    releaseDateFrom,
    releaseDateTo,
    tvShowCategory,
    tvType,
  } = searchFilters;

  const [searchMovies, setSearchMovies] = useState([]);
  const [searchMovieTotalResults, setSearchMovieTotalResults] = useState("");
  const [genres, setGenres] = useState([]);
  
  //pagination
  const [searchMovieTotalPages, setSearchMovieTotalPages] = useState("");
  const [searchMovieRealPage, setSearchMovieRealPage] = useState("");
  const [page, setPage] = useState(1);
  const [isError, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // back to the top button
  const { showBackToTopButton, scrollToTop } = useBackToTopButton();

  useEffect(() => {
    apiCall();
  }, []);

  let urlString =
    "https://api.themoviedb.org/3/discover/tv?&include_adult=false&include_video=false&vote_count.gte=" +
    searchFilters.voteCount +
    "&vote_count.lte=10000000&sort_by=" +
    searchFilters.ratingSort +
    "&first_air_date.gte=" +
    (searchFilters.releaseDateFrom + 1) +
    "&first_air_date.lte=" +
    (searchFilters.releaseDateTo + 1) +
    "&with_genres=" +
    searchFilters.tvShowCategory;

  if (searchFilters.tvType !== "") {
    urlString += "&with_type=" + searchFilters.tvType;
  }

  const apiCall = (currentPage) => {
    if (currentPage === "" || isNaN(currentPage)) {
      currentPage = 1;
    } else {
      currentPage = parseInt(currentPage);
    }
    const url = urlString + "&page=" + currentPage;
    console.log('o que chama: ',url)
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

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/genre/tv/list",
          {
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
            }),
          }
        );
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

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
            <Button ref={btnRef} colorScheme="purple" onClick={onOpen}>
              Filters
            </Button>
            <Drawer
              isOpen={isOpen}
              placement="right"
              onClose={onClose}
              finalFocusRef={btnRef}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Select Filters</DrawerHeader>

                <DrawerBody>
                  <FormLabel htmlFor="orderby">Order By</FormLabel>
                  <Select
                    id="ordenation"
                    placeholder="Ordenation"
                    type="text"
                    isRequired={true}
                    value={searchFilters.ratingSort}
                    onChange={(event) =>
                      setSearchFilters({
                        ...searchFilters,
                        ratingSort: event.target.value,
                      })
                    }
                  >
                    <option value="vote_average.asc">
                      From Worst Rating to Best
                    </option>
                    <option value="vote_average.desc">
                      From Best Rating to Worst
                    </option>
                  </Select>

                  <br />

                  <FormLabel>Minimum Vote Count</FormLabel>

                  <Select
                    id="votes"
                    placeholder="Number of Votes"
                    type="number"
                    isRequired={true}
                    value={searchFilters.voteCount}
                    onChange={(event) =>
                      setSearchFilters({
                        ...searchFilters,
                        voteCount: event.target.value,
                      })
                    }
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
                    value={searchFilters.tvType}
                    onChange={(event) =>
                      setSearchFilters({
                        ...searchFilters,
                        tvType: event.target.value,
                      })
                    }
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
                        value={searchFilters.releaseDateFrom}
                        onChange={(event) =>
                          setSearchFilters({
                            ...searchFilters,
                            releaseDateFrom: event.target.value,
                          })
                        }
                      >
                        {Array.from({ length: 2025 - 1900 + 1 }, (_, index) => (
                          <option key={index} value={1900 + index}>
                            {1900 + index}
                          </option>
                        ))}
                      </Select>
                      <Box w="20px" />
                      <Select
                        value={searchFilters.releaseDateTo}
                        onChange={(event) =>
                          setSearchFilters({
                            ...searchFilters,
                            releaseDateTo: event.target.value,
                          })
                        }
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

                  <FormLabel htmlFor="movieCategory">
                    Tv Show Category
                  </FormLabel>
                  <Select
                    id="movieCategory"
                    placeholder="Select Category"
                    value={searchFilters.tvShowCategory}
                    onChange={(event) =>
                      setSearchFilters({
                        ...searchFilters,
                        tvShowCategory: event.target.value,
                      })
                    }
                  >
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </Select>
                  <br />
                  <Center>
                    <Button size="lg" colorScheme="purple" onClick={apiCall}>
                      Go
                    </Button>
                  </Center>
                </DrawerBody>

                <DrawerFooter>
                  {/* <Button variant="outline" mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button variant="outline" onClick={apiCall}>
                    Go
                  </Button> */}
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
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
                        search.poster_path
                          ? `https://image.tmdb.org/t/p/original${search.poster_path}`
                          : `/callback.png`
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
