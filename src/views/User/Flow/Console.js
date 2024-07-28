// App.js or your main component file
import React, { useState, useEffect } from 'react';
import { Box, Textarea, ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';

// Create a context for the external function
const ConsoleContext = React.createContext(null);

const theme = extendTheme({
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
    },
});

const Console = () => {
    const [messages, setMessages] = useState([]);

    // Function to add a message to the console
    const addMessage = (message) => {
        setMessages(prevMessages => [JSON.stringify(message), ...prevMessages]);
    };

    // Expose the addMessage function to the window object for external use
    useEffect(() => {
        window.addConsoleMessage = addMessage;
    }, []);

    return (
        <Box w="95%" h="100px" overflow="hidden" position='absolute'>
            <Textarea
                color="#000"
                value={messages.join('\n')}
                readOnly
                height="100%"
                fontSize="sm"
                bg="gray.100"
                resize="none"
            />
        </Box>
    );
};

export default Console;
