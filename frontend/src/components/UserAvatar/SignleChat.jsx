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
import io from 'socket.io-client'

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false)

  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();


  useEffect(()=>{
    socket = io(ENDPOINT);
    socket.emit("setup", user);

    socket.on("connected", () => {
      setSocketConnected(true);
      console.log("Socket connected");
    });

  },[])

  useEffect(() => {
      if (!socket) return;

      socket.on("message received", (newMessageReceived) => {
        console.log("Message received in client:", newMessageReceived);

        if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
          // show notification
        } else {
          setMessages((prev) => [...prev, newMessageReceived]);
        }
      });

      return () => socket.off("message received");
    }, []);


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

        // socket config for sending message

        socket.emit("new message", data);

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

      // connect to the socket room
      console.log("Emitting join chat with ID:", selectedChat._id);
      socket.emit('join chat', selectedChat._id);

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
      
      selectedChatCompare = selectedChat;
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
