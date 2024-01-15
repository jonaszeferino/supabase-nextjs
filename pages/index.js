import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { ChakraProvider, Progress } from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import { supabase } from "../utils/supabaseClient"; //
import { Rate } from "antd";
import LoggedUser from "../components/LoggedUser";
import LoginAlert from "../components/LoginAlert";

export default function Home() {
  let [searchMovies, setSearchMovies] = useState([]);
  let [page, setPage] = useState(1);
  let [isError, setError] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  let [searchTv, setSearchTv] = useState([]);
  const [session, setSession] = useState(null);

  const { showBackToTopButton, scrollToTop } = useBackToTopButton(); // tranformado num hook

  const urlString = "https://api.themoviedb.org/3/trending/movie/week";

  const apiCall = (currentPage) => {
    const url = urlString;
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
          throw new Error("Wrong data");
        }
      })
      .then((result) => {
        setSearchMovies(result.results);
        setPage(result.page);
        setIsLoading(false);
      })
      .catch((error) => setError(true));
  };

  useEffect(() => {
    apiCall(page);
  }, [page]);

  const urlStringTv = "https://api.themoviedb.org/3/trending/tv/week";

  const apiCallTv = (currentPage) => {
    const urlTv = urlStringTv;
    setIsLoading(true);

    fetch(urlTv, {
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
          throw new Error("Wrong data");
        }
      })
      .then((result) => {
        setSearchTv(result.results);
        setIsLoading(false);
      })
      .catch((error) => setError(true));
  };
  useEffect(() => {
    apiCallTv(page);
  }, [page]);

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
    let mounted = true;
    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted) {
        if (session) {
          setSession(session);
        }
        setIsLoading(false);
      }
    }
    getInitialSession();
    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <div>
      <Head>
        <title>Home</title>
        <meta name="keywords" content="movies,tvshows,"></meta>
        <meta name="description" content="movies,tvshows"></meta>

      </Head>

      <div>
        <LoggedUser />
        {/* <LoginAlert /> */}

        <div>
          <div className={styles.top}>
            <h3 className={styles.title}> Trending Movies of the Week</h3>
          </div>

          <div className={styles.grid}>
            {searchMovies.map((search) => (
              <div key={search.id} style={{ marginBottom: "10px" }}>
                <Link
                  href={{
                    pathname: "/movie-page",
                    query: { movieId: search.id },
                  }}
                >
                  <Image
                    unoptimized
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
                </Link>

                <div style={{ maxWidth: "240px", margin: "8px" }}>
                  <ChakraProvider>
                    <Progress
                      size="lg"
                      value={search.vote_average}
                      max={10}
                      colorScheme={getProgressColor(search.vote_average)}
                    />
                  </ChakraProvider>
                  {search.vote_average} <Rate value={1} count={1} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.top}>
          <h3 className={styles.title}> Trending TV Shows of the Week</h3>
        </div>

        <div className={styles.grid}>
          {searchTv.map((searchtv) => (
            <div key={searchtv.id} style={{ marginBottom: "20px" }}>
              <Link
                href={{
                  pathname: "/tvshow-page",
                  query: { tvShowId: searchtv.id },
                }}
              >
                <Image
                  className={styles.card_image}
                  src={
                    searchtv.poster_path
                      ? `https://image.tmdb.org/t/p/original${searchtv.poster_path}`
                      : "/callback.png"
                  }
                  alt="poster"
                  width={240}
                  height={360}
                  layout="fixed"
                />
              </Link>

              <div style={{ maxWidth: "240px", margin: "8px" }}>
                <ChakraProvider>
                  <Progress
                    size="lg"
                    value={searchtv.vote_average}
                    max={10}
                    colorScheme={getProgressColor(searchtv.vote_average)}
                  />
                </ChakraProvider>
                {searchtv.vote_average} <Rate value={1} count={1} />
              </div>
            </div>
          ))}
        </div>

        {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
      </div>
    </div>
  );
}
