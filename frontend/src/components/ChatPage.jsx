import { Box, Button } from "@chakra-ui/react"
import { ChatState } from '../Contexts/ChatProvider'
import SideDrawer from './miscellanous/SideDrawer'
import MyChats from './miscellanous/MyChats'
import ChatBox from './miscellanous/ChatBox'
import { useState } from "react"

const ChatPage = () => {

  const {user,selectedChat} = ChatState();
  const [fetchAgain, setFetchAgain] = useState();
    
  return (
    <div style={{width: "100%"}}>
      {user && <SideDrawer></SideDrawer>}
      <Box 
        display="flex"
        justifyContent='space-between'
        w='100%'
        h='91.5vh'
        p='10px'
      >
        { user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}></MyChats>  }
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}></ChatBox>}
      </Box>
    </div>
  )
}

export default ChatPage