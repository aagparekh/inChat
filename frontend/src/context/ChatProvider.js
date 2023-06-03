import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [User, setUser] = useState();
  const [CurrentUserChat, setCurrentUserChat] = useState([]);
  const [SelectedChat, setSelectedChat] = useState();
  const [FetchAllUsers, setFetchAllUsers] = useState([]);
  const [Fetch, setFetch] = useState(false);
  const [notification, setnotification] = useState([]);
  const [Messages, setMessages] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
    //  localStorage.removeItem("userInfo");
    console.log(User);
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        User,
        setUser,
        CurrentUserChat,
        setCurrentUserChat,
        SelectedChat,
        setSelectedChat,
        FetchAllUsers,
        setFetchAllUsers,
        Fetch, 
        setFetch,
        notification, 
        setnotification,
        Messages, 
        setMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
