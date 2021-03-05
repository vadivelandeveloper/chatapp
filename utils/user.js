const users = [];
function userJoin(id, username,room){
    user={
        id,username,room    
    }
    users.push(user); 
    return user;
}
function getuser(id){
    return users.find(user=>user.id === id);
}
function getRoomUsers(room){
    return users.filter(user=>user.room === room);

}
function userLeaves(id){
    const index = users.findIndex(user=>user.id === id);

    if(index!= -1){
        return users.splice(index,1)[0];
    }

}
module.exports={
    userJoin, getuser,userLeaves,getRoomUsers
}