const users = [];

//Join users to chat
function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}//end function

//Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}//end function

//User leaves chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }//end if statement
//end function
}

//Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}//end module.exports