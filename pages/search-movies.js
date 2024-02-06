import React, { useEffect, useState, useRef } from "react";

import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";
import Image from "next/image";
import Head from "next/head";
import {
  ChakraProvider,
  Progress,
  Select,
  FormLabel,
  Button,
  FormControl,
  Flex,
  Box,
  Center,
  Link as LinkChakra,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Tag,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import LoggedUser from "../components/LoggedUser";
import { Tooltip } from "antd";
import Link from "next/link";
import { Rate } from "antd";
import { useRouter } from "next/router";

export default function Discovery() {
  let [searchMovies, setSearchMovies] = useState([]);
  //paginação
  let [page, setPage] = useState(1);
  let [searchMovieTotalPages, setSearchMovieTotalPages] = useState("");
  let [searchMovieRealPage, setSearchMovieRealPage] = useState("");
  let [searchMovieTotalResults, setSearchMovieTotalResults] = useState("");
  // erro e loading
  let [isError, setError] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  const { showBackToTopButton, scrollToTop } = useBackToTopButton();
  // estado pra amarzenar os filtros utilizados
  const btnRef = useRef();
  const [genres, setGenres] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [searchFilters, setSearchFilters] = useState({
    voteCount: 5000,
    ratingSort: "vote_average.desc",
    releaseDateFrom: 1900,
    releaseDateTo: 2025,
    with_origin_country: "All",
    category: "All",
  });

  let urlString =
    `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US` +
    `&primary_release_date.gte=` +
    searchFilters.releaseDateFrom +
    `-01-01` +
    `&primary_release_date.lte=` +
    searchFilters.releaseDateTo +
    `-12-31` +
    `&sort_by=` +
    searchFilters.ratingSort +
    `&vote_count.gte=` +
    searchFilters.voteCount;

  if (searchFilters.with_origin_country !== "All") {
    urlString += "&with_origin_country=" + searchFilters.with_origin_country;
  }

  if (searchFilters.category !== "All") {
    urlString += "&with_genres=" + searchFilters.category;
  }

  console.log("UrlString: ", urlString);

  const apiCall = (currentPage) => {
    const url = urlString + "&page=" + currentPage;
    console.log("Chamada: ", url);
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
          throw new Error("Dados Incorretos");
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
    setPage(page - 1), apiCall(page - 1);
  };

  useEffect(() => {
    apiCall(page);
  }, [page]);

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

  const options = [{ value: "AL", label: "Albania" }];

  function generateOptions(startYear, endYear) {
    return Array.from({ length: endYear - startYear + 1 }, (_, index) => (
      <option key={index} value={startYear + index}>
        {startYear + index}
      </option>
    ));
  }

  const optionsFrom = generateOptions(1900, 2023);
  const optionsTo = generateOptions(1901, 2025);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/genre/list",
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

  const selectedFiltersTags = [
    {
      label: `Vote: +${searchFilters.voteCount}`,
      colorScheme: "blue",
    },
    {
      label: `Order: ${
        searchFilters.ratingSort === "vote_average.desc" ? "Desc" : "Asc"
      }`,
      colorScheme: "green",
    },
    {
      label: `Year: ${searchFilters.releaseDateFrom}-${searchFilters.releaseDateTo}`,
      colorScheme: "red",
    },
    {
      label: `Country: ${searchFilters.with_origin_country}`,
      colorScheme: "yellow",
    },
    {
      label: `Category: ${
        genres.find(
          (genre) => genre.id === parseInt(searchFilters.category, 10)
        )?.name || "All"
      }`,
      colorScheme: "gray",
    },
  ];

  return (
    <>
      <Head>
        <title>Discover Movies</title>
        <meta name="keywords" content="movies,filmes,watch,review"></meta>
        <meta name="description" content="encontre tudo"></meta>
      </Head>
      <div>
        <LoggedUser />
        <div className={styles.top}>
          <h3 className={styles.title}>Discover Movies</h3>
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
                Select Filters
              </Button>
              <br />
              <HStack>
                {selectedFiltersTags.map((tag, index) => (
                  <Tag key={index} colorScheme={tag.colorScheme}>
                    {tag.label}
                  </Tag>
                ))}
              </HStack>

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
                    <FormLabel htmlFor="ordenation">Order By</FormLabel>
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

                    <FormControl>
                      <Center>
                        <FormLabel>Initial and Final Year:</FormLabel>
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
                          {optionsFrom}
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
                          {optionsTo}
                        </Select>
                      </Flex>
                    </FormControl>

                    <br />

                    <FormLabel htmlFor="origin_country">
                      Country of Origin
                    </FormLabel>

                    <Select
                      id="origin_country"
                      placeholder="Select Country"
                      value={searchFilters.with_origin_country}
                      onChange={(event) =>
                        setSearchFilters({
                          ...searchFilters,
                          with_origin_country: event.target.value,
                        })
                      }
                    >
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>

                    <br />

                    <FormLabel htmlFor="movieCategory">
                      Movie Category
                    </FormLabel>
                    <Select
                      id="movieCategory"
                      placeholder="Select Category"
                      value={searchFilters.category}
                      onChange={(event) =>
                        setSearchFilters({
                          ...searchFilters,
                          category: event.target.value,
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
                      <Button
                        size="lg"
                        colorScheme="purple"
                        onClick={() => apiCall(page)}
                      >
                        Go
                      </Button>
                    </Center>
                  </DrawerBody>

                  <DrawerFooter></DrawerFooter>
                </DrawerContent>
              </Drawer>
            </ChakraProvider>
          </div>
        </div>
        <br />
        <ChakraProvider>{isLoading && <Spinner />}</ChakraProvider>

        <br />

        {!searchMovies ? (
          <div>
            <button
              onClick={previousPage}
              disabled={page <= 1}
              className={styles.card}
            >
              Back
            </button>
            <button
              onClick={nextPage}
              disabled={page >= totalPages}
              className={styles.card}
            >
              Next
            </button>
          </div>
        ) : (
          ""
        )}
        <span className={styles.spantext}>
          {isLoading ? (
            <ChakraProvider>
              <Progress size="xs" isIndeterminate />{" "}
            </ChakraProvider>
          ) : null}
        </span>
        {isError === true ? (
          <ErrorPage message={`Verifique as Credenciais`}></ErrorPage>
        ) : (
          <div className={styles.grid}>
            {searchMovies.map((search) => (
              <div key={search.id} style={{ marginBottom: "10px" }}>
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

                <div style={{ maxWidth: "240px", margin: "10px" }}>
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

        <span className={styles.spantext}>
          {!searchMovies ? (
            <div>
              <button
                onClick={previousPage}
                disabled={page <= 1}
                className={styles.card}
              >
                Back
              </button>
              <button
                onClick={nextPage}
                disabled={page >= totalPages}
                className={styles.card}
              >
                Next
              </button>
            </div>
          ) : (
            ""
          )}
          <br />
          {!searchMovies ? (
            <div>
              <span className={styles.spantext}>Total Pages {totalPages} </span>{" "}
              <span className={styles.spantext}>Page {currentPage}</span>{" "}
              <span className={styles.spantext}>
                Total Results: {totalResults}
              </span>{" "}
            </div>
          ) : (
            ""
          )}
        </span>

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

        {!totalResults ? <span className={styles.spantext}></span> : ""}
      </div>
      {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
    </>
  );
}
