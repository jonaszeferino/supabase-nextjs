import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Rate } from "antd";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import LoggedUser from "../components/LoggedUser";
import {
  ChakraProvider,
  Progress,
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
  Box,
  useMediaQuery,
  Flex,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { Flag } from "semantic-ui-react";

const providers = {
  AD: "Andorra",
  AE: "United Arab Emirates",
  AF: "Afghanistan",
  AG: "Antigua and Barbuda",
  AL: "Albania",
  AO: "Angola",
  AR: "Argentina",
  AT: "Austria",
  AU: "Australia",
  BA: "Bosnia and Herzegovina",
  BE: "Belgium",
  BF: "Burkina Faso",
  BG: "Bulgaria",
  BH: "Bahrain",
  BO: "Bolivia",
  BR: "Brazil",
  BS: "Bahamas",
  BT: "Bhutan",
  BZ: "Belize",
  CA: "Canada",
  CD: "Democratic Republic of the Congo",
  CH: "Switzerland",
  CI: "Ivory Coast",
  CL: "Chile",
  CM: "Cameroon",
  CO: "Colombia",
  CR: "Costa Rica",
  CV: "Cape Verde",
  CU: "Cuba",
  DM: "Dominica",
  DE: "Germany",
  DK: "Denmark",
  DO: "Dominican Republic",
  DZ: "Algeria",
  EC: "Ecuador",
  EE: "Estonia",
  EG: "Egypt",
  ER: "Eritrea",
  ES: "Spain",
  FJ: "Fiji",
  FI: "Finland",
  FR: "France",
  GB: "United Kingdom",
  GG: "Guernsey",
  GH: "Ghana",
  GI: "Gibraltar",
  GQ: "Equatorial Guinea",
  GT: "Guatemala",
  HN: "Honduras",
  HR: "Croatia",
  HU: "Hungary",
  ID: "Indonesia",
  IE: "Ireland",
  IL: "Israel",
  IN: "India",
  IQ: "Iraq",
  IT: "Italy",
  JP: "Japan",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "North Korea",
  KR: "South Korea",
  KW: "Kuwait",
  LA: "Laos",
  LB: "Lebanon",
  LC: "Saint Lucia",
  LT: "Lithuania",
  LU: "Luxembourg",
  LV: "Latvia",
  LY: "Libya",
  MA: "Morocco",
  MC: "Monaco",
  MG: "Madagascar",
  MH: "Marshall Islands",
  MK: "North Macedonia",
  ML: "Mali",
  MV: "Maldives",
  MU: "Mauritius",
  MW: "Malawi",
  MX: "Mexico",
  MY: "Malaysia",
  MZ: "Mozambique",
  NR: "Nauru",
  NE: "Niger",
  NG: "Nigeria",
  NI: "Nicaragua",
  NL: "Netherlands",
  NO: "Norway",
  NZ: "New Zealand",
  OM: "Oman",
  PA: "Panama",
  PE: "Peru",
  PH: "Philippines",
  PL: "Poland",
  PT: "Portugal",
  PW: "Palau",
  PY: "Paraguay",
  QA: "Qatar",
  RO: "Romania",
  RS: "Serbia",
  RU: "Russia",
  SA: "Saudi Arabia",
  SB: "Solomon Islands",
  SG: "Singapore",
  SI: "Slovenia",
  SK: "Slovakia",
  ST: "Sao Tome and Principe",
  SV: "El Salvador",
  TD: "Chad",
  TH: "Thailand",
  TN: "Tunisia",
  TO: "Tonga",
  TR: "Turkey",
  TV: "Tuvalu",
  TZ: "Tanzania",
  UA: "Ukraine",
  UG: "Uganda",
  US: "United States",
  UY: "Uruguay",
  VC: "Saint Vincent and the Grenadines",
  VE: "Venezuela",
  VU: "Vanuatu",
  WS: "Samoa",
  YE: "Yemen",
  ZA: "South Africa",
  ZM: "Zambia",
  ZW: "Zimbabwe",
};

const MoviePage = () => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const { movieId } = router.query;
  const [movieIdRequest, setMovieIdRequest] = useState(movieId);
  const [data, setData] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [isLoading, setIsLoading] = useState(true);
  const { showBackToTopButton, scrollToTop } = useBackToTopButton();

  useEffect(() => {
    // Função para obter o país do usuário
    const getUserCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/country/");
        const country = await response.text();
        setSelectedCountry(country); // Atualiza o estado com o país do usuário
        fetchProvidersForCountry(movieIdRequest, country); // Chama a função para buscar provedores após obter o país
      } catch (error) {
        console.error("Erro ao obter o país do usuário:", error);
      }
    };

    getUserCountry(); // Chama a função ao montar o componente

    if (movieId) {
      setMovieIdRequest(movieId);
      fetchMovieData(movieId);
    }
  }, [movieId]);

  const fetchMovieData = async (movieId) => {
    setIsLoading(true);

    const [resMovie, resCredits] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
        },
      }),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
        },
      }),
    ]);

    const [dataMovies, resCreditsData] = await Promise.all([
      resMovie.json(),
      resCredits.json(),
    ]);

    const directors = resCreditsData.crew
      .filter((member) => member.job === "Director")
      .map((director) => ({
        id: director.id,
        name: director.name,
      }));

    // Atualiza os dados do filme
    setData((prevData) => ({
      ...prevData,
      ...dataMovies,
      directors: directors.length > 0 ? directors : null,
    }));

    setIsLoading(false);
  };

  // Nova função para buscar provedores com base no país selecionado
  const fetchProvidersForCountry = async (movieId, country) => {
    const resProviders = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
      },
    });

    const dataProviders = await resProviders.json();
    const providersForSelectedCountry =
      dataProviders.results[country]?.flatrate || [];

    setData((prevData) => ({
      ...prevData,
      providers: providersForSelectedCountry,
    }));
  };

  const handleCountryChange = (event) => {
    const newCountry = event.target.value;
    setSelectedCountry(newCountry);
    fetchProvidersForCountry(movieIdRequest, newCountry); // Chama a nova função para buscar provedores
  };

  const metaDescription = `Movie Page ${
    data.original_title ? data.original_title : "Movies"
  }`;

  return (
    <>
      <Head>
        <title>Movie: {data.original_title || ""}</title>
        <meta name="keywords" content={metaDescription}></meta>
        <meta name="description" content={metaDescription}></meta>
      </Head>

      {isMobile ? (
        <Box pt={10}>
          <LoggedUser />
        </Box>
      ) : (
        <LoggedUser />
      )}

      <h1 className={styles.title}>{data.original_title}</h1>
      <Box maxW="480px" mx="auto">
        {isLoading ? (
          <ChakraProvider>
            <Progress size="xs" isIndeterminate />
          </ChakraProvider>
        ) : (
          <Image
            className={styles.card_image_big}
            src={`https://image.tmdb.org/t/p/original${data.poster_path || ""}`}
            alt="poster"
            width={480}
            height={720}
            objectFit="contain"
          />
        )}
      </Box>
      <Box maxW="480px" mx="auto" mt={6}>
        <ChakraProvider>
          <TableContainer>
            <Table size="sm">
              <Tbody>

              <Tr>
                  <Th>Overview</Th>
                  <Td
                    style={{
                      whiteSpace: "pre-wrap",
                      maxWidth: "480px",
                    }}
                  >
                    {data.overview ? data.overview : "No Infos"}
                  </Td> 
                </Tr>
                <Tr>
                  <Th>
                    {data.budget === 0 || data.budget === null
                      ? null
                      : `Budget:`}
                  </Th>
                  <Td>
                    {" "}
                    {data.budget === 0 || data.budget === null
                      ? "No Budget Info"
                      : `${new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(data.budget)}`}
                  </Td>
                </Tr>
             
                <Tr>
                  <Th>Country of Origin</Th>
                  <Td>{data.country}</Td>
                </Tr>
                <Tr>
                  <Th>Language</Th>
                  <Td>{data.original_language}</Td>
                </Tr>
                <Tr>
                  <Th>Release Date</Th>
                  <Td>{data.release_date}</Td>
                </Tr>
                <Tr>
                  <Th>Popularity</Th>
                  <Td>{data.popularity}</Td>
                </Tr>
                <Tr>
                  <Th>IMDB</Th>
                  <Td>https://www.imdb.com/title/{data.imdb}</Td>
                </Tr>
                <Tr>
                  <Th>Directors</Th>
                  <Td>
                    {data.directors ? (
                      <ul>
                        {data.directors.map((director, index) => (
                          <li key={index}>
                            <Link
                              href={{
                                pathname: "/person-page",
                                query: { personId: director.id },
                              }}
                            >
                              {director.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No directors available"
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Th>
                    <Select
                      placeholder="Select a Country"
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      ml={0}
                    >
                      {Object.entries(providers)
                        .sort((a, b) => a[1].localeCompare(b[1]))
                        .map(([code, name]) => (
                          <option key={code} value={code}>
                            {name}
                          </option>
                        ))}
                    </Select>
                  </Th>
                  <Td>
                    {Array.isArray(data.providers) &&
                    data.providers.length > 0 ? (
                      <Flex flexWrap="wrap">
                        {data.providers.map((provider, index) => (
                          <Box key={index} p={2} textAlign="center">
                            <Image
                              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                              alt={provider.provider_name}
                              width={50}
                              height={50}
                              style={{ borderRadius: "5px" }}
                            />
                            <Text fontSize="sm">{provider.provider_name}</Text>
                          </Box>
                        ))}
                      </Flex>
                    ) : (
                      "No providers available"
                    )}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </ChakraProvider>
      </Box>

      {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
    </>
  );
};

export default MoviePage;