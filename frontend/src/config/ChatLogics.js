export const getSender = (loggedUser, users)=>{

    return users.length>0?(users[0]._id === loggedUser._id? users[1].name : users[0].name): (null);
}
export const getSenderFull = (loggedUser, users)=>{
    console.log("users from config: ", users)
    console.log("logged in user from config: ", loggedUser)
    return users.length>0?(users[0]._id === loggedUser._id? users[1] : users[0]): (null);
}