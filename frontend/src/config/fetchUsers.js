import { ChatState } from "../context/ChatProvider";

export const fetchUser = async () => {
    const { User,CurrentUserChat, setCurrentUserChat,setSelectedChat } = ChatState();
    // console.log(CurrentUserChat);
    try {
      const response = await fetch("/api/chat", {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${User.token}`,
        },
      });

      // if (!response.ok && response.) {
      //   throw new Error('Failed to fetch data from API');
      // }

      const data = await response.json();
    //   console.log(data);
      setCurrentUserChat(data);
      
    } catch (error) {
      // Handle error here
      console.error(error);
    }
  };