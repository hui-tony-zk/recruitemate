import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import LoadingDots from 'components/ui/LoadingDots';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import RefreshIcon from '@mui/icons-material/Refresh';
import Container from '@mui/material/Container'

import IconButton from '@mui/material/IconButton'
import MicIcon from '@mui/icons-material/Mic';

const AI_DISPLAY_NAME = 'Interviewer'
const MESSAGE_INITIAL_STATE = [{
    text: 'How would you improve the experience of dissatisfied customers?', author: AI_DISPLAY_NAME
}]
const MessagePage = () => {
    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState(MESSAGE_INITIAL_STATE);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const scrollToBottom = () => {
        // messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom()
        getAIResponse(messages)
    }, [messages]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const sendMessage = async () => {
        if (!input) return;
        const userInput = { text: input, author: 'You' }
        setMessages((prevMessages) => [...prevMessages, userInput]);
        setInput('');
    };

    const getAIResponse = async (messages: any) => {
        if (messages.at(-1).author != AI_DISPLAY_NAME) {
            setIsLoading(true); // set loading status to true
            // const response = await axios.post('/api/teaching-assistant', { messages })
            await new Promise(resolve => setTimeout(resolve, 2000));
            setMessages((prevMessages) => [...prevMessages, { text: 'Pending integration', author: AI_DISPLAY_NAME }]);
            setIsLoading(false); // set loading status to true
        }
    }

    const resetThread = () => {
        setMessages(MESSAGE_INITIAL_STATE);
    }

    return (
        <Container maxWidth="md">
            <Box display="flex" flexDirection="column" p={2}
                style={{ maxHeight: `calc(100vh - 300px)`, overflowY: 'auto' }}
            >
                {messages.map((message, index) => (
                    <Box key={index} m={1} display="flex" justifyContent={message.author === AI_DISPLAY_NAME ? 'flex-start' : 'flex-end'}>
                        <Box
                            bgcolor={message.author === AI_DISPLAY_NAME ? 'primary.main' : '#555'}
                            px={2}
                            py={1}
                            m={1}
                            borderRadius={3}
                        >
                            <Box display="flex" justifyContent="flex-start">
                                <Typography variant="body2">
                                    {message.author}:
                                </Typography>
                            </Box>
                            <Typography variant="body1">
                                {message.text}
                            </Typography>
                        </Box>
                    </Box>
                ))}
                <div ref={messagesEndRef} />
                {isLoading && <LoadingDots />}
            </Box>
            <Box p={2} maxWidth='md'>
                <Box display="flex"
                    gap={1}
                    alignItems="left"
                    mb={2}
                    ml={messages.length > 1 ? 6 : 1}
                    style={{ overflowX: 'auto' }}
                >
                </Box>
                <Box display='flex' justifyContent='center' mt={2}>
                    {messages.length > 1 && (
                        <Button onClick={resetThread} startIcon={<RefreshIcon />} >
                            Reset conversation
                        </Button>
                    )}
                </Box>
                <Box display="flex" alignItems="center">
                    <TextField
                        label="Type your message"
                        value={input}
                        onChange={handleInputChange}
                    />
                    <IconButton onClick={() => sendMessage()} color='primary'>
                        <MicIcon />
                    </IconButton>
                </Box>
            </Box>
        </Container>
    );
};

export default MessagePage;
