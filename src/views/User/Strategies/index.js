import React, { useRef, useCallback, useState, useEffect } from 'react';
import Services from "Services";
import StrategyTable from "./StrategyTable.js";
import {
    Flex,
    Grid,
    Image,
    SimpleGrid,
    useColorModeValue,
    Stack,
    Skeleton, SkeletonCircle, SkeletonText
} from "@chakra-ui/react";
import { useToast } from '@chakra-ui/react';

export default () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();

    React.useEffect(() => {
        function fetchStrategies() {
            var fetchTable = Services.strategy.list()
                .then((data) => {
                    console.log('fetchStrategies res: ', data);
                    setIsLoading(false);
                    setData(data);
                })
                .catch(error => {
                    console.log('fetchStrategies error: ', error);
                    setIsLoading(false);
                    setError(error);
                    toast({
                        title: 'Error.',
                        description: error.message,
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                });       
        }
        fetchStrategies();
    }, []);
    
    
    return (
        <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }}>
            {isLoading &&
                <Stack>
                    <Skeleton height='20px' />
                    <Skeleton height='20px' />
                    <Skeleton height='20px' />
                </Stack>
                }
            {data &&
                <StrategyTable headers={data.headers} rows={data.rows} />
            }
        </Flex>
    );
}