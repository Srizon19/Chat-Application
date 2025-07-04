import React from 'react'
import { ChatState } from '../../Contexts/ChatProvider'
import { Box, IconButton, Text } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../../config/ChatLogics'
import ProfileModal from '../miscellanous/ProfileModal'
import UpdateGroupChatModal from '../miscellanous/UpdateGroupChatModal'

const SignleChat = ({fetchAgain, setFetchAgain}) => {
  const {user, selectedChat, setSelectedChat} = ChatState()
  return (
    <>
      {selectedChat? (<>
        <>
          
          <Text
            fontSize={{base: "28px", md: "30px"}}
            pb={3}
            px={2}
            w={"100%"}
            display={"flex"}
            justifyContent={{base: "space-between"}}
            alignItems={"center"}
          >
            <IconButton 
              display={{base: "flex", md:"none"}}
              icon={<ArrowBackIcon></ArrowBackIcon>}
              onClick={()=>{setSelectedChat("")}}
            ></IconButton>

            

            {
              !selectedChat.isGroupChat ? (
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
                  <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                    
                  </ProfileModal>
                </Box>
              ) : (
                <Box w="100%" display="flex" justifyContent="space-between" alignItems="center">
                  <Text fontSize="xl" fontWeight="bold">
                    {selectedChat.chatName.toUpperCase()}
                  </Text>
                  <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                </Box>

              )
            }

          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {/* messages here */}
          </Box>
        </>
      </>) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} >
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  )
}

export default SignleChat