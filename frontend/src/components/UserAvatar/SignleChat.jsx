import React, { useEffect, useState } from 'react';
import { ChatState } from '../../Contexts/ChatProvider';
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../../config/ChatLogics';
import ProfileModal from '../miscellanous/ProfileModal';
import UpdateGroupChatModal from '../miscellanous/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from '../ScrollableChat';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();

  const sendMessage = async (e) => {
    if (e.key === 'Enter' && newMessage.trim()) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          '/backend/message',
          {
            chatId: selectedChat._id,
            content: newMessage,
          },
          config
        );

        setNewMessage('');
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        toast({
          title: 'Error Occurred',
          description: 'Failed to send the message',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(`/backend/message/${selectedChat._id}`, config);
      setLoading(false);
      setMessages(data);
    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: 'Failed to load the messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };

  useEffect(() => {
    if (selectedChat && user) {
      fetchMessages();
    }
  }, [selectedChat, user]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // TODO: Typing indicator logic
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w={'100%'}
            display={'flex'}
            justifyContent={{ base: 'space-between' }}
            alignItems={'center'}
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />

            {!selectedChat.isGroupChat ? (
              <Box
                fontWeight="semibold"
                w="100%"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml={2}
              >
                <Text fontSize="xl" fontWeight="bold">
                  {getSender(user, selectedChat.users)}
                </Text>
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </Box>
            ) : (
              <Box
                w="100%"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text fontSize="xl" fontWeight="bold">
                  {selectedChat.chatName.toUpperCase()}
                </Text>
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </Box>
            )}
          </Text>

          <Box
            display={'flex'}
            flexDir={'column'}
            justifyContent={'flex-end'}
            p={3}
            bg={'#E8E8E8'}
            w={'100%'}
            h={'100%'}
            borderRadius={'lg'}
            overflowY={'hidden'}
          >
            {loading ? (
              <Spinner
                size={'xl'}
                w={20}
                h={20}
                alignSelf={'center'}
                margin={'auto'}
              />
            ) : (
              <Box
                display={'flex'}
                flexDir={'column'}
                overflowX={'scroll'}
                scrollbar-width="none"
              >
                
                <ScrollableChat messages={messages}></ScrollableChat>
              </Box>
            )}

            <FormControl onKeyDown={sendMessage} mt={3}>
              <Input
                variant="filled"
                bg={'#E0E0E0'}
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          h={'100%'}
        >
          <Text fontSize={'3xl'} pb={3}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
