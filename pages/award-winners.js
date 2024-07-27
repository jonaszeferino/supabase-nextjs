import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { ChakraProvider, useMediaQuery, Card, CardBody, Stack, Heading, CardFooter, Text, Button, Image as ImageChakra, HStack, Center } from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import { supabase } from "../utils/supabaseClient";
import { Rate } from "antd";
import PageTitle from "../components/PageTitle";


export default function Home() {

  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const [showLoggedUser, setShowLoggedUser] = useState(true);


  let [searchMovies, setSearchMovies] = useState([]);
  let [page, setPage] = useState(1);
  let [isError, setError] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  let [searchTv, setSearchTv] = useState([]);
  const [session, setSession] = useState(null);

  const { showBackToTopButton, scrollToTop } = useBackToTopButton();

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

      <PageTitle
        title="Special Tips"
        isMobile={isMobile}
        showLoggedUser={showLoggedUser}
      />
      <br />
      <ChakraProvider>
<></>
      </ChakraProvider>
      {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}

    </div>
  );
}
