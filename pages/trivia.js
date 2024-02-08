import { useState, useEffect } from "react";
import {
  Button,
  Stack,
  Text,
  VStack,
  HStack,
  Box,
  ChakraProvider,
  Center,
  Select,
  useDisclosure,
  Collapse,
  useMediaQuery,
} from "@chakra-ui/react";
import { Alert, Space, Divider } from "antd";
import styles from "../styles/Home.module.css";
import { supabase } from "../utils/supabaseClient";
import LoggedUser from "../components/LoggedUser";

export default function Trivia() {
  
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const { isOpen, onToggle } = useDisclosure();
  const [answers, setAnswers] = useState({ questions: [] });
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [resultsAnswer, setResultsAnswer] = useState("");
  const [categories, setCategories] = useState("");
  const [difficultyCount, setDifficultyCount] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });

  const [selectedDifficulties, setSelectedDifficulties] = useState([]);

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [resultado, setResultado] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalWrongQuestions, setTotalWrongQuestions] = useState(0);
  const [totalCorrectQuestions, setTotalCorrectQuestions] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isDisabled, setisDisabled] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isClickedA, setIsClickedA] = useState("");
  const [isClickedB, setIsClickedB] = useState("");
  const [isClickedC, setIsClickedC] = useState("");
  const [isClickedD, setIsClickedD] = useState("");

  const [firstTime, setFirstTime] = useState(true);

  const [showCategoryOptions, setShowCategoryOptions] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);

  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [correct, setCorrect] = useState(0);

  const toggleCategoryOptions = () => setShowCategoryOptions((prev) => !prev);

  const apiCall = () => {
    setIsClickedA("");
    setIsClickedB("");
    setIsClickedC("");
    setIsClickedD("");

    let choice = "";

    if (selectedDifficulties.includes("easy")) {
      choice = "&difficulty=easy";
    } else if (selectedDifficulties.includes("medium")) {
      choice = "&difficulty=medium";
    } else if (selectedDifficulties.includes("hard")) {
      choice = "&difficulty=hard";
    }

    const url = `https://the-trivia-api.com/api/questions?limit=1&categories=film_and_tv&${choice}`;
    setResultsAnswer("");
    setSelectedAnswer("");
    setResultado("");
    setTotalQuestions(totalQuestions + 1);

    fetch(url)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Wrong Data");
        }
      })
      .then((result) => {
        setAnswers({
          questions: result.map((question) => ({
            id: question.id,
            question: question.question,
            correctAnswer: question.correctAnswer,
            incorrectAnswers: question.incorrectAnswers,
            difficulty: question.difficulty,
            category: question.category,
          })),
        });
        setDifficultyCount((prevCount) => ({
          ...prevCount,
          [result[0].difficulty]: prevCount[result[0].difficulty] + 1,
        }));
      })
      .catch((error) => setError(true));
  };

  useEffect(() => {
    const allAnswers = [
      answers.questions[0]?.incorrectAnswers[0],
      answers.questions[0]?.incorrectAnswers[1],
      answers.questions[0]?.incorrectAnswers[2],
      answers.questions[0]?.correctAnswer,
    ];
    const newShuffledAnswers = allAnswers
      .slice()
      .sort(() => Math.random() - 0.5);
    setShuffledAnswers(newShuffledAnswers);
  }, [answers]);

  function getResultAnswer(recebido, questao) {
    setisDisabled(true);
    if (recebido === answers.questions[0]?.correctAnswer) {
      setResultsAnswer(
        <span
          style={{
            color: "white",
            fontWeight: "bold",
            backgroundColor: "green",
            borderRadius: "7px",
            padding: "7px",
          }}
        >
          Correct!
        </span>
      );
      setTotalCorrectQuestions(totalCorrectQuestions + 1);
      setCorrect(1);
    } else {
      setResultsAnswer(
        <span
          style={{
            color: "white",
            fontWeight: "bold",
            backgroundColor: "red",
            borderRadius: "7px",
            padding: "7px",
          }}
        >
          {questao}: Is The Wrong Choice!. The correct answer is:{" "}
          {answers.questions[0]?.correctAnswer}
        </span>
      );
      setTotalWrongQuestions(totalWrongQuestions + 1);
      setCorrect(0);
    }
  }

  const categoryOptions = [
    { name: "arts_and_literature", displayName: "Arts & Literature" },
    { name: "film_and_tv", displayName: "Cinema & TV" },
    { name: "food_and_drink", displayName: "Food & Drink" },
    { name: "general_knowledge", displayName: "General Knowledge" },
    { name: "geography", displayName: "Geography" },
    { name: "history", displayName: "History" },
    { name: "music", displayName: "Music" },
    { name: "science", displayName: "Science" },
    { name: "society_and_culture", displayName: "Society & Culture" },
    { name: "sport_and_leisure", displayName: "Sport & Leisure" },
  ];

  const difficultyOptions = [
    { name: "", displayName: "All" },
    { name: "easy", displayName: "Easy" },
    { name: "medium", displayName: "Medium" },
    { name: "hard", displayName: "Hard" },
  ];

  //Enviar stats

  const insertStats = async () => {
    try {
      const response = await fetch("/api/v1/postStatsTrivia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: session.user.email || "not logged in",
          questionId: answers.questions[0].id,
          correct: correct,
          difficulty: answers.questions[0].difficulty,
        }),
      });
      return;
    } catch (error) {
      console.error(error);
    }
  };

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
      <Center>
        <Text style={{ margin: "10px" }}></Text>
      </Center>

      <br />
      
      {isMobile ? (
          <>
            <div style={{ paddingTop: 80, }} >
            <LoggedUser />
              <Divider />
              <h1> <strong>Trivia</strong></h1>
              <Divider />
            </div>
          </>
        ) : (
          <div className={styles.top}>
            <h3 className={styles.title}>Trivia</h3>
          </div>
        )}
      <br />

      

      <ChakraProvider>
        <Box>
          <>
            <Button onClick={onToggle}>Click Me</Button>
            <Collapse in={isOpen} animateOpacity>
              <Box
                p="40px"
                color="white"
                mt="4"
                bg="teal.500"
                rounded="md"
                shadow="md"
              >
                <Center>
                  <Button
                    onClick={() => {
                      apiCall();
                      setFirstTime(false);
                      setTotalQuestions(0);
                      setTotalCorrectQuestions(0);
                      setTotalWrongQuestions(0);
                      setisDisabled(false);
                      setDifficultyCount({
                        easy: 0,
                        medium: 0,
                        hard: 0,
                      });
                    }}
                  >
                    Start
                  </Button>
                  <HStack>
                    <Select
                      placeholder="Select Difficulty"
                      onChange={(e) =>
                        setSelectedDifficulties([e.target.value])
                      }
                    >
                      {difficultyOptions.map((option) => (
                        <option key={option.name} value={option.name}>
                          {option.displayName}
                        </option>
                      ))}
                    </Select>
                  </HStack>
                </Center>
                <br />
                <Box>
                  When you click on start, the count resets. If you click on
                  next, the count will continue.
                  <br />
                  If you dont choose the difficulty, the questions will come
                  randomly.
                </Box>
              </Box>
            </Collapse>
          </>
          <br />

          <Center>
            <br />
            {!firstTime && (
              <Button
                onClick={() => {
                  apiCall(), setisDisabled(false);
                }}
                color="teal.500"
              >
                Next Question
              </Button>
            )}
          </Center>
          <br />
        </Box>
        <Stack spacing={4} align="center">
          {answers.questions.length > 0 && (
            <Box>
              <Text style={{ margin: "10px" }}>
                {answers.questions[0]?.question}
              </Text>

              <br />
              <Center>
                <VStack spacing={2} align="start">
                  <HStack spacing={2} align="start" mb={6}>
                    <Button
                      style={{ backgroundColor: isClickedA }}
                      onClick={() => {
                        getResultAnswer(shuffledAnswers[0], "A");
                        setIsClickedA("#0070f3");
                        insertStats();
                      }}
                      isDisabled={isDisabled}
                      maxW="390px"
                    >
                      A
                    </Button>{" "}
                    <Button
                      style={{ backgroundColor: isClickedA }}
                      onClick={() => {
                        getResultAnswer(shuffledAnswers[0], "A");
                        setIsClickedA("#0070f3");
                        insertStats();
                      }}
                      isDisabled={isDisabled}
                      maxW="390px"
                    >
                      <Text
                        style={{
                          whiteSpace: "pre-wrap",
                          maxWidth: "480px",
                          margin: "10px",
                        }}
                      >
                        {shuffledAnswers[0]}
                      </Text>
                    </Button>{" "}
                  </HStack>

                  <HStack spacing={2} align="start" mb={6}>
                    <Button
                      style={{ backgroundColor: isClickedB }}
                      onClick={() => {
                        getResultAnswer(shuffledAnswers[1], "B");
                        setIsClickedB("#0070f3");
                        insertStats();
                      }}
                      isDisabled={isDisabled}
                      maxW="390px"
                    >
                      B
                    </Button>{" "}
                    <Button
                      style={{ backgroundColor: isClickedB }}
                      onClick={() => {
                        getResultAnswer(shuffledAnswers[1], "B");
                        setIsClickedB("#0070f3");
                        insertStats();
                      }}
                      isDisabled={isDisabled}
                      maxW="390px"
                    >
                      <Text
                        style={{
                          whiteSpace: "pre-wrap",
                          maxWidth: "480px",
                          margin: "10px",
                        }}
                      >
                        {shuffledAnswers[1]}
                      </Text>
                    </Button>{" "}
                  </HStack>

                  <HStack spacing={2} align="start" mb={6}>
                    <Button
                      style={{ backgroundColor: isClickedC }}
                      onClick={() => {
                        getResultAnswer(shuffledAnswers[2], "C");
                        setIsClickedC("#0070f3");
                        insertStats();
                      }}
                      isDisabled={isDisabled}
                      maxW="390px"
                    >
                      C
                    </Button>{" "}
                    <Button
                      style={{ backgroundColor: isClickedC }}
                      onClick={() => {
                        getResultAnswer(shuffledAnswers[2], "C");
                        setIsClickedC("#0070f3");
                        insertStats();
                      }}
                      isDisabled={isDisabled}
                      maxW="390px"
                    >
                      <Text
                        style={{
                          whiteSpace: "pre-wrap",
                          maxWidth: "480px",
                          margin: "10px",
                        }}
                      >
                        {shuffledAnswers[2]}
                      </Text>
                    </Button>{" "}
                  </HStack>

                  <HStack spacing={2} align="start" mb={6}>
                    <Button
                      style={{ backgroundColor: isClickedD }}
                      onClick={() => {
                        getResultAnswer(shuffledAnswers[3], "D");
                        setIsClickedD("#0070f3");
                        insertStats();
                      }}
                      isDisabled={isDisabled}
                      maxW="390px"
                    >
                      D
                    </Button>{" "}
                    <Button
                      style={{ backgroundColor: isClickedD }}
                      onClick={() => {
                        getResultAnswer(shuffledAnswers[3], "D");
                        setIsClickedD("#0070f3");
                        insertStats();
                      }}
                      isDisabled={isDisabled}
                      maxW="390px"
                    >
                      <Text
                        style={{
                          whiteSpace: "pre-wrap",
                          maxWidth: "480px",
                          margin: "10px",
                        }}
                      >
                        {shuffledAnswers[3]}
                      </Text>
                    </Button>{" "}
                  </HStack>
                </VStack>
              </Center>

              <br />
              <Text textAlign="center">
                <span>{resultsAnswer}</span>
                <br />
                <br />

                <Text textAlign="center">
                  <span>
                    Difficulty:
                    <strong> {answers.questions[0]?.difficulty} </strong>
                  </span>{" "}
                  <span>
                    Category: <strong> {answers.questions[0]?.category}</strong>
                  </span>
                </Text>

                <VStack spacing={2} align="center">
                  <Text>
                    <strong>Total:</strong>{" "}
                    <Text as="span" color="black">
                      <strong>{totalQuestions}</strong>
                    </Text>{" "}
                    <strong>Corrects:</strong>{" "}
                    <Text as="span" color="green">
                      <strong>{totalCorrectQuestions} </strong>
                    </Text>{" "}
                    <strong>Wrong:</strong>{" "}
                    <Text as="span" color="red">
                      <strong> {totalWrongQuestions}</strong>
                    </Text>
                    <Text>
                      <strong>Easy:</strong> {difficultyCount.easy} {" |"}
                      <strong>Medium:</strong> {difficultyCount.medium} {"| "}
                      <strong>Hard:</strong> {difficultyCount.hard}
                    </Text>
                  </Text>
                </VStack>
              </Text>
            </Box>
          )}
        </Stack>
      </ChakraProvider>
    </div>
  );
}
