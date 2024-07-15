import React from "react";
import { ChakraProvider, Flex, Text } from "@chakra-ui/react";
import { Redirect, Route, Switch } from 'react-router-dom';
import Header from "components/Landing/Header.js";
import theme from 'theme/landingTheme.js';

export default function Features(props) {
    return (
        <ChakraProvider theme={theme} resetCss={false} w='100%'>
            <Flex
                direction="column"
                align="center"
                maxW={{ xl: "1200px" }}
                m="0 auto"
                {...props}
            >
            <Header />
            <Text>View a summary of all your customers over the last month.</Text>
            </Flex>
        </ChakraProvider>
    );
}