// Chakra imports
import {
    Flex, Icon, Link, Text, useColorModeValue,
    Stack,
    Skeleton, SkeletonCircle, SkeletonText
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React, { useState } from "react";
import Services from 'Services';

const SubscriptionInformation = () => {
    const [subscription, setSubscription] = React.useState({});
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchSubscription() {
        try {
            var data = await Services.subscription.get();
            console.log('fetchSubscription data:', data);
            setIsLoading(false);
            setData(data);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            setError(error.message);
            return;
        }
    }
    React.useEffect(() => {
        fetchSubscription();
    }, []);
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Card p='16px' my={{ sm: "24px", xl: "0px" }}>
          <CardHeader p='12px 5px' mb='12px'>
              <Text fontSize='lg' color={textColor} fontWeight='bold'>
                  Subscription Information
              </Text>
      </CardHeader>
          <CardBody px='5px'>
              <Flex direction='column'>
                  <Skeleton isLoaded={!isLoading}>
                      <Text fontSize='md' color='gray.500' fontWeight='400' mb='30px'>
                              {data && data.name}
                      </Text>
                  </Skeleton>
                      <Skeleton isLoaded={!isLoading}>
                  <Flex direction='column'>
                      <Text fontSize='md' color='gray.500' fontWeight='400' mb='30px'>
                          {data && data.description}
                          </Text>
                  </Flex>
                      </Skeleton>
                  <Flex align='center' mb='18px'>
                      <Skeleton isLoaded={!isLoading}>
                      <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
                          Strategy Limit:{" "}
                          </Text>
                          <Text fontSize='md' color='gray.500' fontWeight='400'>
                          {data && data.strategyLimit}
                          </Text>
                        </Skeleton>
                  </Flex>
                  <Flex align='center' mb='18px'>
                      <Skeleton isLoaded={!isLoading}>
                      <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
                          Node Limit:{" "}
                      </Text>
                      <Text fontSize='md' color='gray.500' fontWeight='400'>
                          {data && data.nodeLimit}
                          </Text>
                      </Skeleton>
                  </Flex>
                  <Flex align='center' mb='18px'>
                      <Skeleton isLoaded={!isLoading}>
                      <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
                          Expires:{" "}
                      </Text>
                      <Text fontSize='md' color='gray.500' fontWeight='400'>
                          {data && data.expires}
                          </Text>
                      </Skeleton>
                  </Flex>
                  </Flex>
      </CardBody>
    </Card>
  );
};

export default SubscriptionInformation;
