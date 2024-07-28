// Chakra imports
import { Flex, Icon, Link, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React from "react";
import Services from 'Services';

const SubscriptionInformation = () => {
    const [subscription, setSubscription] = React.useState({});

    async function fetchSubscription() {
        try {
            var data = await Services.subscription.get();
            console.log('fetchSubscription data:', data);
            setSubscription(data);
        } catch (error) {
            console.log(error);
            return;
        }
    }
    React.useEffect(() => {
        fetchSubscription();
    }, []);
    
    console.log('subscription: ', subscription);
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
                  <Text fontSize='md' color='gray.500' fontWeight='400' mb='30px'>
                      {subscription && subscription.name}
                  </Text>
                  <Flex direction='column'>
                      <Text fontSize='md' color='gray.500' fontWeight='400' mb='30px'>
                          {subscription && subscription.description}
                      </Text>
                  </Flex>
                  <Flex align='center' mb='18px'>
                      <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
                          Strategy Limit:{" "}
                      </Text>
                      <Text fontSize='md' color='gray.500' fontWeight='400'>
                          {subscription && subscription.strategyLimit}
                      </Text>
                  </Flex>
                  <Flex align='center' mb='18px'>
                      <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
                          Node Limit:{" "}
                      </Text>
                      <Text fontSize='md' color='gray.500' fontWeight='400'>
                          {subscription && subscription.nodeLimit}
                      </Text>
                  </Flex>
                  <Flex align='center' mb='18px'>
                      <Text fontSize='md' color={textColor} fontWeight='bold' me='10px'>
                          Expires:{" "}
                      </Text>
                      <Text fontSize='md' color='gray.500' fontWeight='400'>
                          {subscription && subscription.expires}
                      </Text>
                  </Flex>
              </Flex>
      </CardBody>
    </Card>
  );
};

export default SubscriptionInformation;
