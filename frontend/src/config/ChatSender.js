export const getSenderName = (loggedUser,users)=>{
    // console.log(users);
    return users[0]._id == loggedUser._id ? users[1].name : users[0].name;
}

export const getSenderPic = (loggedUser,users)=>{
    // console.log(users);
    return users[0]._id == loggedUser._id ? users[1].pic : users[0].pic;
}