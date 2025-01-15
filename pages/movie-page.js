import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  ChakraProvider,
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Stack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import Head from "next/head";
import PageTitle from "../components/PageTitle";

const MoviePage = () => {
  const router = useRouter();
  const [data, setData] = useState({ providers: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("US");
  const [movieIdSearch, setMovieIdSearch] = useState(null);
  const [totals, setTotals] = useState("");
  const [movieSearchQuery, setMovieSearchQuery] = useState("");
  const [movieResultSearchMovie, setResultSearchMovie] = useState([]);
  const { showBackToTopButton, scrollToTop } = useBackToTopButton();
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  // Lista de provedores (código do país para nome)
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
    const url = `https://api.themoviedb.org/3/search/movie?query=${movieSearchQuery}&include_adult=false`;

    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setResultSearchMovie(result.results);
        setTotals(result.total_results);
      })
      .catch((error) => console.error(error));
  };

  const fetchData = () => {
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
        setData({
          budget: dataMovies.budget,
          originalTitle: dataMovies.original_title,
          poster_path: dataMovies.poster_path,
          gender: dataMovies.genres
            ? dataMovies.genres.map((genre) => genre.name).join(", ")
            : "N/A",
          providers: dataProviders.results || {},
        });
      });
  };

  let poster = "/callback.png";
  if (data.poster_path) {
    poster = `https://image.tmdb.org/t/p/original${data.poster_path}`;
  }

  return (
    <ChakraProvider>
      <Head>
        <title>Onde está meu filme</title>
      </Head>
      <PageTitle title="Where Is My Movie?" isMobile={isMobile} />
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <InputGroup>
          <Stack direction="row" spacing={2} align="center">
            <Input
              placeholder="Movie Name"
              value={movieSearchQuery}
              onChange={(e) => setMovieSearchQuery(e.target.value)}
            />
            <InputRightElement>
              <Button colorScheme="purple" onClick={apiCall}>
                Go
              </Button>
            </InputRightElement>
          </Stack>
        </InputGroup>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Country</Th>
                <Th>Type</Th>
                <Th>Streaming</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(data.providers)
                .sort(([a], [b]) => providers[a]?.localeCompare(providers[b]))
                .map(([countryCode, providerData]) =>
                  ["flatrate", "rent", "buy", "ads", "free"].flatMap(
                    (category) =>
                      providerData[category]?.map((provider) => (
                        <Tr key={`${countryCode}-${category}-${provider.provider_id}`}>
                          <Td>{providers[countryCode] || countryCode}</Td>
                          <Td>{category}</Td>
                          <Td>{provider.provider_name}</Td>
                        </Tr>
                      )) || []
                  )
                )}
            </Tbody>
          </Table>
        </TableContainer>
      </div>
      {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
    </ChakraProvider>
  );
};

export default MoviePage;
