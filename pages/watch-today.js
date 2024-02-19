import React, { useEffect, useState, useCallback } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Head from "next/head";
import {
  Button,
  FormLabel,
  Select,
  Spinner,
  ChakraProvider,
  Center,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useMediaQuery,
  Stack,
  Skeleton,
  TableContainer,
  Table,
  Thead,
  Tr,
  Td,
  Tbody,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  Progress

} from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import { Tooltip } from "antd";
import Link from "next/link";
import { Rate } from "antd";
import PageTitle from "../components/PageTitle";
import { supabase } from "../utils/supabaseClient";

export default function Discovery() {

  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const [searchFilters, setSearchFilters] = useState({
    voteCount: 1000,
    decade: 2000,
    average: "",
    category: "All",
  });

  const [showOverview, setShowOverview] = useState(false)
  const [searchMovies, setSearchMovies] = useState([]);
  const [movieData, setMovieData] = useState([])
  const [genres, setGenres] = useState([]);
  //pagination
  const [searchMovieTotalPages, setSearchMovieTotalPages] = useState("");
  const [page, setPage] = useState(1);
  const [isError, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // back to the top button
  const { showBackToTopButton, scrollToTop } = useBackToTopButton();
  //new filters
  const [showAllFilter, setShowAllFilter] = useState(false)
  const [showDecadeFilter, setShowDecadeFilter] = useState(false)
  const [showAverageFilter, setShowAverageFilter] = useState(false)
  const [movieId, setMovieId] = useState()
  const [moviePageRandom, setMoviePageRandom] = useState()
  // Rate
  const [starValue, setStarValue] = useState(0);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);

  // Session Necesary to put inter
  const [session, setSession] = useState()
  const [user_email, setEmail_user] = useState()


  useEffect(() => {
    let mounted = true;
    async function getInitialSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log("Session:", session);
        if (mounted) {
          if (session) {
            setSession(session);
            setEmail_user(session.user.email);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      }
    }
    getInitialSession();
    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth State Change:", session);
        setSession(session);
      }
    );
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);


  let urlAll =
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&primary_release_date.gte=1900-01-01&primary_release_date.lte=2025-12-31&sort_by=popularity.desc"
  let urlDecades =
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&primary_release_date.gte="
    + searchFilters.decade + "&sort_by=popularity.desc"
  let urlBestWorst =
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US"
    + "&primary_release_date.gte=1900-01-01&primary_release_date.lte=2024-12-31&sort_by=popularity.asc"
    + searchFilters.average
    + "&vote_count.gte=500"

  let urlString

  if (showAllFilter) {
    urlString = urlAll;
  } else if (showDecadeFilter) {
    urlString = urlDecades;
  } else if (showAverageFilter) {
    urlString = urlBestWorst;
  } else {
    urlString = urlAll;
  }
  console.log("Url", urlString)

  const apiCall = useCallback(() => {
    setIsRatingSubmitted(false)
    setStarValue(0)
    setIsLoading(true)
    fetch(urlString, {
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
      .then((result) => {
        setSearchMovies(result.results);
        setSearchMovieTotalPages(result.total_pages);
        setIsLoading(false);
        let maxLimit = Math.min(result.total_pages, 500);

        maxLimit = result.total_pages < 500 ? result.total_pages : 500;

        const randomicNumber = Math.floor(Math.random() * maxLimit) + 1;
        setMoviePageRandom(randomicNumber);
      })
      .catch((error) => (setError(true), setIsLoading(false)));
  }, [urlAll, urlDecades, urlBestWorst]);

  let urlStringWithPage = urlString + "&page=" + moviePageRandom
  console.log("Url Final ", urlStringWithPage)

  useEffect(() => { apiCall2() }
    , [urlStringWithPage]);

  const apiCall2 = () => {

    fetch(urlStringWithPage, {
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
      .then((result) => {
        setSearchMovies(result.results);
        setSearchMovieTotalPages(result.total_pages);
        setPage(result.page);
        setIsLoading(false);

        const movieIds = result.results.map((movie) => movie.id);
        const arrayLength = movieIds.length;

        if (arrayLength > 0) {
          const randomIndex = Math.floor(Math.random() * arrayLength);
          const randomMovieId = movieIds[randomIndex];
          setMovieId(randomMovieId);
        } else {
          console.log("Array of ids is empty.");
        }
      })
      .catch((error) => (setError(true), setIsLoading(false)));
  };


  useEffect(() => {
    const apiCall3 = () => {
      const url = `https://api.themoviedb.org/3/movie/${movieId}`;
      fetch(url, {
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(response.statusText);
          }
        })
        .then((result) => {
          if (result && result.id) {
            const movieResult = {
              budget: result.budget,
              originalTitle: result.original_title,
              portugueseTitle: result.title,
              overview: result.overview,
              average: result.vote_average,
              releaseDate: result.release_date,
              image: result.poster_path,
              country: result.production_countries[0].name,
              ratingCount: result.vote_count,
              gender: result.genres.map((genre) => genre.name),
              languages: result.spoken_languages[0].name,
              movieId: result.id,
              originalLanguage: result.original_language,
              statusMovie: result.status,
            };

            setMovieData(movieResult);
            setIsLoading(false)
          } else {
            setIsLoading(false);

          }
        })
        .catch((error) => {
          setError(true);
          setIsLoading(false)
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    if (movieId) {
      apiCall3();
    }
  }, [movieId]);

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

  const inserLike = async () => {
    console.log("Like Insert Call");
    const requestData = {
      movie_id: movieData.movieId,
      poster_path: movieData.image,
      original_title: movieData.originalTitle,
      portuguese_title: movieData.portugueseTitle,
      vote_average_by_provider: movieData.average,
      rating_by_user: starValue,
      user_email: user_email ? user_email : "movietoday@gmail.com",
    };
    console.log("Request Data:", requestData); // Adicione este console.log para visualizar os dados enviados

    try {
      const response = await fetch("/api/v1/postRateRandomMovie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      return;
    } catch (error) {
      console.error(error);
    }
  };


  const handleAllFilter = () => {
    setShowAllFilter(!showAllFilter);
  };
  const handleDecadeFilter = () => {
    setShowDecadeFilter(!showDecadeFilter);
  };
  const handleAverageFilter = () => {
    setShowAverageFilter(!showAverageFilter);
  };
  const handleShowOverview = () => {
    setShowOverview(!showOverview);
  };

  const handleRateChange = (value) => {
    setStarValue(value);
  };
  const handleRatingSubmit = () => {
    setIsRatingSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>What To Watch Today?</title>
        <meta name="keywords" content="tvshow,watch,review"></meta>
        <meta name="description" content="movies, movies, tips"></meta>
      </Head>
      <PageTitle
        title="What To Watch Today?"
        isMobile={isMobile}
        showLoggedUser={true}
      />

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
            <Drawer
              isOpen={isOpen}
              placement="rigth"
              onClose={onClose}
              finalFocusRef={btnRef}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Select Filters</DrawerHeader>
                <DrawerBody>
                  <Center>
                    <Tooltip label="Enable/Disable Movies">
                      <Button
                        colorScheme={showDecadeFilter ? "green" : "gray"}
                        onClick={handleDecadeFilter}
                        isDisabled={showAverageFilter || showAllFilter}
                      >
                        By Decades
                      </Button>
                    </Tooltip>
                  </Center>
                  <br />
                  <Center>
                    <Tooltip label="Enable/Disable Movies">
                      <Button
                        colorScheme={showAverageFilter ? "green" : "gray"}
                        onClick={handleAverageFilter}
                        isDisabled={showAllFilter || showDecadeFilter}
                      >
                        Bests & Worsts
                      </Button>
                    </Tooltip>
                  </Center>
                  <br />
                  <Center>
                    <Tooltip label="Enable/Disable Movies">
                      <Button
                        colorScheme={showAllFilter ? "green" : "gray"}
                        onClick={handleAllFilter}
                        isDisabled={showAverageFilter || showDecadeFilter}
                      >
                        All Catalog
                      </Button>
                    </Tooltip>
                  </Center>
                  <br />
                  {showDecadeFilter ?
                    <>
                      <FormLabel htmlFor="orderby">Movies By Decade</FormLabel>
                      <Select
                        id="Decade"
                        placeholder="Choise Decade"
                        type="text"
                        isRequired={true}
                        value={searchFilters.decade}
                        onChange={(event) =>
                          setSearchFilters({
                            ...searchFilters,
                            decade: event.target.value,
                          })
                        }
                      >
                        <option value="1920-01-01&primary_release_date.lte=1929-12-31">
                          Roaring Twenties
                        </option>
                        <option value="1930-01-01&primary_release_date.lte=1939-12-31">
                          Great Depression Era
                        </option>
                        <option value="1940-01-01&primary_release_date.lte=1949-12-31">
                          World War II Era
                        </option>
                        <option value="1950-01-01&primary_release_date.lte=1959-12-31">
                          Post-War Boom
                        </option>
                        <option value="1960-01-01&primary_release_date.lte=1969-12-31">
                          Swinging Sixties
                        </option>
                        <option value="1970-01-01&primary_release_date.lte=1979-12-31">
                          Me Decade
                        </option>
                        <option value="1980-01-01&primary_release_date.lte=1989-12-31">
                          80&apos;s
                        </option>
                        <option value="1990-01-01&primary_release_date.lte=1999-12-31">
                          90&apos;s
                        </option>
                        <option value="2000-01-01&primary_release_date.lte=2009-12-31">
                          00&apos;s
                        </option>
                        <option value="2010-01-01&primary_release_date.lte=2059-12-31">
                          00&apos;s & Today
                        </option>
                        <option value="1900-01-01&primary_release_date.lte=2059-12-31">
                          All time
                        </option>
                      </Select></> : null}
                  {showAverageFilter ?
                    <>
                      <FormLabel>Best or Worst</FormLabel>
                      <Select
                        value={searchFilters.average}
                        onChange={(event) =>
                          setSearchFilters({
                            ...searchFilters,
                            average: event.target.value,
                          })
                        }
                      >
                        <option value="">Choice Avarege</option>
                        <option value="&vote_average.lte=5">Worst</option>
                        <option value="&vote_average.gte=5">Best</option>
                      </Select>
                    </> : null}
                  <br />
                  <Center>
                    <Button size="lg" colorScheme="purple" onClick={apiCall}>
                      Go
                    </Button>
                  </Center>
                  {isLoading ? <Progress size='xs' isIndeterminate /> : null}
                </DrawerBody>
                <DrawerFooter>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </ChakraProvider>
          <br />
        </div>
      </div>
      <ChakraProvider>{isLoading && <Spinner />}</ChakraProvider>
      <ChakraProvider>
        <div>
          {!movieData.portugueseTitle ? (
            <>
              <ChakraProvider>
                <Box> <strong>Choose Your Filters</strong></Box>
                <Center>
                  <Stack spacing={4} justify="center" align="center">
                    <Skeleton height={{ base: '360px', md: '720px' }} width={{ base: '280px', md: '480px' }} startColor='pink.500' endColor='purple.500' />
                  </Stack>
                </Center>
              </ChakraProvider>
            </>
          ) : (
            <div>
              <ChakraProvider>
                <Link href={{
                  pathname: "/movie-page",
                  query: { movieId: movieData.movieId },
                }}>


                  <Center>
                    <span>
                      <Image
                        className={isMobile ? styles.card_image_mobile : styles.card_image_desktop}
                        src={
                          movieData.image
                            ? "https://image.tmdb.org/t/p/original" + movieData.image
                            : "/callback.png"
                        }
                        alt="poster"
                        width={isMobile ? "240" : "480"}
                        height={isMobile ? "360" : "720"}
                        objectFit="contain"
                        maxHeight="100%"
                        maxWidth="100%"
                      />
                    </span>
                  </Center>
                </Link>
              </ChakraProvider>



              <ChakraProvider>
                <Center>
                  <TableContainer>
                    <Table size="sm">
                      <Thead>
                        <Tr>
                          <Td
                            style={{
                              fontFamily: "Helvetica Neue, sans-serif",
                            }}
                          >
                            Title
                          </Td>
                          <Td
                            style={{
                              fontFamily: "Helvetica Neue, sans-serif",
                            }}
                          >
                            {movieData.portugueseTitle}
                          </Td>
                        </Tr>
                      </Thead>
                      <Tbody></Tbody>
                    </Table>
                    <Tabs size="md">
                      <TabList>
                        <Tab
                          style={{
                            fontFamily: "Helvetica Neue, sans-serif",
                          }}
                        >
                          Average
                        </Tab>
                        <Tab
                          style={{
                            fontFamily: "Helvetica Neue, sans-serif",
                          }}
                        >
                          Ctry - Lang
                        </Tab>

                        <Tab
                          style={{
                            fontFamily: "Helvetica Neue, sans-serif",
                          }}
                        >
                          Genre
                        </Tab>
                        <Tab
                          style={{
                            fontFamily: "Helvetica Neue, sans-serif",
                          }}
                        >
                          Overview
                        </Tab>
                      </TabList>
                      <TabPanels>
                        <TabPanel
                          style={{
                            fontFamily: "Helvetica Neue, sans-serif",
                          }}
                        >
                          {`${movieData.average} `}
                        </TabPanel>
                        <TabPanel>
                          {movieData.country} - {movieData.originalLanguage}
                        </TabPanel>

                        <TabPanel
                          style={{
                            fontFamily: "Helvetica Neue, sans-serif",
                          }}
                        >
                          {" "}
                          {movieData.gender &&
                            movieData.gender.length > 0 &&
                            movieData.gender.map((gender, index) => (
                              <span key={gender}>
                                {gender}
                                {index !== movieData.gender.length - 1 ? ", " : ""}
                              </span>
                            ))}
                        </TabPanel>
                        <TabPanel style={{
                          whiteSpace: "pre-wrap",
                          maxWidth: "450px",
                        }}>
                          <Center>
                            <Button
                              colorScheme={showOverview ? "purple" : "gray"}
                              onClick={handleShowOverview}

                            >
                              Show Overview
                              <br />
                            </Button>
                          </Center>
                          {showOverview ?
                            <span> {movieData.overview ? movieData.overview : "No Infos"}</span>
                            : null}
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </TableContainer>
                </Center>
              </ChakraProvider>
            </div>
          )}
          {movieData.portugueseTitle ?
            <ChakraProvider>
              <Center>
                <span>
                  <div>
                    <h1>Rate This Tip</h1>
                    <Rate
                      onChange={handleRateChange}
                      value={starValue}
                      disabled={isRatingSubmitted}
                      count={10}
                    />
                    <br />
                    <Button
                      onClick={() => {
                        handleRatingSubmit();
                        inserLike();
                      }}
                      disabled={isRatingSubmitted}
                    >
                      Submit Rating
                    </Button>
                    {isRatingSubmitted && (
                      <p>Rating submitted successfully!</p>
                    )}
                  </div>
                </span>
              </Center>
            </ChakraProvider>
            : null}
          <br />
          {showBackToTopButton && (
            <BackToTopButton onClick={scrollToTop} />
          )}
          {movieData.portugueseTitle && (
            <ChakraProvider>
              <Button
                colorScheme="purple"
                onClick={apiCall}
                className={styles.button}
              >
                Try Again
              </Button>
            </ChakraProvider>
          )}
        </div>
      </ChakraProvider >
      {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />
      }
    </>
  );
}
