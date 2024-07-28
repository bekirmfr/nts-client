import React, { useRef, useCallback, useState, useEffect } from 'react';
import Services from "Services";
import StrategyTable from "./StrategyTable.js";
import {
    Flex,
    Grid,
    Image,
    SimpleGrid,
    useColorModeValue,
} from "@chakra-ui/react";

export default () => {
    const [data, setData] = useState(null);
    async function fetchStrategies() {
        try {
            var data = await Services.strategy.getAll();
            console.log('fetchStrategies data:', data);
            setData(data);
        } catch (error) {
            console.log(error);
        }
    }

    React.useEffect(() => {
        fetchStrategies();
    }, []);

    
    return (
        <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }}>
            {data &&
                <StrategyTable headers={data.headers} rows={data.rows} />
            }
        </Flex>
    );
}