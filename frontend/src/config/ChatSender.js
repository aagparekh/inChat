export const getSenderName = (loggedUser,users)=>{
    // console.log(users);
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
}

export const getSenderPic = (loggedUser,users)=>{
    // console.log(users);
    return users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
}
export const getSenderId = (loggedUser,users)=>{
    // console.log(users);
    return users[0]._id === loggedUser._id ? users[1]._id : users[0]._id;
}
export const getSender = (loggedUser,users)=>{
    // console.log(chat);
    // console.log("Logged User",loggedUser);
        return users[0]._id === loggedUser._id ? users[1] : users[0];
    
}