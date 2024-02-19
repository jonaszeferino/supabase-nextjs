import React, { useEffect, useState, useRef, useCallback } from "react";

import styles from "../styles/Home.module.css";
import ErrorPage from "./error-page";
import Image from "next/image";
import Head from "next/head";
import {
  ChakraProvider,
  Progress,
  Select,
  FormLabel,
  Button,
  FormControl,
  Flex,
  Box,
  Center,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Tag,
  HStack,
  Spinner,
  useMediaQuery
} from "@chakra-ui/react";
import useBackToTopButton from "../components/backToTopButtonLogic";
import BackToTopButton from "../components/backToTopButton";
import LoggedUser from "../components/LoggedUser";
import { Tooltip } from "antd";
import Link from "next/link";
import { Divider, Rate } from "antd";
import PageTitle from "../components/PageTitle";

export default function Discovery() {
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  let [searchMovies, setSearchMovies] = useState([]);
  let [page, setPage] = useState(1);
  let [searchMovieTotalPages, setSearchMovieTotalPages] = useState("");
  let [searchMovieRealPage, setSearchMovieRealPage] = useState("");
  let [searchMovieTotalResults, setSearchMovieTotalResults] = useState("");

  let [isError, setError] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  const { showBackToTopButton, scrollToTop } = useBackToTopButton();

  const btnRef = useRef();
  const [genres, setGenres] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [searchFilters, setSearchFilters] = useState({
    voteCount: 1000,
    ratingSort: "vote_average.desc",
    releaseDateFrom: 1900,
    releaseDateTo: 2025,
    with_origin_country: "All",
    category: "All",
  });

  let urlString =
    `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US` +
    `&primary_release_date.gte=` +
    searchFilters.releaseDateFrom +
    `-01-01` +
    `&primary_release_date.lte=` +
    searchFilters.releaseDateTo +
    `-12-31` +
    `&sort_by=` +
    searchFilters.ratingSort +
    `&vote_count.gte=` +
    searchFilters.voteCount;

  if (searchFilters.with_origin_country !== "All") {
    urlString += "&with_origin_country=" + searchFilters.with_origin_country;
  }

  if (searchFilters.category !== "All") {
    urlString += "&with_genres=" + searchFilters.category;
  }

  const apiCall = useCallback((currentPage) => {
    const url = urlString + "&page=" + currentPage;

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
          throw new Error("Wrong Data");
        }
      })
      .then(
        (result) => (
          setSearchMovies(result.results),
          setSearchMovieTotalPages(result.total_pages),
          setSearchMovieRealPage(result.page),
          setSearchMovieTotalResults(result.total_results),
          setPage(result.page),
          setIsLoading(false)
        )
      )
      .catch((error) => setError(true));
  }, [urlString, setIsLoading, setPage]);

  const nextPage = (event) => {
    setPage(page + 1), apiCall(page + 1);
  };

  const previousPage = (event) => {
    setPage(page - 1), apiCall(page - 1);
  };

  useEffect(() => {
    setPage(1);
  }, [searchFilters]);

  useEffect(() => {
    apiCall(page);
  }, [page, apiCall]);

  let totalPages = searchMovieTotalPages;
  let currentPage = searchMovieRealPage;
  let totalResults = searchMovieTotalResults;

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

  const options = [
    { value: "AL", label: "Albania" },
    { value: "DZ", label: "Algeria" },
    { value: "AS", label: "American Samoa" },
    { value: "AD", label: "Andorra" },
    { value: "AO", label: "Angola" },
    { value: "AQ", label: "Antarctica" },
    { value: "AG", label: "Antigua and Barbuda" },
    { value: "AR", label: "Argentina" },
    { value: "AM", label: "Armenia" },
    { value: "AW", label: "Aruba" },
    { value: "AU", label: "Australia" },
    { value: "AT", label: "Austria" },
    { value: "AZ", label: "Azerbaijan" },
    { value: "BS", label: "Bahamas" },
    { value: "BH", label: "Bahrain" },
    { value: "BD", label: "Bangladesh" },
    { value: "BB", label: "Barbados" },
    { value: "BY", label: "Belarus" },
    { value: "BE", label: "Belgium" },
    { value: "BZ", label: "Belize" },
    { value: "BJ", label: "Benin" },
    { value: "BM", label: "Bermuda" },
    { value: "BT", label: "Bhutan" },
    { value: "BO", label: "Bolivia" },
    { value: "BA", label: "Bosnia and Herzegovina" },
    { value: "BW", label: "Botswana" },
    { value: "BV", label: "Bouvet Island" },
    { value: "BR", label: "Brazil" },
    { value: "IO", label: "British Indian Ocean Territory" },
    { value: "BN", label: "Brunei" },
    { value: "BG", label: "Bulgaria" },
    { value: "BF", label: "Burkina Faso" },
    { value: "BI", label: "Burundi" },
    { value: "KH", label: "Cambodia" },
    { value: "CM", label: "Cameroon" },
    { value: "CA", label: "Canada" },
    { value: "CV", label: "Cape Verde" },
    { value: "KY", label: "Cayman Islands" },
    { value: "CF", label: "Central African Republic" },
    { value: "TD", label: "Chad" },
    { value: "CL", label: "Chile" },
    { value: "CN", label: "China" },
    { value: "CX", label: "Christmas Island" },
    { value: "CC", label: "Cocos (Keeling) Islands" },
    { value: "CO", label: "Colombia" },
    { value: "KM", label: "Comoros" },
    { value: "CG", label: "Congo" },
    { value: "CD", label: "Democratic Republic of the Congo" },
    { value: "CK", label: "Cook Islands" },
    { value: "CR", label: "Costa Rica" },
    { value: "CI", label: "Ivory Coast" },
    { value: "HR", label: "Croatia" },
    { value: "CU", label: "Cuba" },
    { value: "CY", label: "Cyprus" },
    { value: "CZ", label: "Czech Republic" },
    { value: "DK", label: "Denmark" },
    { value: "DJ", label: "Djibouti" },
    { value: "DM", label: "Dominica" },
    { value: "DO", label: "Dominican Republic" },
    { value: "EC", label: "Ecuador" },
    { value: "EG", label: "Egypt" },
    { value: "SV", label: "El Salvador" },
    { value: "GQ", label: "Equatorial Guinea" },
    { value: "ER", label: "Eritrea" },
    { value: "EE", label: "Estonia" },
    { value: "ET", label: "Ethiopia" },
    { value: "FK", label: "Falkland Islands" },
    { value: "FO", label: "Faroe Islands" },
    { value: "FJ", label: "Fiji" },
    { value: "FI", label: "Finland" },
    { value: "FR", label: "France" },
    { value: "GF", label: "French Guiana" },
    { value: "PF", label: "French Polynesia" },
    { value: "TF", label: "French Southern Territories" },
    { value: "GA", label: "Gabon" },
    { value: "GM", label: "Gambia" },
    { value: "GE", label: "Georgia" },
    { value: "DE", label: "Germany" },
    { value: "GH", label: "Ghana" },
    { value: "GI", label: "Gibraltar" },
    { value: "GR", label: "Greece" },
    { value: "GL", label: "Greenland" },
    { value: "GD", label: "Grenada" },
    { value: "GP", label: "Guadeloupe" },
    { value: "GU", label: "Guam" },
    { value: "GT", label: "Guatemala" },
    { value: "GG", label: "Guernsey" },
    { value: "GN", label: "Guinea" },
    { value: "GW", label: "Guinea-Bissau" },
    { value: "GY", label: "Guyana" },
    { value: "HT", label: "Haiti" },
    { value: "HM", label: "Heard Island and McDonald Islands" },
    { value: "VA", label: "Vatican City" },
    { value: "HN", label: "Honduras" },
    { value: "HK", label: "Hong Kong" },
    { value: "HU", label: "Hungary" },
    { value: "IS", label: "Iceland" },
    { value: "IN", label: "India" },
    { value: "ID", label: "Indonesia" },
    { value: "IR", label: "Iran" },
    { value: "IQ", label: "Iraq" },
    { value: "IE", label: "Ireland" },
    { value: "IM", label: "Isle of Man" },
    { value: "IL", label: "Israel" },
    { value: "IT", label: "Italy" },
    { value: "JM", label: "Jamaica" },
    { value: "JP", label: "Japan" },
    { value: "JE", label: "Jersey" },
    { value: "JO", label: "Jordan" },
    { value: "KZ", label: "Kazakhstan" },
    { value: "KE", label: "Kenya" },
    { value: "KI", label: "Kiribati" },
    { value: "KP", label: "North Korea" },
    { value: "KR", label: "South Korea" },
    { value: "KW", label: "Kuwait" },
    { value: "KG", label: "Kyrgyzstan" },
    { value: "LA", label: "Laos" },
    { value: "LV", label: "Latvia" },
    { value: "LB", label: "Lebanon" },
    { value: "LS", label: "Lesotho" },
    { value: "LR", label: "Liberia" },
    { value: "LY", label: "Libya" },
    { value: "LI", label: "Liechtenstein" },
    { value: "LT", label: "Lithuania" },
    { value: "LU", label: "Luxembourg" },
    { value: "MO", label: "Macao" },
    { value: "MK", label: "North Macedonia" },
    { value: "MG", label: "Madagascar" },
    { value: "MW", label: "Malawi" },
    { value: "MY", label: "Malaysia" },
    { value: "MV", label: "Maldives" },
    { value: "ML", label: "Mali" },
    { value: "MT", label: "Malta" },
    { value: "MH", label: "Marshall Islands" },
    { value: "MQ", label: "Martinique" },
    { value: "MR", label: "Mauritania" },
    { value: "MU", label: "Mauritius" },
    { value: "YT", label: "Mayotte" },
    { value: "MX", label: "Mexico" },
    { value: "FM", label: "Micronesia" },
    { value: "MD", label: "Moldova" },
    { value: "MC", label: "Monaco" },
    { value: "MN", label: "Mongolia" },
    { value: "ME", label: "Montenegro" },
    { value: "MS", label: "Montserrat" },
    { value: "MA", label: "Morocco" },
    { value: "MZ", label: "Mozambique" },
    { value: "MM", label: "Myanmar (Burma)" },
    { value: "NA", label: "Namibia" },
    { value: "NR", label: "Nauru" },
    { value: "NP", label: "Nepal" },
    { value: "NL", label: "Netherlands" },
    { value: "NC", label: "New Caledonia" },
    { value: "NZ", label: "New Zealand" },
    { value: "NI", label: "Nicaragua" },
    { value: "NE", label: "Niger" },
    { value: "NG", label: "Nigeria" },
    { value: "NU", label: "Niue" },
    { value: "NF", label: "Norfolk Island" },
    { value: "MP", label: "Northern Mariana Islands" },
    { value: "NO", label: "Norway" },
    { value: "OM", label: "Oman" },
    { value: "PK", label: "Pakistan" },
    { value: "PW", label: "Palau" },
    { value: "PS", label: "Palestinian Territories" },
    { value: "PA", label: "Panama" },
    { value: "PG", label: "Papua New Guinea" },
    { value: "PY", label: "Paraguay" },
    { value: "PE", label: "Peru" },
    { value: "PH", label: "Philippines" },
    { value: "PN", label: "Pitcairn Islands" },
    { value: "PL", label: "Poland" },
    { value: "PT", label: "Portugal" },
    { value: "PR", label: "Puerto Rico" },
    { value: "QA", label: "Qatar" },
    { value: "RE", label: "Réunion" },
    { value: "RO", label: "Romania" },
    { value: "RU", label: "Russia" },
    { value: "RW", label: "Rwanda" },
    { value: "SH", label: "Saint Helena" },
    { value: "KN", label: "Saint Kitts and Nevis" },
    { value: "LC", label: "Saint Lucia" },
    { value: "PM", label: "Saint Pierre and Miquelon" },
    { value: "VC", label: "Saint Vincent and the Grenadines" },
    { value: "WS", label: "Samoa" },
    { value: "SM", label: "San Marino" },
    { value: "ST", label: "São Tomé and Príncipe" },
    { value: "SA", label: "Saudi Arabia" },
    { value: "SN", label: "Senegal" },
    { value: "RS", label: "Serbia" },
    { value: "SC", label: "Seychelles" },
    { value: "SL", label: "Sierra Leone" },
    { value: "SG", label: "Singapore" },
    { value: "SX", label: "Sint Maarten" },
    { value: "SK", label: "Slovakia" },
    { value: "SI", label: "Slovenia" },
    { value: "SB", label: "Solomon Islands" },
    { value: "SO", label: "Somalia" },
    { value: "ZA", label: "South Africa" },
    { value: "GS", label: "South Georgia and the South Sandwich Islands" },
    { value: "SS", label: "South Sudan" },
    { value: "ES", label: "Spain" },
    { value: "LK", label: "Sri Lanka" },
    { value: "SD", label: "Sudan" },
    { value: "SR", label: "Suriname" },
    { value: "SJ", label: "Svalbard and Jan Mayen (Norway)" },
    { value: "SZ", label: "Swaziland" },
    { value: "SE", label: "Sweden" },
    { value: "CH", label: "Switzerland" },
    { value: "SY", label: "Syria" },
    { value: "TW", label: "Taiwan" },
    { value: "TJ", label: "Tajikistan" },
    { value: "TZ", label: "Tanzania" },
    { value: "TH", label: "Thailand" },
    { value: "TL", label: "Timor-Leste" },
    { value: "TG", label: "Togo" },
    { value: "TK", label: "Tokelau" },
    { value: "TO", label: "Tonga" },
    { value: "TT", label: "Trinidad and Tobago" },
    { value: "TN", label: "Tunisia" },
    { value: "TR", label: "Turkey" },
    { value: "TM", label: "Turkmenistan" },
    { value: "TC", label: "Turks and Caicos Islands" },
    { value: "TV", label: "Tuvalu" },
    { value: "UG", label: "Uganda" },
    { value: "UA", label: "Ukraine" },
    { value: "AE", label: "United Arab Emirates" },
    { value: "GB", label: "United Kingdom" },
    { value: "US", label: "United States of America" },
    { value: "UM", label: "United States Minor Outlying Islands" },
    { value: "UY", label: "Uruguay" },
    { value: "UZ", label: "Uzbekistan" },
    { value: "VU", label: "Vanuatu" },
    { value: "VE", label: "Venezuela" },
    { value: "VN", label: "Vietnam" },
    { value: "VG", label: "British Virgin Islands" },
    { value: "VI", label: "U.S. Virgin Islands" },
    { value: "WF", label: "Wallis and Futuna" },
    { value: "EH", label: "Western Sahara" },
    { value: "YE", label: "Yemen" },
    { value: "ZM", label: "Zambia" },
    { value: "ZW", label: "Zimbabwe" },
  ];

  function generateOptions(startYear, endYear) {
    return Array.from({ length: endYear - startYear + 1 }, (_, index) => (
      <option key={index} value={startYear + index}>
        {startYear + index}
      </option>
    ));
  }

  const optionsFrom = generateOptions(1900, 2023);
  const optionsTo = generateOptions(1901, 2025);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/genre/list",
          {
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: process.env.NEXT_PUBLIC_TMDB_BEARER,
            }),
          }
        );
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const selectedFiltersTags = [
    {
      label: `Vote: +${searchFilters.voteCount}`,
      colorScheme: "blue",
    },
    {
      label: `Order: ${searchFilters.ratingSort === "vote_average.desc" ? "Desc" : "Asc"
        }`,
      colorScheme: "green",
    },
    {
      label: `Year: ${searchFilters.releaseDateFrom}-${searchFilters.releaseDateTo}`,
      colorScheme: "red",
    },
    {
      label: `Country: ${searchFilters.with_origin_country}`,
      colorScheme: "yellow",
    },
    {
      label: `Category: ${genres.find(
        (genre) => genre.id === parseInt(searchFilters.category, 10)
      )?.name || "All"
        }`,
      colorScheme: "gray",
    },
  ];

  return (
    <>
      <Head>
        <title>Discover Movies</title>
        <meta name="keywords" content="movies,filmes,watch,review"></meta>
        <meta name="description" content="encontre tudo"></meta>
      </Head>
      <div>


      <PageTitle
          title="Discover Movies"
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
              <HStack>
                {selectedFiltersTags.map((tag, index) => (
                  <Tag key={index} colorScheme={tag.colorScheme}>
                    {tag.label}
                  </Tag>
                ))}
              </HStack>

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
                    <FormLabel htmlFor="ordenation">Order By</FormLabel>
                    <Select
                      id="ordenation"
                      placeholder="Ordenation"
                      type="text"
                      isRequired={true}
                      value={searchFilters.ratingSort}
                      onChange={(event) =>
                        setSearchFilters({
                          ...searchFilters,
                          ratingSort: event.target.value,
                        })
                      }
                    >
                      <option value="vote_average.asc">
                        From Worst Rating to Best
                      </option>
                      <option value="vote_average.desc">
                        From Best Rating to Worst
                      </option>
                    </Select>

                    <br />

                    <FormLabel>Minimum Vote Count</FormLabel>

                    <Select
                      id="votes"
                      placeholder="Number of Votes"
                      type="number"
                      isRequired={true}
                      value={searchFilters.voteCount}
                      onChange={(event) =>
                        setSearchFilters({
                          ...searchFilters,
                          voteCount: event.target.value,
                        })
                      }
                    >
                      <option value="0">0 Votes</option>
                      <option value="50">More than 50</option>
                      <option value="100">More than 100</option>
                      <option value="200">More than 200</option>
                      <option value="500">More than 500</option>
                      <option value="1000">More than 1000</option>
                      <option value="5000">More than 5000</option>
                    </Select>

                    <br />

                    <FormControl>
                      <Center>
                        <FormLabel>Initial and Final Year:</FormLabel>
                      </Center>

                      <Flex align="center">
                        <Select
                          value={searchFilters.releaseDateFrom}
                          onChange={(event) =>
                            setSearchFilters({
                              ...searchFilters,
                              releaseDateFrom: event.target.value,
                            })
                          }
                        >
                          {optionsFrom}
                        </Select>
                        <Box w="20px" />
                        <Select
                          value={searchFilters.releaseDateTo}
                          onChange={(event) =>
                            setSearchFilters({
                              ...searchFilters,
                              releaseDateTo: event.target.value,
                            })
                          }
                        >
                          {optionsTo}
                        </Select>
                      </Flex>
                    </FormControl>

                    <br />

                    <FormLabel htmlFor="origin_country">
                      Country of Origin
                    </FormLabel>

                    <Select
                      id="origin_country"
                      placeholder="Select Country"
                      value={searchFilters.with_origin_country}
                      onChange={(event) =>
                        setSearchFilters({
                          ...searchFilters,
                          with_origin_country: event.target.value,
                        })
                      }
                    >
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>

                    <br />

                    <FormLabel htmlFor="movieCategory">
                      Movie Category
                    </FormLabel>
                    <Select
                      id="movieCategory"
                      placeholder="Select Category"
                      value={searchFilters.category}
                      onChange={(event) =>
                        setSearchFilters({
                          ...searchFilters,
                          category: event.target.value,
                        })
                      }
                    >
                      {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                          {genre.name}
                        </option>
                      ))}
                    </Select>
                    <br />
                    <Center>
                      <Button
                        size="lg"
                        colorScheme="purple"
                        onClick={() => apiCall(page)}
                      >
                        Go
                      </Button>
                    </Center>
                  </DrawerBody>

                  <DrawerFooter></DrawerFooter>
                </DrawerContent>
              </Drawer>
            </ChakraProvider>
          </div>
        </div>
        <br />
        <ChakraProvider>{isLoading && <Spinner />}</ChakraProvider>

        <br />

        {!searchMovies ? (
          <div>
            <button
              onClick={previousPage}
              disabled={page <= 1}
              className={styles.card}
            >
              Back
            </button>
            <button
              onClick={nextPage}
              disabled={page >= totalPages}
              className={styles.card}
            >
              Next
            </button>
          </div>
        ) : (
          ""
        )}
        <span className={styles.spantext}>
          {isLoading ? (
            <ChakraProvider>
              <Progress size="xs" isIndeterminate />{" "}
            </ChakraProvider>
          ) : null}
        </span>
        {isError === true ? (
          <ErrorPage message={`Verifique as Credenciais`}></ErrorPage>
        ) : (
          <div className={styles.grid}>
            {searchMovies.map((search) => (
              <div key={search.id} style={{ marginBottom: "10px" }}>
                <ChakraProvider>
                  <Link
                    href={{
                      pathname: "/movie-page",
                      query: { movieId: search.id },
                    }}
                  >
                    <Tooltip
                      title="More"
                      style={{
                        color: "white",
                        borderColor: "purple",
                        background: "purple",
                      }}
                    >
                      <Image
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
                    </Tooltip>
                  </Link>
                </ChakraProvider>

                <div style={{ maxWidth: "240px", margin: "10px" }}>
                  <ChakraProvider>
                    <Progress
                      size="lg"
                      value={search.vote_average}
                      max={10}
                      colorScheme={getProgressColor(search.vote_average)}
                    />
                    {search.vote_average} <Rate value={1} count={1} />
                  </ChakraProvider>
                </div>
                <br />
              </div>
            ))}
          </div>
        )}

        <span className={styles.spantext}>
          {!searchMovies ? (
            <div>
              <button
                onClick={previousPage}
                disabled={page <= 1}
                className={styles.card}
              >
                Back
              </button>
              <button
                onClick={nextPage}
                disabled={page >= totalPages}
                className={styles.card}
              >
                Next
              </button>
            </div>
          ) : (
            ""
          )}
          <br />
          {!searchMovies ? (
            <div>
              <span className={styles.spantext}>Total Pages {totalPages} </span>{" "}
              <span className={styles.spantext}>Page {currentPage}</span>{" "}
              <span className={styles.spantext}>
                Total Results: {totalResults}
              </span>{" "}
            </div>
          ) : (
            ""
          )}
        </span>

        {searchMovieTotalResults > 0 ? (
          <span>
            <button
              onClick={previousPage}
              disabled={page <= 1}
              className={styles.button}
            >
              Back
            </button>
            <span className={styles.button}>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={page >= totalPages}
              className={styles.button}
            >
              Next
            </button>
            <br />
            <br />
            <span className={styles.spantext}>
              Total Results: {totalResults}
            </span>{" "}
          </span>
        ) : (
          ""
        )}

        {!totalResults ? <span className={styles.spantext}></span> : ""}
      </div>
      {showBackToTopButton && <BackToTopButton onClick={scrollToTop} />}
    </>
  );
}
