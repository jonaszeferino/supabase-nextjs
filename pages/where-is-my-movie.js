import { useState } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import {
  ChakraProvider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Box,
  Center,
  Spinner,
  Button,
  Select,
} from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import Head from "next/head";
import PageTitle from "../components/PageTitle";

const MoviePage = () => {
  const [data, setData] = useState({ providers: {} });
  const [isLoading, setIsLoading] = useState(false);
  const [movieIdSearch, setMovieIdSearch] = useState(null);
  const [totals, setTotals] = useState("");
  const [movieSearchQuery, setMovieSearchQuery] = useState("");
  const [movieResultSearchMovie, setResultSearchMovie] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const { showBackToTopButton, scrollToTop } = useBackToTopButton();

  const providers = {
    AF: "Afghanistan",
    AX: "Aland Islands",
    AL: "Albania",
    DZ: "Algeria",
    AS: "American Samoa",
    AD: "Andorra",
    AO: "Angola",
    AI: "Anguilla",
    AQ: "Antarctica",
    AG: "Antigua and Barbuda",
    AR: "Argentina",
    AM: "Armenia",
    AW: "Aruba",
    AU: "Australia",
    AT: "Austria",
    AZ: "Azerbaijan",
    BS: "Bahamas",
    BH: "Bahrain",
    BD: "Bangladesh",
    BB: "Barbados",
    BY: "Belarus",
    BE: "Belgium",
    BZ: "Belize",
    BJ: "Benin",
    BM: "Bermuda",
    BT: "Bhutan",
    BO: "Bolivia",
    BQ: "Bonaire, Sint Eustatius and Saba",
    BA: "Bosnia and Herzegovina",
    BW: "Botswana",
    BV: "Bouvet Island",
    BR: "Brazil",
    IO: "British Indian Ocean Territory",
    BN: "Brunei Darussalam",
    BG: "Bulgaria",
    BF: "Burkina Faso",
    BI: "Burundi",
    CV: "Cabo Verde",
    KH: "Cambodia",
    CM: "Cameroon",
    CA: "Canada",
    KY: "Cayman Islands",
    CF: "Central African Republic",
    TD: "Chad",
    CL: "Chile",
    CN: "China",
    CX: "Christmas Island",
    CC: "Cocos (Keeling) Islands",
    CO: "Colombia",
    KM: "Comoros",
    CG: "Congo",
    CD: "Congo (Democratic Republic of the)",
    CK: "Cook Islands",
    CR: "Costa Rica",
    CI: "Côte d'Ivoire",
    HR: "Croatia",
    CU: "Cuba",
    CW: "Curaçao",
    CY: "Cyprus",
    CZ: "Czechia",
    DK: "Denmark",
    DJ: "Djibouti",
    DM: "Dominica",
    DO: "Dominican Republic",
    EC: "Ecuador",
    EG: "Egypt",
    SV: "El Salvador",
    GQ: "Equatorial Guinea",
    ER: "Eritrea",
    EE: "Estonia",
    SZ: "Eswatini",
    ET: "Ethiopia",
    FK: "Falkland Islands (Malvinas)",
    FO: "Faroe Islands",
    FJ: "Fiji",
    FI: "Finland",
    FR: "France",
    GF: "French Guiana",
    PF: "French Polynesia",
    TF: "French Southern Territories",
    GA: "Gabon",
    GM: "Gambia",
    GE: "Georgia",
    DE: "Germany",
    GH: "Ghana",
    GI: "Gibraltar",
    GR: "Greece",
    GL: "Greenland",
    GD: "Grenada",
    GP: "Guadeloupe",
    GU: "Guam",
    GT: "Guatemala",
    GG: "Guernsey",
    GN: "Guinea",
    GW: "Guinea-Bissau",
    GY: "Guyana",
    HT: "Haiti",
    HM: "Heard Island and McDonald Islands",
    VA: "Holy See",
    HN: "Honduras",
    HK: "Hong Kong",
    HU: "Hungary",
    IS: "Iceland",
    IN: "India",
    ID: "Indonesia",
    IR: "Iran (Islamic Republic of)",
    IQ: "Iraq",
    IE: "Ireland",
    IM: "Isle of Man",
    IL: "Israel",
    IT: "Italy",
    JM: "Jamaica",
    JP: "Japan",
    JE: "Jersey",
    JO: "Jordan",
    KZ: "Kazakhstan",
    KE: "Kenya",
    KI: "Kiribati",
    KP: "Korea (Democratic People's Republic of)",
    KR: "Korea (Republic of)",
    KW: "Kuwait",
    KG: "Kyrgyzstan",
    LA: "Lao People's Democratic Republic",
    LV: "Latvia",
    LB: "Lebanon",
    LS: "Lesotho",
    LR: "Liberia",
    LY: "Libya",
    LI: "Liechtenstein",
    LT: "Lithuania",
    LU: "Luxembourg",
    MO: "Macao",
    MG: "Madagascar",
    MW: "Malawi",
    MY: "Malaysia",
    MV: "Maldives",
    ML: "Mali",
    MT: "Malta",
    MH: "Marshall Islands",
    MQ: "Martinique",
    MR: "Mauritania",
    MU: "Mauritius",
    YT: "Mayotte",
    MX: "Mexico",
    FM: "Micronesia (Federated States of)",
    MD: "Moldova (Republic of)",
    MC: "Monaco",
    MN: "Mongolia",
    ME: "Montenegro",
    MS: "Montserrat",
    MA: "Morocco",
    MZ: "Mozambique",
    MM: "Myanmar",
    NA: "Namibia",
    NR: "Nauru",
    NP: "Nepal",
    NL: "Netherlands",
    NC: "New Caledonia",
    NZ: "New Zealand",
    NI: "Nicaragua",
    NE: "Niger",
    NG: "Nigeria",
    NU: "Niue",
    NF: "Norfolk Island",
    MK: "North Macedonia",
    MP: "Northern Mariana Islands",
    NO: "Norway",
    OM: "Oman",
    PK: "Pakistan",
    PW: "Palau",
    PS: "Palestine, State of",
    PA: "Panama",
    PG: "Papua New Guinea",
    PY: "Paraguay",
    PE: "Peru",
    PH: "Philippines",
    PN: "Pitcairn",
    PL: "Poland",
    PT: "Portugal",
    PR: "Puerto Rico",
    QA: "Qatar",
    RO: "Romania",
    RU: "Russian Federation",
    RW: "Rwanda",
    RE: "Réunion",
    BL: "Saint Barthélemy",
    SH: "Saint Helena, Ascension and Tristan da Cunha",
    KN: "Saint Kitts and Nevis",
    LC: "Saint Lucia",
    MF: "Saint Martin (French part)",
    PM: "Saint Pierre and Miquelon",
    VC: "Saint Vincent and the Grenadines",
    WS: "Samoa",
    SM: "San Marino",
    ST: "Sao Tome and Principe",
    SA: "Saudi Arabia",
    SN: "Senegal",
    RS: "Serbia",
    SC: "Seychelles",
    SL: "Sierra Leone",
    SG: "Singapore",
    SX: "Sint Maarten (Dutch part)",
    SK: "Slovakia",
    SI: "Slovenia",
    SB: "Solomon Islands",
    SO: "Somalia",
    ZA: "South Africa",
    GS: "South Georgia and the South Sandwich Islands",
    SS: "South Sudan",
    ES: "Spain",
    LK: "Sri Lanka",
    SD: "Sudan",
    SR: "Suriname",
    SE: "Sweden",
    CH: "Switzerland",
    SY: "Syrian Arab Republic",
    TW: "Taiwan",
    TJ: "Tajikistan",
    TZ: "Tanzania",
    TH: "Thailand",
    TL: "Timor-Leste",
    TG: "Togo",
    TK: "Tokelau",
    TO: "Tonga",
    TT: "Trinidad and Tobago",
    TN: "Tunisia",
    TR: "Turkey",
    TM: "Turkmenistan",
    TC: "Turks and Caicos Islands",
    TV: "Tuvalu",
    UG: "Uganda",
    UA: "Ukraine",
    AE: "United Arab Emirates",
    GB: "United Kingdom",
    US: "United States",
    UM: "United States Minor Outlying Islands",
    UY: "Uruguay",
    UZ: "Uzbekistan",
    VU: "Vanuatu",
    VE: "Venezuela",
    VN: "Viet Nam",
    VG: "Virgin Islands (British)",
    VI: "Virgin Islands (U.S.)",
    WF: "Wallis and Futuna",
    EH: "Western Sahara",
    YE: "Yemen",
    ZM: "Zambia",
    ZW: "Zimbabwe",
  };

  const apiCall = () => {
    setIsLoading(true);
    const url = `https://api.themoviedb.org/3/search/movie?query=${movieSearchQuery}&include_adult=false`;

    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Invalid Data");
        }
      })
      .then((result) => {
        setResultSearchMovie(result.results);
        setTotals(result.total_results);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const fetchData = (movieId) => {
    setIsLoading(true);
    Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
        }
      }), 
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
          },
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
        setResultSearchMovie([]);
        setIsLoading(false);
      });
  };

  const getFilteredProviders = () => {
    return Object.entries(data.providers)
      .filter(([countryCode]) =>
        selectedCountry === "All" ? true : countryCode === selectedCountry
      )
      .flatMap(([countryCode, providerData]) =>
        ["flatrate", "rent", "buy", "ads", "free"]
          .filter((category) =>
            selectedType === "All" ? true : category === selectedType
          )
          .flatMap((category) =>
            providerData?.[category]?.map((provider) => ({
              country: providers[countryCode] || countryCode,
              type:
                category.charAt(0).toUpperCase() + category.slice(1) ===
                "Flatrate"
                  ? "Subscription"
                  : category.charAt(0).toUpperCase() + category.slice(1),
              providerName: provider.provider_name,
              logoPath: provider.logo_path,
            })) || []
          )
      );
  };

  const poster =
    data.poster_path &&
    `https://image.tmdb.org/t/p/original${data.poster_path}`;

  return (
    <>
      <ChakraProvider>
        <Head>
          <title>Where is my movie</title>
          <meta name="keywords" content="tvshow,watch,review,series,filmes" />
          <meta name="description" content="filmes,series" />
        </Head>
        <PageTitle title="Where Is My Movie?" />
        {movieIdSearch && data.originalTitle && !isLoading && (
          <Box textAlign="center" my={4}>
            <Center>
              <Image
                src={poster || "/callback.png"}
                alt={data.originalTitle}
                width={300}
                height={450}
                style={{ borderRadius: "10px" }}
              />
            </Center>
            <Text mt={2} fontSize="4xl" fontWeight="bold">
              {data.originalTitle}
            </Text>
            <Text>{data.gender}</Text>
          </Box>
        )}
        <div style={{ maxWidth: "500px", margin: "0 auto", wordBreak: "break-word" }}>
          <InputGroup>
            <Input
              placeholder="Movie Name"
              value={movieSearchQuery}
              onChange={(e) => setMovieSearchQuery(e.target.value)}
            />
            <InputRightElement width="auto">
              <Button colorScheme="purple" onClick={apiCall}>
                Search
              </Button>
            </InputRightElement>
          </InputGroup>
          <br/>
          <Text>
            {totals === 0 && !isLoading ? (
              <>
                No Results: <strong>{movieSearchQuery}</strong> - Try Another
                Term!
              </>
            ) : null}
          </Text>
          {isLoading && <Center><Spinner size="lg" color="purple.500" /></Center>}
          {!isLoading && movieResultSearchMovie.length > 0 && (
            <Table>
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Original Title</Th>
                  <Th>Poster</Th>
                </Tr>
              </Thead>
              <Tbody>
                {movieResultSearchMovie.map((movie) => (
                  <Tr
                    key={movie.id}
                    onClick={() => {
                      setMovieIdSearch(movie.id);
                      fetchData(movie.id);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Td>{movie.title}</Td>
                    <Td>{movie.original_title}</Td>
                    <Td>
                      {movie.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                          alt="Poster"
                          width={240}
                          height={360}
                        />
                      ) : (
                        <Image
                          src="/callback.png"
                          alt="Placeholder"
                          width={240}
                          height={360}
                        />
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </div>
        {Object.keys(data.providers).length > 0 && (
          <>
            <Box display="flex" justifyContent="space-between" mb={4}>
              <Select
                placeholder="Filter by Country"
                onChange={(e) => setSelectedCountry(e.target.value)}
                width="48%"
              >
                <option value="All">All</option>
                {Object.keys(providers).map((code) => (
                  <option key={code} value={code}>
                    {providers[code]}
                  </option>
                ))}
              </Select>
              <Select
                placeholder="Filter by Type"
                onChange={(e) => setSelectedType(e.target.value)}
                width="48%"
              >
                <option value="All">All</option>
                <option value="flatrate">Subscription</option>
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
                <option value="ads">Free with Ads</option>
                <option value="free">Free</option>
              </Select>
            </Box>
            <Table>
              <Thead>
                <Tr>
                  <Th>Country</Th>
                  <Th>Type</Th>
                  <Th>Streaming</Th>
                </Tr>
              </Thead>
              <Tbody>
                {getFilteredProviders().map((provider, index) => (
                  <Tr key={index}>
                    <Td>{provider.country}</Td>
                    <Td>{provider.type}</Td>
                    <Td>
                      {provider.logoPath ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w92${provider.logoPath}`}
                          alt={provider.providerName}
                          width={70}
                          height={70}
                        />
                      ) : (
                        provider.providerName
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        )}
        {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
      </ChakraProvider>
    </>
  );
};

export default MoviePage;
