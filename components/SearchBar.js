import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Spinner,
  Text,
  ChakraProvider,
  InputGroup,
  InputRightElement,
  Flex,
  useMediaQuery,
  IconButton,
  Center,
} from "@chakra-ui/react";

import { SearchIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import stringSimilarity from "string-similarity"; // Importe a biblioteca

const SearchBar = ({ isLoading }) => {
  const [searchText, setSearchText] = useState("");
  const [termosSugeridos, setTermosSugeridos] = useState([]);
  const router = useRouter();
  const [isMouseOverSuggestions, setIsMouseOverSuggestions] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  function handleInputBlur() {
    if (!isMouseOverSuggestions) {
      setTermosSugeridos([]);
    }
  }

  const listaDeTermos = [
    "Meryl Streep",
    "Scarlett Johansson",
    "Jennifer Lawrence",
    "Angelina Jolie",
    "Natalie Portman",
    "Cate Blanchett",
    "Julia Roberts",
    "Charlize Theron",
    "Emma Stone",
    "Anne Hathaway",
    "Viola Davis",
    "Sandra Bullock",
    "Nicole Kidman",
    "Kate Winslet",
    "Mila Kunis",
    "Amy Adams",
    "Halle Berry",
    "Jennifer Aniston",
    "Julianne Moore",
    "Keira Knightley",
    "Emma Watson",
    "Gal Gadot",
    "Rachel McAdams",
    "Jessica Chastain",
    "Reese Witherspoon",
    "Alicia Vikander",
    "Michelle Pfeiffer",
    "Gwyneth Paltrow",
    "Jodie Foster",

    "Steven Spielberg",
    "Christopher Nolan",
    "Quentin Tarantino",
    "Martin Scorsese",
    "James Cameron",
    "Ridley Scott",
    "Tim Burton",
    "Clint Eastwood",
    "Ron Howard",
    "Michael Bay",
    "David Fincher",
    "Wes Anderson",
    "Spike Lee",
    "Guy Ritchie",
    "J.J. Abrams",
    "Robert Zemeckis",
    "George Lucas",
    "Zack Snyder",
    "Peter Jackson",
    "Joel Coen",
    "Bryan Singer",
    "Ang Lee",
    "Guillermo del Toro",
    "Paul Thomas Anderson",
    "James Wan",
    "Mel Gibson",
    "Barry Jenkins",
    "Denis Villeneuve",
    "Kenneth Branagh",
    "Rob Reiner",
    "Ava DuVernay",
    "Greta Gerwig",
    "Patty Jenkins",
    "Sofia Coppola",
    "Kathryn Bigelow",
    "Lana Wachowski",
    "Amy Heckerling",
    "Dee Rees",
    "Nora Ephron",
    "Niki Caro",
    "Lynn Shelton",
    "Jane Campion",
    "Penny Marshall",
    "Kasi Lemmons",
    "Mira Nair",
    "Lulu Wang",
    "Catherine Hardwicke",
    "Alice Wu",
    "Lorene Scafaria",
    "Susanne Bier",
    "Julie Taymor",
    "Nancy Meyers",
    "Karyn Kusama",
    "Barbra Streisand",
    "Marielle Heller",
    "Céline Sciamma",
    "Phyllida Lloyd",
    "Lone Scherfig",
    "Sofia Djama",
    "Jerry Bruckheimer",
    "Harvey Weinstein",
    "Scott Rudin",
    "Brian Grazer",
    "Joel Silver",
    "David Heyman",
    "Kevin Feige",
    "John Davis",
    "Jon Peters",
    "Neal H. Moritz",
    "Roger Corman",
    "Robert Evans",
    "Mark Gordon",
    "Walter F. Parkes",
    "Ron Howard",
    "Barry Mendel",
    "Lawrence Bender",
    "Dan Lin",
    "Lorenzo di Bonaventura",
    "Charles Roven",
    "Joe Roth",
    "Roy Lee",
    "Thomas Tull",
    "Simon Kinberg",
    "Steven R. McQueen",
    "Brad Grey",
    "Chris Columbus",
    "Ian Bryce",
    "Frank Marshall",
    "Richard D. Zanuck",
    "Sherry Lansing",
    "Kathleen Kennedy",
    "Amy Pascal",
    "Emma Thomas",
    "Debra Hill",
    "Mary Parent",
    "Elizabeth Banks",
    "Nina Jacobson",
    "Laura Ziskin",
    "Gail Berman",
    "Cathy Konrad",
    "Susan Downey",
    "Stacey Sher",
    "Lauren Shuler Donner",
    "Lynda Obst",
    "Cassian Elwes",
    "Jane Rosenthal",
    "Megan Ellison",
    "Bonnie Arnold",
    "Linda Obst",
    "Stephanie Allain",
    "Denise Di Novi",
    "Lucy Fisher",
    "Debra Martin Chase",
    "Diablo Cody",
    "Lauren Montgomery",
    "Lucy Kitada",
    "Pamela Abdy",
    "Belén Atienza",

    "Tom Hanks",
    "Leonardo DiCaprio",
    "Brad Pitt",
    "Johnny Depp",
    "Robert Downey Jr.",
    "Denzel Washington",
    "Will Smith",
    "Tom Cruise",
    "Harrison Ford",
    "Morgan Freeman",
    "Samuel L. Jackson",
    "Chris Hemsworth",
    "Ryan Reynolds",
    "Hugh Jackman",
    "Christian Bale",
    "Mark Wahlberg",
    "Matt Damon",
    "Dwayne Johnson",
    "Jake Gyllenhaal",
    "Ryan Gosling",
    "Joaquin Phoenix",
    "Idris Elba",
    "Chris Evans",
    "Chadwick Boseman",
    "Daniel Radcliffe",
    "Keanu Reeves",
    "Benedict Cumberbatch",
    "Michael B. Jordan",
    "Eddie Redmayne",
    "Colleen Atwood",
    "Sandy Powell",
    "Edith Head",
    "Jacqueline Durran",
    "Jenny Beavan",
    "Ruth E. Carter",
    "Alexandra Byrne",
    "Ann Roth",
    "Trish Summerville",
    "Eiko Ishioka",
    "Arianne Phillips",
    "Lindy Hemming",
    "Mary Zophres",
    "Milena Canonero",
    "Michael Kaplan",
    "Ellen Mirojnick",
    "Shirley Kurata",
    "Arianne Phillips",
    "Audrey Fisher",
    "Ngila Dickson",
    "Suttirat Anne Larlarb",
    "Janty Yates",
    "Consolata Boyle",
    "Judianna Makovsky",
    "Julie Weiss",
    "Sharen Davis",
    "Jany Temime",
    "Kym Barrett",
    "Dressmaker",
    "Beatrix Aruna Pasztor",

    "Aaron Sorkin",
    "Charlie Kaufman",
    "Diablo Cody",
    "Noah Baumbach",
    "Taika Waititi",
    "Rian Johnson",
    "Greta Gerwig",
    "Jordan Peele",
    "Phoebe Waller-Bridge",
    "Taylor Sheridan",
    "Tony Kushner",
    "Andrew Stanton",
    "Lena Waithe",
    "Kenneth Lonergan",
    "Emerald Fennell",
    "John Logan",
    "Richard Linklater",
    "Andrea Berloff",
    "Michael Haneke",
    "Tamara Jenkins",
    "Paul Thomas Anderson",
    "Nicole Holofcener",
    "Pedro Almodóvar",
    "Olivier Assayas",
    "Makoto Shinkai",
    "Wes Anderson",
    "Hanif Kureishi",
    "Joanna Hogg",
    "Hirokazu Kore-eda",
    "James Ivory",
  ];
  function buscarTermosSemelhantes(entrada) {
    const resultados = stringSimilarity.findBestMatch(entrada, listaDeTermos);
    const termosSugeridos = resultados.ratings
      .filter((resultado) => resultado.rating > 0.4) // Defina um limite para considerar sugestões
      .map((resultado) => resultado.target);

    return termosSugeridos;
  }
  // Função para atualizar os termos sugeridos quando a entrada do usuário mudar
  function handleInputChange(event) {
    const inputValue = event.target.value;
    setSearchText(inputValue);
    // Se a entrada não estiver vazia, atualize os termos sugeridos
    if (inputValue.trim() !== "") {
      setTermosSugeridos(buscarTermosSemelhantes(inputValue));
    } else {
      setTermosSugeridos([]); // Caso contrário, não há sugestões
    }
  }
  // Função para selecionar um termo sugerido e preencher o campo de busca
  function selecionarTermo(termo) {
    setSearchText(termo);
    setTermosSugeridos([]); // Limpar as sugestões após selecionar
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <ChakraProvider>
        <Flex
          alignItems="center"
          width="100%"
          flex="1"
          style={{ margin: "10px" }}
          flexDirection="column"
        >
          <InputGroup
            flex="1"
            width={isMobile ? "80%" : "100%"}
            flexDirection="column"
          >
            <Input
              margin="10px"
              required={true}
              size="md"
              bg="white"
              color="black"
              borderColor="gray"
              borderWidth="1px"
              mt="24px"
              type="search"
              placeholder="Filmes, Series, Pessoas"
              value={searchText}
              onChange={handleInputChange}
              onBlur={() => {
                if (!isMouseOverSuggestions) {
                  setTermosSugeridos([]);
                }
              }}
              pr={isMobile ? "2.5rem" : "4.5rem"}
              marginLeft={isMobile ? "auto" : "0"}
              marginRight={isMobile ? "auto" : "0"}
            />
            {!isMobile && (
              <InputRightElement
                size="lg"
                mt="24px"
                pointerEvents="none"
                marginLeft="auto"
                marginRight="auto"
              >
                <SearchIcon color="gray.300" margin={3} size="lg" />
              </InputRightElement>
            )}
          </InputGroup>
          <Link href={`/search-free?query=${searchText}`} passHref>
            <Center>
              <Button
                marginTop={2}
                as="a"
                size="md"
                bg="white"
                color="black"
                borderColor="gray"
                borderWidth="1px"
                mt="24px"
              >
                Pesquisar
              </Button>
            </Center>
          </Link>

          {termosSugeridos.length > 0 && (
            <Box
              mt="2"
              position="absolute"
              zIndex="9999"
              bg="white"
              boxShadow="md"
              borderRadius="md"
              width="33%"
            >
              <ul>
                {termosSugeridos.length > 0 && (
                  <Box
                    mt="2"
                    position="absolute"
                    zIndex="9999"
                    bg="white"
                    boxShadow="md"
                    borderRadius="md"
                    width="33%"
                    onMouseEnter={() =>
                      setIsMouseOverSuggestions(true)
                    }
                    onMouseLeave={() =>
                      setIsMouseOverSuggestions(false)
                    }
                  >
                    <Text p="2" fontWeight="bold">
                      Sugestões:
                    </Text>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        width: "200px",
                      }}
                    >
                      {termosSugeridos.map((termo, index) => (
                        <li
                          key={index}
                          onClick={() => selecionarTermo(termo)}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {termo}
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}
              </ul>
            </Box>
          )}

          <Box>
            <Text>{isLoading ? <Spinner /> : " "}</Text>
          </Box>
        </Flex>
      </ChakraProvider>
    </div>
  );
};

export default SearchBar;
