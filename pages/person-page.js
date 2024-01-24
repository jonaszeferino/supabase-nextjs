import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";
import { useRouter } from "next/router";
import {
  ChakraProvider,
  Progress,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Divider,
  Heading,
  Box,
} from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import TranslateProfile from "../components/TranslateProfile";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import LoggedUser from "../components/LoggedUser";
import Head from "next/head";

export default function Personapi() {
  const router = useRouter();
  const personIdRecive = router.query.personId;
  const [personRecive, setPersonRecive] = useState({});
  const [isError, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataPerson, setDataPerson] = useState({});
  const { showBackToTopButton, scrollToTop } = useBackToTopButton();

  console.log();

  useEffect(() => {
    const apiCall = () => {
      setIsLoading(true);
      if (!personIdRecive) {
        return;
      }
      const url = `https://api.themoviedb.org/3/person/${personIdRecive}`;
      fetch(url, {
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            setError(false);
            setIsLoading(false);
            return response.json();
          } else {
            setError(true);
            setIsLoading(false);
            throw console.log("Error 1");
          }
        })
        .then((result) => setPersonRecive(result))
        .catch((error) => setError(true));
    };

    apiCall();
  }, [personIdRecive]);

  const CallDataPerson = () => {
    if (!personIdRecive) {
      return;
    }
    const url = `https://api.themoviedb.org/3/person/${personIdRecive}/combined_credits`;

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
          setError(true);
          throw console.log("Error 2");
        }
      })
      .then((result) => {
        const { cast, crew } = result;
        setDataPerson({ cast, crew });
      })
      .catch((error) => setError(true));
  };

  return (
    <div>
      <Head>
        <title>
          Personal Page {personRecive.name ? personRecive.name : null}{" "}
        </title>
        <meta
          name="keywords"
          content="movies,watch,review,tvshows,movies"
        ></meta>
        <meta name="description" content="find movies and tvshows"></meta>
      </Head>
      {isError === true ? (
        <ErrorPage message={"Loading Error"} />
      ) : (
        <>
          <ChakraProvider>
            {isLoading ? <Progress size="xs" isIndeterminate /> : null}
          </ChakraProvider>
          <div>
            <LoggedUser />
            <h3 className={styles.title}></h3>
            <span>
              <Image
                className={styles.card_image_big}
                src={
                  personRecive.profile_path
                    ? `https://image.tmdb.org/t/p/original${personRecive.profile_path}`
                    : "/callback.png"
                }
                alt="poster"
                width="480"
                height="720"
                style={{
                  objectFit: "contain",
                  maxHeight: "100%",
                  maxWidth: "100%",
                }}
              />
            </span>

            <ChakraProvider>
              <div
                style={{
                  maxWidth: "480px",
                  margin: "0 auto",
                  wordBreak: "break-word",
                }}
              >
                <TableContainer>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Td>{personRecive.name}</Td>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Th>Known for?</Th>
                        <Td>
                          <TranslateProfile
                            text={personRecive.known_for_department}
                            language="en"
                          />
                          {personRecive.known_for_department}
                        </Td>
                        <Tr />
                      </Tr>
                      <Tr>
                        <Th>Biography</Th>
                        <Td>
                          {" "}
                          <Box whiteSpace="pre-wrap">
                            {personRecive.biography}
                          </Box>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Birth </Th>
                        <Td>{personRecive.place_of_birth}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </div>
            </ChakraProvider>
            <br />
            <button onClick={CallDataPerson} className={styles.button}>
              Look the Jobs
            </button>
            <br />
            <ChakraProvider>
              {dataPerson.cast ? (
                <>
                  <Divider />
                  <Heading as="h1" size="lg">
                    In Front of the Cameras
                  </Heading>
                  <Divider />
                  <br />
                </>
              ) : null}
            </ChakraProvider>
            <ChakraProvider>
              <div className={styles.grid}>
                {dataPerson.cast &&
                  dataPerson.cast.map((work) => (
                    <div key={work.original_title} className={styles.gridItem}>
                      {work.media_type === "movie" ? (
                        <span className={styles.spantext}>{work.title}</span>
                      ) : (
                        <span className={styles.spantext}>{work.name}</span>
                      )}
                      <br />
                      <span>
                        {work.media_type === "movie" ? "Movie" : "Tv Show"}
                      </span>
                      <br />

                      <Image
                        className={styles.card_image}
                        src={
                          work.poster_path
                            ? "https://image.tmdb.org/t/p/original" +
                              work.poster_path
                            : "/callback.png"
                        }
                        alt="poster"
                        width="240"
                        height="360"
                      />
                      <br />

                      {work.character ? work.character : "N/A"}
                      <div>
                        <Link
                          href={{
                            pathname:
                              work.media_type === "movie"
                                ? "/movie-page"
                                : "/tvshow-page",
                            query:
                              work.media_type === "movie"
                                ? { movieId: work.id }
                                : { tvShowId: work.id },
                          }}
                        >
                          Details
                        </Link>
                        <br />
                        <br />
                      </div>
                    </div>
                  ))}
              </div>
              {dataPerson.crew ? (
                <>
                  <Divider />
                  <Heading as="h1" size="lg">
                    Behind The Cameras
                  </Heading>
                  <Divider />
                </>
              ) : null}
              <br />
              <div className={styles.grid}>
                {dataPerson.crew &&
                  dataPerson.crew.map((workCrew) => (
                    <div
                      key={workCrew.original_title}
                      className={styles.gridItem}
                    >
                      {workCrew.media_type === "movie" ? (
                        <span className={styles.spantext}>
                          {workCrew.title}
                        </span>
                      ) : (
                        <span className={styles.spantext}>{workCrew.name}</span>
                      )}
                      <br />
                      <span>
                        {workCrew.media_type === "movie" ? "Cinema" : "Tv Show"}
                      </span>
                      <br />

                      <Image
                        className={styles.card_image}
                        src={
                          workCrew.poster_path
                            ? "https://image.tmdb.org/t/p/original" +
                              workCrew.poster_path
                            : "/callback.png"
                        }
                        alt="poster"
                        width="240"
                        height="360"
                      />
                      <br />
                      {workCrew.job ? workCrew.job : "N/A"}
                      <br />
                      <div>
                        <Link
                          href={{
                            pathname:
                              workCrew.media_type === "movie"
                                ? "/movie-page"
                                : "/tvshow-page",
                            query:
                              workCrew.media_type === "movie"
                                ? { movieId: workCrew.id }
                                : { tvShowId: workCrew.id },
                          }}
                        >
                          Details
                        </Link>
                        <br />
                        <br />
                      </div>
                    </div>
                  ))}
              </div>
            </ChakraProvider>
            <br />
          </div>
        </>
      )}
      {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
    </div>
  );
}
