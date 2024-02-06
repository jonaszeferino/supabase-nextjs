import React, { useEffect, useState, useRef } from "react";

import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";
import Image from "next/image";
import Head from "next/head";
import {
  ChakraProvider,
  Progress,
  Select,
  Input,
  FormLabel,
  Button,
  FormControl,
  Flex,
  Box,
  Center,
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

export default function Discovery() {
  let [searchMovies, setSearchMovies] = useState([]);
  //pagination
  let [page, setPage] = useState(1);
  let [searchMovieTotalPages, setSearchMovieTotalPages] = useState("");
  let [searchMovieRealPage, setSearchMovieRealPage] = useState("");
  let [searchMovieTotalResults, setSearchMovieTotalResults] = useState("");

  let [isError, setError] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  const { showBackToTopButton, scrollToTop } = useBackToTopButton();

  const btnRef = useRef();
  const [genres, setGenres] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [searchFilters, setSearchFilters] = useState({
    ratingSort: "vote_average.desc",
    releaseDateFrom: "1986-09-19",
  });

  let urlString =
    `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US` +
    `&primary_release_date.gte=` +
    searchFilters.releaseDateFrom +
    `&primary_release_date.lte=` +
    searchFilters.releaseDateFrom +
    `&sort_by=popularity.desc`;

  console.log("Chamada: ", urlString);

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
    setPage(page - 1), apiCall(page - 1);
  };

  useEffect(() => {
    setPage(1);
  }, [searchFilters]);

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
      label: `Birthday: ${searchFilters.releaseDateFrom}`,
      colorScheme: "red",
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
          <h3 className={styles.title}>Birthday Movie</h3>
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
                placement="bottom"
                onClose={onClose}
                finalFocusRef={btnRef}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <Center>
                    <DrawerHeader>Put Your Birthday</DrawerHeader>
                  </Center>

                  <DrawerBody>
                    <FormControl>
                      <Center>
                        <Flex align="center">
                          <Input
                            type="date"
                            value={searchFilters.releaseDateFrom}
                            onChange={(event) =>
                              setSearchFilters({
                                ...searchFilters,
                                releaseDateFrom: event.target.value,
                              })
                            }
                          />
                          <Box w="20px" />
                        </Flex>
                      </Center>
                    </FormControl>

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
