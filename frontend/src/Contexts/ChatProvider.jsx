import { createContext, useContext, useEffect, useState } from "react";

export const ChatContext = createContext();




const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse userInfo from localStorage", e);
        setUser(null);
      }
    }
  }, []);

  return (
    <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}>
      {children}
    </ChatContext.Provider>
  );
};
export const ChatState = ()=>{
  return useContext(ChatContext);
}
export default ChatProvider;
