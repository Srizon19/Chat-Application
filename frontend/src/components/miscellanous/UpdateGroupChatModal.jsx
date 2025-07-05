import React, {useState,useEffect} from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Text,
  IconButton,
  Box,
  useToast,
  FormControl,
  Input,
  Spinner
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Contexts/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserItem from '../UserAvatar/UserItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {selectedChat, setSelectedChat, user} = ChatState();

  const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState();
  const [renameLoading, setRenameLoading] = useState();

  useEffect(() => {
  setGroupChatName(selectedChat.chatName);
  }, [selectedChat]);

  

  const toast = useToast();

  console.log("selected chat inside update group chat: ", selectedChat)


  const handleRemove = async(userToRemove)=>{
    // only admin can remove someone
    console.log("user to remove: ", userToRemove);
    if(selectedChat.groupAdmin._id !== user._id && userToRemove._id === user._id){
      toast({
        title: "Only admin can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })

      return;
    }


    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      const {data} = await axios.put(

        `/backend/chat/groupRemove`,
        {userId: userToRemove._id, chatId: selectedChat._id},
        config
      )

      console.log(data);
      userToRemove._id === user._id? setSelectedChat() : setSelectedChat(data);
      setLoading(false);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({
        title: "Failed to leave!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
    }

  }
  const handleRename = async ()=>{
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };

      const {data} = await axios.put('/backend/chat/rename', {chatId: selectedChat._id, chatName: groupChatName},config )

      setSelectedChat(data);
      setRenameLoading(false);
      setFetchAgain(!fetchAgain);
      console.log("fetchAgain from updateChate: ", fetchAgain);

      toast({
                title: 'Renamed Successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
              })
    } catch (error) {
      toast({
                title: 'Error Occurred',
                description: 'Failed to rename the group',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
              })
    }
  }
  const handleSearch = async (query)=>{
    setSearch(query);
    
    if(!query){
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const {data} = await axios.get(`/backend/user?search=${search}`, config);
      console.log("searched users: ",  data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      
    }
    
  }

  const addToGroup = async (userToAdd)=>{
      if(selectedChat.users.find((user)=> user._id === userToAdd._id)){
        toast({
          title: "User already in the group",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
        return;
      }

      // only admin can add someone

      if(selectedChat.groupAdmin._id !== user._id){
        toast({
          title: "Only admin can add someone",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })

        return;
      }


      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }

        const {data} = await axios.put('/backend/chat/groupAdd', {chatId: selectedChat._id, userId: userToAdd._id}, config);

        console.log("added user: ", data);

        setLoading(false);
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);


      } catch (error) {
        
      }

  }
  

  return (
    <>
      <IconButton
        display={{ base: 'flex' }}
        icon={<ViewIcon />}
        onClick={onOpen}
        aria-label="View Group Info"
      />


      <Modal isOpen={isOpen} onClose={()=>{
        onClose()
        setSearchResult([])
      }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            display={"flex"}
            justifyContent={"center"}
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              <Box>
                {selectedChat.users.map((user)=>
                (
                  <UserBadgeItem
                    user={user}
                    handleFunction={()=>handleRemove(user)}
                    key={user._id}
                  >

                  </UserBadgeItem>
                ))}
              </Box>
              <FormControl display={"flex"}>
                <Input
                  placeholder='Chat Name'
                  mb={3}
                  value={groupChatName}
                  onChange={(e)=>{setGroupChatName(e.target.value)}}
                ></Input>
                <Button
                  variant={"solid"}
                  colorScheme='teal'
                  ml={1}
                  isLoading={renameLoading}
                  onClick={()=>{handleRename()}}
                >Update</Button>
              </FormControl>
              <FormControl display={"flex"}>
                <Input
                  placeholder='Add Group Members'
                  mb={3}
                  
                  onChange={(e)=>{handleSearch(e.target.value)}}
                ></Input>
              </FormControl>

              {/* showing search results here */}

              {loading? (
                <Spinner size={"lg"}></Spinner>
              ):(
                searchResult?.map((user)=>(
                  <UserItem
                    key={user._id}
                    user={user}
                    handleFunction={()=>{addToGroup(user)}}
                  ></UserItem>
                ))
              )}
              
              
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={()=>{handleRemove(user)}}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
