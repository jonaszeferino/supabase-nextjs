import { Box, Heading, Text, Image } from "@chakra-ui/react";
import { Carousel } from "react-bootstrap";

function CarouselComponent() {
  return (
    <Carousel>
      <Carousel.Item>
        <Box position="relative" w="100%" h="300px">
          <Image
            src="/tarantino.png"
            alt="First slide"
            objectFit="cover"
            w="100%"
            h="100%"
          />
          <Heading
            as="h2"
            size="lg"
            color="black"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          >
            Tarantino Movies
          </Heading>
          <Text
            color="black"
            position="absolute"
            bottom="20px"
            left="50%"
            transform="translateX(-50%)"
          >
            See curiosities about Tarantino Movies{" "}
          </Text>
        </Box>
      </Carousel.Item>
      {/* Repita o mesmo padrão para os outros slides */}
    </Carousel>
  );
}

export default CarouselComponent;
