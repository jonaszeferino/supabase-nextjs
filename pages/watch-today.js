import { useState, useEffect, useRef } from "react";
import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";
import Head from "next/head";
import Link from "next/link";
import { Rate } from "antd";
import TranslationComponent from "../components/translateComponent";
import TranslationComponentCountryName from "../components/translateComponentCountryName";
import {
  ChakraProvider,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Box,
  Button,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Skeleton,
  Image,
  Link as LinkChakra,
} from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";

export default function Movieapi() {
  const [movieData, setMovieData] = useState({});
  const [randomMovieId, setRandomMovieId] = useState(null);
  const [isError, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLikeDisabled, setLikeDisable] = useState(false);
  const [likeThanks, setLikeThanks] = useState(false);
  const [dateNow, setDatenow] = useState(new Date());

  const [starValue, setStarValue] = useState(0);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const { showBackToTopButton, scrollToTop } = useBackToTopButton();

  useEffect(() => {
    if (isError) {
      const fetchData = async () => {
        apiCall();
      };
      fetchData();
    }
  }, [isError]);

  const posterRef = useRef(null);

  const apiCall = () => {
    if (!isError && posterRef.current) {
      posterRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setRandomMovieId(Math.floor(Math.random() * 560000));
    setIsLoading(true);
    setError(false);
    setLikeDisable(false);
    setLikeThanks(false);
    setIsRatingSubmitted(false);
    setStarValue(0);

    const url = `https://api.themoviedb.org/3/movie/${randomMovieId}`;

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
          setError(true);
          throw new Error(response.statusText);
        }
      })
      .then((result) => {
        setMovieData({
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
        });
        setIsLoading(false);
        setError(false);
      })
      .catch((error) => {
        setError(true);
        setIsLoading(false);
      });
  };

  let destino = `/movie-page?movieId=${movieData.movieId}`;

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
    try {
      const response = await fetch("/api/v1/postRateRandomMovie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: movieData.movieId,
          poster_path: movieData.image,
          original_title: movieData.originalTitle,
          portuguese_title: movieData.portugueseTitle,
          vote_average_by_provider: movieData.average,
          rating_by_user: starValue,
        }),
      });
      return;
    } catch (error) {
      console.error(error);
    }
  };

  const handleRateChange = (value) => {
    setStarValue(value);
  };
  const handleRatingSubmit = () => {
    setIsRatingSubmitted(true);
  };

  const isLoadingPage =
    isError || movieData.adult || movieData.portugueseTitle === null;
  console.log(isLoadingPage);

  return (
    <>
      <Head>
        <title>What to Watch Today?</title>
        <meta name="keywords" content="movies,watch,review"></meta>
        <meta
          name="description"
          content="Find everything about movies here"
        ></meta>
      </Head>
      <div>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <ChakraProvider>
            <Box maxW="32rem">
              <div className={styles.top}>
                <h3 className={styles.title}>What To Watch Today?</h3>
                <span>
                  {" "}
                  Click and see the possibilities until you find one to your
                  liking!
                </span>
              </div>
              <Button
                size="md"
                bg="white"
                color="black"
                borderColor="gray"
                borderWidth="1px"
                mt="24px"
                onClick={apiCall}
              >
                Go
              </Button>
            </Box>
          </ChakraProvider>
        </div>

        {isLoading ? <Progress size="xs" isIndeterminate /> : null}
        <br />
        {isError === true ? (
          <ErrorPage message={`Deleted Movie`}></ErrorPage>
        ) : (
          <ChakraProvider>
            <div>
              {movieData.adult === false ? (
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
                          {/* <Box bg="green.100" p={4}>
                        <Alert
                        </Alert>
                      </Box> */}
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

                  <h1>
                    <ChakraProvider>
                      {isLoadingPage === false ? (
                        <Link href={destino}>
                          <Image
                            className={styles.card_image_big}
                            src={
                              movieData.image
                                ? "https://image.tmdb.org/t/p/original" +
                                  movieData.image
                                : "/callback.png"
                            }
                            alt="poster"
                            width="480"
                            height="720"
                          />
                        </Link>
                      ) : (
                        <Skeleton width="480px" height="720px" />
                      )}

                      {/* <Button colorScheme="purple">
      <Link href={destino}>Details</Link>
    </Button> */}
                    </ChakraProvider>
                  </h1>

                  {movieData.portugueseTitle && (
                    <div style={{ maxWidth: "480px", margin: "0 auto" }}>
                      <ChakraProvider>
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
                          <Tabs size="md" variant="enclosed">
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
                                <TranslationComponentCountryName
                                  text={movieData.country}
                                  language="en"
                                />
                              </TabPanel>
                              <TabPanel>
                                <TranslationComponent
                                  text={movieData.originalLanguage}
                                  language="en"
                                />
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
                                      {index !== movieData.gender.length - 1
                                        ? ", "
                                        : ""}
                                    </span>
                                  ))}
                              </TabPanel>
                            </TabPanels>
                          </Tabs>
                        </TableContainer>
                      </ChakraProvider>
                    </div>
                  )}

                  {movieData.portugueseTitle && (
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
                  )}
                  <br />
                  {likeThanks && <span>Thanks 😀 </span>}
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
              ) : null}
            </div>
          </ChakraProvider>
        )}
      </div>
    </>
  );
}
