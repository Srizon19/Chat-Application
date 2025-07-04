import { FormControl, Input, useDisclosure } from '@chakra-ui/react'
import React, {useState} from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Badge
} from '@chakra-ui/react'
import { ChatState } from '../../Contexts/ChatProvider'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import UserItem from '../UserAvatar/UserItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'


const GroupChatModal = ({children}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();

    const [groupChatName, setGroupChatName] = useState();

    const [selectedUsers, setSelectedUsers] = useState([]);

    const [search, setSearch] = useState("");
    const[searchResult, setSearchResult] = useState();

    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const {user, chats, setChats} = ChatState();
    const handleSearch = async(query)=>{

          setSearch(query);


          if(!query){
            return;
          }
          
          try {
            setLoading(true);
            console.log(user);
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.get(`/backend/user?search=${search}`,config);
            console.log("searched result: ", data)
            setSearchResult(data);
            setLoading(false);
          } catch (error) {
            toast({
                title: 'Error Occurred',
                description: 'Failed to load search results',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left',
              });
          }


    }

    const handleGroup = (userToAdd)=>{
      if(selectedUsers.includes(userToAdd)){
        toast({
          title: "User already added",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top"
        });

        return;
      }

      setSelectedUsers(prev => [...prev, userToAdd])
    }

    const handleDelete = (user) =>{
      setSelectedUsers(selectedUsers.filter(sel=>sel._id !== user._id))
      console.log("selected user after deletion: ", selectedUsers)
    }

    const handleSubmit = async()=>{
      if(!groupChatName || !selectedUsers){
        toast({
          title: "Please fill all the fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top"
        })

        return;
      }


      try {
          const config = {
                  headers:{
                      Authorization: `Bearer ${user.token}`,
                  },
          };

          const {data} = await axios.post('/backend/chat/group', {name: groupChatName, users: selectedUsers.map((user)=> user._id)}, config);

          setChats(prev=>[data, ...prev]);
          onClose()

          console.log("created group chat: ", data);
          toast({
          title: "Group chat created successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom"
          })

          setGroupChatName("");
          setSelectedUsers([]);
          setSearchResult([])
        
      } catch (error) {
        toast({
          title: "Failed to create the chat",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
      }
    }



  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            display={"flex"}
            justifyContent={"center"}
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDir={"column"}
            alignItems={"center"}
          >
            <FormControl>
                <Input 
                    placeholder='chat name'
                    mb={3}
                    onChange={(e)=> setGroupChatName(e.target.value)}
                ></Input>
            </FormControl>
            <FormControl>
                <Input 
                    placeholder='Add users eg: Jhon, Piyush, Jane'
                    mb={1}
                    onChange={(e)=> handleSearch(e.target.value)}
                ></Input>
            </FormControl>
            {selectedUsers.map(user=>(
              <UserBadgeItem
                key={user._id}
                user={user}
                handleFunction={()=>handleDelete(user)}
              ></UserBadgeItem>
            ))}
            {loading? <div>loading</div> : (
              searchResult?.slice(0,4).map(user =>{
                return <UserItem
                  key={user._id}
                  user={user}
                  handleFunction={()=>handleGroup(user)}
                ></UserItem>
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue'  onClick={handleSubmit}>
              Create Chat
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal