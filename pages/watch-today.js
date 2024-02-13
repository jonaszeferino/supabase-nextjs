import { useState, useEffect, useRef } from "react";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Link from "next/link";
import { Rate, Divider } from "antd";
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
  useMediaQuery,
  Center,
  Stack,
  Text

} from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import { supabase } from "../utils/supabaseClient";
import PageTitle from "../components/PageTitle";


export default function Movieapi() {
  const [isMobile] = useMediaQuery('(max-width: 768px)');
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
  const [session, setSession] = useState(null);
  const [email_user, setEmail_user] = useState(null);
  const [searchingMovie, setSearchingMovie] = useState(false); // Ajuste: inicializando com false
  const [isFetchingMovie, setIsFetchingMovie] = useState(false); // Add a new state for controlling the visibility of the skeleton
  const [firstTime, setFirstTime] = useState(false);

  useEffect(() => { apiCall(), setFirstTime(true) }
    , []);


  useEffect(() => {

    if (isError) {
      const fetchData = async () => {
        apiCall();
      };
      fetchData();
    }
  }, [isError]);

  const posterRef = useRef(null);

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

  const apiCall = () => {
    setIsFetchingMovie(true);
    setError(false);
    setRandomMovieId(Math.floor(Math.random() * 560000));

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
          setFirstTime(false)
          setMovieData(movieResult);
        } else {
          setIsFetchingMovie(false); // If movie data is not found, set isFetchingMovie to false
          setIsLoading(false);
          setFirstTime(false)
        }
      })
      .catch((error) => {
        setError(true);
        setFirstTime(false)
      })
      .finally(() => {
        setIsLoading(false);
        setFirstTime(false)
        setIsFetchingMovie(false); // Finally, set isFetchingMovie to false after API call is completed
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
          user_email: email_user,
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
        <meta name="keywords" content="movies,watch,review,tip,recommendation"></meta>
        <meta
          name="description"
          content="Find a movie tip here."
        ></meta>
      </Head>
      <div>

        <ChakraProvider>
          <Center>
            <Box maxW="32rem">
              <PageTitle
                title="What To Watch Today?"
                isMobile={isMobile}
                showLoggedUser={true}
              />
              <span>Here You Gonna Show You Random Movie Tips - If Dont Like Try Again!</span>
              <br />

            </Box>
          </Center>
        </ChakraProvider>

        {firstTime ?
          <ChakraProvider>
            <Center>
              <Text><strong>...Searching Movies</strong></Text>

            </Center>
          </ChakraProvider> : null}
        <ChakraProvider>
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
        </ChakraProvider>


        {isLoading ? <Progress size="xs" isIndeterminate /> : null}
        <br />
        {isError === true ? (
          null
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
                  {isFetchingMovie || !movieData.portugueseTitle ? (
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
                        <Link href={destino}>
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
      </div >
    </>
  );
}