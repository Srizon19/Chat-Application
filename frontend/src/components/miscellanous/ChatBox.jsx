import React from 'react'
import { ChatState } from '../../Contexts/ChatProvider'
import { Box } from '@chakra-ui/react';
import SignleChat from '../UserAvatar/SignleChat';


const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const {selectedChat} = ChatState();
  console.log("selected chat from chatbox: ", selectedChat)
  return (
    <Box 
      display={{base: selectedChat? "flex" : "none", md: "flex"}}
      alignItems={"center"}
      flexDir={"column"}
      p={3}
      ml={3}
      bg={"white"}
      width={{base: "100%", md: "60%"}}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <SignleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}></SignleChat>
      
    </Box>
  )
}

export default ChatBox