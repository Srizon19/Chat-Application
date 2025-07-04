import { Button, HStack } from "@chakra-ui/react"
import { Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import ChatPage from "./components/ChatPage"
import "./App.css"

function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/chats" element={<ChatPage></ChatPage>}></Route>
        
      </Routes>
    </>
  )
}

export default App
