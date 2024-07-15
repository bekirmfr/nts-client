import React from "react";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { Redirect, Route, Switch } from 'react-router-dom';
import Header from "components/Landing/Header.js";
import theme from 'theme/landingTheme.js';
import routes from 'routes.js';

function Pages(props) {
    const { ...rest } = props;

    const getRoutes = (routes) => {
        return routes.map((prop, key) => {
            /*if (prop.collapse) {
                return getRoutes(prop.views);
            }
            if (prop.category === 'account') {
                return getRoutes(prop.views);
            }*/
            if (prop.layout === '/landing') {
                return <Route path={prop.path} component={prop.component} key={key} />;
            } else {
                return null;
            }
        });
    };

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
            <Switch>
                    {getRoutes(routes)}
                    <Redirect from='/' to='/home' />
            </Switch>
            </Flex>
        </ChakraProvider>
    );
}
export default Pages;