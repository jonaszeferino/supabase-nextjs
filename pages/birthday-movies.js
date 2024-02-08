import React, { useEffect, useState, useRef } from "react";

import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";
import Image from "next/image";
import Head from "next/head";
import {
  ChakraProvider,
  Progress,
  Input,
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
  Spinner,
  Text,
  useToast,
  useMediaQuery

} from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import LoggedUser from "../components/LoggedUser";
import { Tooltip } from "antd";
import Link from "next/link";
import { Rate, Divider } from "antd";

export default function Discovery() {

  const [isMobile] = useMediaQuery('(max-width: 768px)');
  let [searchMovies, setSearchMovies] = useState([]);

  let [page, setPage] = useState(1);
  let [searchMovieTotalPages, setSearchMovieTotalPages] = useState("");
  let [searchMovieRealPage, setSearchMovieRealPage] = useState("");
  let [searchMovieTotalResults, setSearchMovieTotalResults] = useState("");

  let [isError, setError] = useState("");
  let [isLoading, setIsLoading] = useState(false);
  const { showBackToTopButton, scrollToTop } = useBackToTopButton();

  const btnRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [type, setType] = useState(true);

  // Toast

  const toast = useToast();
  const toastIdRef = React.useRef();

  function close() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }
  function closeAll() {
    // you may optionally pass an object of positions to exclusively close
    // keeping other positions opened
    // e.g. `{ positions: ['bottom'] }`
    toast.closeAll();
  }

  function addToast() {
    toastIdRef.current = toast({ description: "some text" });
  }

  // Date handle

  const handleInputChange = (event) => {
    const { value } = event.target;
    setSearchFilters({
      ...searchFilters,
      releaseYear: value,
    });
    if (value < 1900 || value > new Date().getFullYear()) {
      setError("The year must be between 1900 and the current year");
    } else {
      setError("");
    }
  };

  const [searchFilters, setSearchFilters] = useState({
    ratingSort: "vote_average.desc",
    releaseDateFrom: "2014-11-05",
    releaseYear: "2024",
  });

  let urlString = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US`;

  if (type === true) {
    urlString +=
      `&primary_release_date.gte=` +
      searchFilters.releaseDateFrom +
      `&primary_release_date.lte=` +
      searchFilters.releaseDateFrom +
      `&sort_by=popularity.desc`;
  } else {
    urlString +=
      `&primary_release_date.gte=` +
      searchFilters.releaseYear +
      "-01-01" +
      `&primary_release_date.lte=` +
      searchFilters.releaseYear +
      "-12-31" +
      `&sort_by=popularity.desc`;
  }

  const apiCall = (currentPage) => {
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
          setIsLoading(false),
          onClose()
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

  return (
    <>
      <Head>
        <title>Birthday Movie</title>
        <meta name="keywords" content="movies,watch,tvshows"></meta>
        <meta
          name="description"
          content="Watch movies from your birth year or birthday"
        ></meta>
      </Head>
      <div>

        {isMobile ? (
          <>
            <div style={{ paddingTop: 80, }} >
              <LoggedUser />
              <Divider />
              <h1> <strong>Birthday Movie</strong></h1>
              <Divider />
            </div>
          </>
        ) : (
          <div className={styles.top}>
            <h3 className={styles.title}>Birthday Movie</h3>
          </div>
        )}

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
                Put Your Birthday
              </Button>
              <br />

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
                    <Center>
                      <Button
                        colorScheme="purple"
                        onClick={() => setType(!type)}
                      >
                        Your Day / Your Year
                      </Button>
                    </Center>

                    <br />

                    <FormControl>
                      <Center>
                        <Flex align="center">
                          <Input
                            isDisabled={!type}
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
                    <FormControl>
                      <Center>
                        <Flex align="center">
                          <Input
                            isDisabled={type}
                            type="number"
                            min={1900}
                            max={new Date().getFullYear()}
                            value={searchFilters.releaseYear}
                            onChange={handleInputChange}
                          />
                          <Box w="20px" />
                        </Flex>
                      </Center>
                      <Center>
                        {isError && (
                          <Text style={{ color: "red" }}>{isError}</Text>
                        )}
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
          <ErrorPage message={`Verify Credentials`}></ErrorPage>
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
