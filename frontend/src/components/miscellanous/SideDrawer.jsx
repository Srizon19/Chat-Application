import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Tooltip,
  IconButton,
  Avatar,
  MenuDivider,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  useDisclosure,
  Spinner,
  useToast,
} from '@chakra-ui/react';

import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { ChatState } from '../../Contexts/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserItem from '../UserAvatar/UserItem';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  

  const { user, setUser, setSelectedChat } = ChatState();
  const navigate = useNavigate();

  // user search side drawer logic
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleSearch = async () => {
    if (!search.trim()) {
      toast({
        title: 'Please enter something to search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/backend/user?search=${search}`, config);
      setSearchResult(data);
      console.log("searcher users: ", searchResult);
    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: 'Failed to load search results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    } finally {
      setLoading(false);
    }
  };
  const accessChat = async (userId)=>{
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }

      const {data} = await axios.post('/backend/chat', { userId }, config);

      setSelectedChat(data);
      console.log("selected chat: ", data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: 'Error fetching the chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  }


  // logout logic
  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUser({});
    navigate('/');
  };

  return (
    <>
      {/* Navbar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="1px"
      >
        {/* Search Button */}
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: 'none', md: 'flex' }} px="2">
              Search User
            </Text>
          </Button>
        </Tooltip>

        {/* App Name */}
        <Text fontSize="2xl">Talk-A-Tive</Text>

        {/* Right Side */}
        <Box display="flex" alignItems="center" gap="2">
          {/* Notifications */}
          <Menu>
            
              <IconButton 
              p={1}
              aria-label="Notifications" icon={<BellIcon />} variant="ghost" />
            
          </Menu>

          {/* User Menu */}
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              p={1}
              bg="transparent"
              _hover={{ bg: 'gray.100' }}
            >
              <Avatar size="sm" cursor="pointer" name={user?.name} src={user.photo} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      {/* Drawer */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>

            {loading ? (
              <ChatLoading></ChatLoading>
            ) : (
              searchResult.length > 0?(searchResult.map(user => {
                return <UserItem 
                key={user._id}
                user={user}
                handleFunction={()=>{
                  accessChat(user._id);
                }} 
                ></UserItem>
              })) : (<span >No user found</span>)
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
