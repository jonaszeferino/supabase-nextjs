import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { SearchIcon } from "@chakra-ui/icons";

import {
  ChakraProvider,
  Center,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Stack,
  Input,
  Box,
  Checkbox,
  InputGroup,
  InputRightElement,
  Text,
  IconButton,
  useMediaQuery,
} from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import Head from "next/head";
import PageTitle from "../components/PageTitle";

const MoviePage = () => {
  const router = useRouter();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("PT");
  const [showAllTables, setShowAllTables] = useState(false);
  const [movieIdSearch, setMovieIdSearch] = useState(null);
  const [totals, setTotals] = useState("");
  const [showPoster, setShowPoster] = useState(false);

  const [movieSearchQuery, setMovieSearchQuery] = useState("");
  const [movieResultSearchMovie, setResultSearchMovie] = useState([]);
  const [error, setError] = useState("");

  const { showBackToTopButton, scrollToTop } = useBackToTopButton(); // tranformado num hook
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const [selectedCountry, setSelectedCountry] = useState("BR"); // Estado para o país selecionado

  const Clean = () => {
    setIsLoading(true);
  };

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

  const apiCall = () => {
    Clean();
    const url = `https://api.themoviedb.org/3/search/movie?query=${movieSearchQuery}&include_adult=false`;
    setIsLoading(true);

    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setError(false);
          return response.json();
        } else {
          throw new Error("Dados Incorretos");
        }
      })
      .then((result) => {
        setResultSearchMovie(result.results);
        setTotals(result.total_results);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const fetchData = () => {
    setTotals("");
    Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieIdSearch}`, {
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
        }),
      }),
      fetch(
        `https://api.themoviedb.org/3/movie/${movieIdSearch}/watch/providers`,
        {
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
          }),
        }
      ),
    ])
      .then(([resMovie, resProviders]) =>
        Promise.all([resMovie.json(), resProviders.json()])
      )
      .then(([dataMovies, dataProviders]) => {
        setTotals({
          total_results: dataProviders.total_results,
        }),
          setData({
            budget: dataMovies.budget,
            originalTitle: dataMovies.original_title,
            portugueseTitle: dataMovies.title,
            poster_path: dataMovies.poster_path,
            gender: dataMovies.genres
              ? dataMovies.genres.map((genre) => genre.name).join(", ")
              : "",
            providers: Object.keys(providers).reduce((acc, provider) => {
              if (dataProviders.results && dataProviders.results[provider]) {
                if (dataProviders.results[provider].flatrate) {
                  acc[provider] = dataProviders.results[provider].flatrate
                    .map((providerItem) => providerItem.provider_name)
                    .join(", ");
                } else {
                  acc[provider] = "";
                }

                if (dataProviders.results[provider].rent) {
                  acc[provider + "_rent"] = dataProviders.results[provider].rent
                    .map((providerItem) => providerItem.provider_name)
                    .join(", ");
                } else {
                  acc[provider + "_rent"] = "";
                }

                if (dataProviders.results[provider].ads) {
                  acc[provider + "_ads"] = dataProviders.results[provider].ads
                    .map((providerItem) => providerItem.provider_name)
                    .join(", ");
                } else {
                  acc[provider + "_ads"] = "";
                }

                if (dataProviders.results[provider].free) {
                  acc[provider + "_free"] = dataProviders.results[provider].free
                    .map((providerItem) => providerItem.provider_name)
                    .join(", ");
                } else {
                  acc[provider + "_free"] = "";
                }

                if (dataProviders.results[provider].buy) {
                  acc[provider + "_buy"] = dataProviders.results[provider].buy
                    .map((providerItem) => providerItem.provider_name)
                    .join(", ");
                } else {
                  acc[provider + "_buy"] = "";
                }
              }

              return acc;
            }, {}),
          });

        setIsLoading(false);
      });
  };

  let poster = "/callback.png";

  if (data.poster_path) {
    poster = "https://image.tmdb.org/t/p/original" + data.poster_path;
  }
  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    setMovieIdSearch(null); // Zera o ID do filme selecionado
    setResultSearchMovie([]); // Limpa os resultados da busca
    setTotals(""); // Zera os totais
    setData({}); // Limpa os dados do filme
    setError(""); // Limpa qualquer erro anterior
  };

  return (
    <>
      <ChakraProvider>
        <Head>
          <title>Onde está meu filme</title>
          <meta
            name="keywords"
            content="tvshow,watch,review, series, filmes"
          ></meta>
          <meta name="description" content="filmes, series,"></meta>
        </Head>
        <PageTitle
          title="Where Is My Movie?"
          isMobile={isMobile}
          showLoggedUser={true}
        />
        <div
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            wordBreak: "break-word",
          }}
        >
          <InputGroup>
            <Stack direction="row" spacing={2} align="center">
              <Input
                placeholder="Movie Name"
                value={movieSearchQuery}
                onChange={(e) => setMovieSearchQuery(e.target.value)}
              />
              <select
                id="country-select"
                onChange={handleCountryChange}
                value={selectedCountry}
                required
              >
                <option value="" disabled>
                  Select one conutry
                </option>
                {Object.entries(providers)
                  .sort((a, b) => a[1].localeCompare(b[1]))
                  .map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
              </select>
              <InputRightElement width="auto">
                <Button
                  colorScheme="purple"
                  onClick={() => {
                    if (selectedCountry) {
                      apiCall();
                    } else {
                      alert("Please, select one country.");
                    }
                  }}
                >
                  Go
                </Button>
              </InputRightElement>
            </Stack>
          </InputGroup>
          <Text>
            {totals === 0 ? (
              <>
                No Results: <strong>{movieSearchQuery}</strong> - Try Another
                Term!
              </>
            ) : (
              ""
            )}
          </Text>
          {totals > 0 ? (
            <Table>
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Title Original</Th>
                  <Th>Poster</Th>
                  <Th>Select</Th>
                </Tr>
              </Thead>

              <Tbody>
                {movieResultSearchMovie.map((movie) => (
                  <Tr key={movie.id}>
                    <Td>{movie.title}</Td>
                    <Td>{movie.original_title}</Td>
                    <Td>
                      {movie.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                          alt="Poster"
                          width="240"
                          height="360"
                        />
                      ) : (
                        <Image
                          src="/callback.png"
                          alt="Placeholder"
                          width="240"
                          height="360"
                        />
                      )}
                    </Td>

                    <Td>
                      <Checkbox
                        isChecked={movieIdSearch === movie.id}
                        onChange={() => {
                          setMovieIdSearch(movie.id);
                        }}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : null}
          {totals > 0 ? (
            <Button colorScheme="purple" onClick={fetchData}>
              Streamings
            </Button>
          ) : null}
        </div>
      </ChakraProvider>{" "}
      <span className={styles.title}>{data.originalTitle}</span>
      <br />
      <br />
      <div style={{ maxWidth: "480px", margin: "0 auto" }}></div>
      <br />
      <Box>
        {showAllTables ? (
          <Box></Box>
        ) : (
          <Box>
            {Object.keys(data).length > 0 && (
              <Box>
                {poster != null ? (
                  <Image
                    className={styles.card_image_big}
                    src={poster}
                    alt="poster"
                    width={480}
                    height={720}
                  />
                ) : (
                  <Image
                    className={styles.card_image_big}
                    src="/callback.png"
                    alt="poster"
                    width={480}
                    height={720}
                  />
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>
      {/* Tabela aqui para baixo */}
      <br />
      <div
        style={{ maxWidth: "480px", margin: "0 auto", wordBreak: "break-word" }}
      >
        {Object.keys(data).length > 0 && (
          <ChakraProvider>
            <br />
            <TableContainer p={4}>
              <Table size="sm">
                <Tbody>
                  <Tr>
                    <Th>Streaming:</Th>
                    <Td>
                      {data.providers && data.providers[selectedCountry]
                        ? data.providers[selectedCountry]
                        : "No service available in this country"}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>

            <TableContainer p={4}>
              <Table size="sm">
                <Tbody>
                  <Tr>
                    <Th>To Rent:</Th>
                    <Td>
                      {data.providers &&
                      data.providers[selectedCountry + "_rent"]
                        ? data.providers[selectedCountry + "_rent"]
                        : "No service available in this country"}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>

            <TableContainer p={4}>
              <Table size="sm">
                <Tbody>
                  <Tr>
                    <Th>Buy:</Th>
                    <Td>
                      {data.providers &&
                      data.providers[selectedCountry + "_buy"]
                        ? data.providers[selectedCountry + "_buy"]
                        : "No service available in this country"}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>

            <TableContainer p={4}>
              <Table size="sm">
                <Tbody>
                  <Tr>
                    <Th>Free With Ads:</Th>
                    <Td>
                      {data.providers &&
                      data.providers[selectedCountry + "_ads"]
                        ? data.providers[selectedCountry + "_ads"]
                        : "No service available in this country"}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>

            <TableContainer p={4}>
              <Table size="sm">
                <Tbody>
                  <Tr>
                    <Th>Free:</Th>
                    <Td>
                      {data.providers &&
                      data.providers[selectedCountry + "_free"]
                        ? data.providers[selectedCountry + "_free"]
                        : "No service available in this country"}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </ChakraProvider>
        )}
        <div />
        {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
      </div>
    </>
  );
};

export default MoviePage;
