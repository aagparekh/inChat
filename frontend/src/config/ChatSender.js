export const getSenderName = (loggedUser, users) => {
  // console.log(users);
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderPic = (loggedUser, users) => {
  // console.log(users);
  return users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
};
export const getSenderId = (loggedUser, users) => {
  // console.log(users);
  return users[0]._id === loggedUser._id ? users[1]._id : users[0]._id;
};
export const getSenderEmail = (loggedUser, users) => {
  // console.log(users);
  return users[0]._id === loggedUser._id ? users[1].email : users[0].email;
};
export const getSender = (loggedUser, users) => {
  // console.log(chat);
  // console.log("Logged User",loggedUser);
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, m, i, loggedUserId) => {
  return (
    i < messages.length -1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    m.sender._id !== loggedUserId
  );
};

export const myChat = (m,loggedUserId) =>{
    return (
        m.sender._id === loggedUserId
    )
}  

export const isLastMessage = (messages,i,loggedUserId) =>{
    return(
        i === messages.length - 1 &&  messages[messages.length - 1].sender._id &&
        messages[messages.length - 1].sender._id !== loggedUserId 
    )
}