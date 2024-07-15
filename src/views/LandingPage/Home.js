import React from "react";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { Redirect, Route, Switch } from 'react-router-dom';
import Header from "components/Landing/Header.js";
import theme from 'theme/landingTheme.js';
import Hero from "components/Landing/Hero";

 function Home(props) {
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
            <Hero
                title="Build this rad landing page from scratch"
                subtitle="This is the subheader section where you describe the basic benefits of your product"
                image="https://unsplash.com/photos/a-group-of-blue-and-orange-balls-on-a-black-background-u6s_Nn1s-j8/"
                ctaText="Create your account now"
                ctaLink="/app/auth/signup"
            />
            </Flex>
        </ChakraProvider>
    );
}

export default Home;