import React, { useEffect, useState, useCallback } from "react";
import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";
import Image from "next/image";
import Head from "next/head";
import {
  Button,
  FormLabel,
  Select,
  Spinner,
  ChakraProvider,
  Center,
  Progress,
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
  TabPanel

} from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import { Tooltip } from "antd";
import Link from "next/link";
import { Rate } from "antd";
import PageTitle from "../components/PageTitle";

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


  const [searchMovies, setSearchMovies] = useState([]);
  const [movieData, setMovieData] = useState([])
  const [searchMovies2, setSearchMovies2] = useState([]);
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
  //new filters
  const [showAllFilter, setShowAllFilter] = useState(false)
  const [showDecadeFilter, setShowDecadeFilter] = useState(false)
  const [showAverageFilter, setShowAverageFilter] = useState(false)
  const [movieId, setMovieId] = useState()
  const [moviePageRandom, setMoviePageRandom] = useState()

  let urlNew =
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&primary_release_date.gte=1900-01-01&primary_release_date.lte=2025-12-31&sort_by=popularity.desc"
  let urlNew2 =
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&primary_release_date.gte="
    + searchFilters.decade + "&sort_by=popularity.desc"
  let urlNew3 =
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US"
    + "&primary_release_date.gte=1900-01-01&primary_release_date.lte=2024-12-31&sort_by=popularity.asc"
    + searchFilters.average
    + "&vote_count.gte=500"

  let urlString

  if (showAllFilter) {
    urlString = urlNew;
    console.log("Todo o Catalogo")
  } else if (showDecadeFilter) {
    urlString = urlNew2;
    console.log("Decadas")
  } else if (showAverageFilter) {
    urlString = urlNew3;
    console.log("Por Bons e Ruins")
  } else {
    urlString = urlNew;
    console.log("Todo o Catalogo")
  }
  console.log("Url Escolhida", urlString)



  const apiCall = useCallback(() => {
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
      .catch((error) => setError(true));
  }, [urlNew, urlNew2, urlNew3]);

  let urlStringWithPage = urlString + "&page=" + moviePageRandom
  console.log("Url Montada ", urlStringWithPage)

  useEffect(() => { apiCall2() }
    , [urlStringWithPage]);


  const apiCall2 = () => {
    console.log("Chamou a apiCall2")
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
          console.log("O array de IDs de filmes está vazio.");
        }
      })
      .catch((error) => setError(true));
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
              popularity: result.popularity,
              gender: result.genres.map((genre) => genre.name),
              languages: result.spoken_languages[0].name,
              adult: result.adult,
              movieId: result.id,
              originalLanguage: result.original_language,
              statusMovie: result.status,
            };

            setMovieData(movieResult);
          } else {
            // If movie data is not found, set isFetchingMovie to false
            setIsLoading(false);
          }
        })
        .catch((error) => {
          setError(true);
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

  const handleAllFilter = () => {
    setShowAllFilter(!showAllFilter);
  };
  const handleDecadeFilter = () => {
    setShowDecadeFilter(!showDecadeFilter);
  };
  const handleAverageFilter = () => {
    setShowAverageFilter(!showAverageFilter);
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
                          80's & Today
                        </option>
                        <option value="1900-01-01&primary_release_date.lte=2025-12-31">
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
                </DrawerBody>
                <DrawerFooter>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </ChakraProvider>
          <br />
          <br />
        </div>
      </div>

      <ChakraProvider>{isLoading && <Spinner />}</ChakraProvider>


      <ChakraProvider>
        <div>

          <div>
            <h1>
              <br />
              <span className={styles.title}>
                {movieData.originalTitle ? (
                  <span
                    className={styles.title}
                  >{`${movieData.originalTitle}`}</span>
                ) : (
                  <ChakraProvider>
                    <></>
                  </ChakraProvider>
                )}
              </span>
              <br />
              {movieData.portugueseTitle ? (
                <span>{movieData.average}/10</span>
              ) : null}
              <br />
            </h1>
            {movieData.portugueseTitle ? (
              <div style={{ maxWidth: "480px", margin: "0 auto" }}>
                <ChakraProvider>
                  <Progress
                    value={movieData.average}
                    max={10}
                    colorScheme={getProgressColor(movieData.average)}
                  />
                </ChakraProvider>
                <br />
              </div>
            ) : null}
            {!movieData.portugueseTitle ? (
              <>
                <ChakraProvider>
                  <Center>
                    <Stack>
                      <Skeleton height='720px' width='480px' startColor='pink.500' endColor='purple.500' />
                    </Stack>
                  </Center>
                </ChakraProvider>
                <ChakraProvider>
                  <Stack>
                    <br />
                    <Center>
                      <Skeleton width='400px' height='5' />
                    </Center>
                    <Center>
                      <Skeleton width='400px' height='5' />
                    </Center>
                    <span></span>
                    <Center>
                      <Skeleton width='60px' height='5' />
                    </Center>
                    <br />
                    <Center>
                      <Skeleton width='120px' height='5' />
                    </Center>
                    <Center>
                      <Skeleton width='200px' height='5' />
                    </Center>
                    <Center>
                      <Skeleton width='120px' height='5' />
                    </Center>
                    <br />
                  </Stack>
                </ChakraProvider>
              </>

            ) : (
              <div>
                <ChakraProvider>
                  <Link href="/">
                    <Center>
                      <span>
                        <Image
                          className={isMobile ? styles.card_image_big_mobile : styles.card_image_big}
                          src={
                            movieData.image
                              ? "https://image.tmdb.org/t/p/original" + movieData.image
                              : "/callback.png"
                          }
                          alt="poster"
                          width="480"
                          height="720"
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
                            Country
                          </Tab>
                          <Tab
                            style={{
                              fontFamily: "Helvetica Neue, sans-serif",
                            }}
                          >
                            Language
                          </Tab>
                          <Tab
                            style={{
                              fontFamily: "Helvetica Neue, sans-serif",
                            }}
                          >
                            Genre
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

                            {movieData.country}


                          </TabPanel>
                          <TabPanel>

                            {movieData.originalLanguage}

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
                        </TabPanels>
                      </Tabs>
                    </TableContainer>
                  </Center>
                </ChakraProvider>
              </div>
            )}
            {/* <ChakraProvider>
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
            </ChakraProvider> */}

            <br />
            {/* {likeThanks && <span>Thanks 😀 </span>} */}

            {/* {showBackToTopButton && (
              <BackToTopButton onClick={scrollToTop} />
            )} */}
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

        </div>
      </ChakraProvider>





      {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
    </>
  );
}
